import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Table,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { api, type RouterOutputs } from "~/utils/api";
import { type NextPage } from "next";
import meals from "./meals";
import { minimalInputStyle } from "~/utils/helper";
import { useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import ConfirmModal from "~/components/ConfirmModal/ConfirmModal";

const Ingredients: NextPage = () => {
  const { data: ingredientsData } = api.ingredients.get.useQuery();
  const [search, setSearch] = useDebouncedState("", 300);

  const ingredients = search
    ? ingredientsData?.filter(
        (ingredient) =>
          ingredient.name.toLowerCase().includes(search.toLowerCase()) ||
          ingredient.category.toLowerCase().includes(search.toLowerCase())
      )
    : ingredientsData;

  return (
    <Stack>
      <Group>
        <TextInput
          className="w-full sm:w-auto"
          label="Filter ingredients"
          placeholder="Search by name"
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button
          className="w-full self-end sm:w-auto"
          variant="outline"
          // onClick={open}
        >
          Add ingredient
        </Button>
      </Group>
      <Table horizontalSpacing="xs" className="w-full table-fixed overflow-auto">
        <colgroup>
          <col className="w-4/6 sm:w-1/2" span={1} />
          <col className="sm:w-1/3" span={1} />
          <col className="hidden sm:table-cell" span={1} />
          <col className="hidden sm:table-cell" span={1} />
        </colgroup>
        <thead>
          <tr>
            <th className="">Meal</th>
            <th className="sm:w-1/3">Location</th>
            <th className="hidden sm:table-cell sm:w-1/6">Serves</th>
            <th className="hidden sm:table-cell sm:w-1/6"></th>
          </tr>
        </thead>
        <tbody>
          {ingredients?.map((ingredient) => (
            <Ingredient key={ingredient.id} ingredient={ingredient} />
          ))}
        </tbody>
      </Table>
    </Stack>
  );
};

const Ingredient = ({
  ingredient,
}: {
  ingredient: RouterOutputs["ingredients"]["get"][number];
}) => {
  const utils = api.useContext();

  const [
    confirmDeleteOpened,
    { open: openConfirmDelete, close: closeConfirmDelete },
  ] = useDisclosure(false);

  const update = api.ingredients.update.useMutation({
    onSettled: () => utils.ingredients.get.invalidate(),
    onMutate: async (data) => {
      await utils.ingredients.get.cancel();
      const prevData = utils.ingredients.get.getData();
      utils.ingredients.get.setData(undefined, (old) =>
        old !== undefined
          ? old.map((ingredient) =>
              ingredient.id === data.id
                ? { ...ingredient, ...data }
                : ingredient
            )
          : undefined
      );
      return { prevData };
    },
    onError: (_err, _data, ctx) => {
      utils.ingredients.get.setData(undefined, ctx?.prevData);
    },
  });

  const relatedMeals = api.meals.get.useQuery(
    { hasIngredientIds: [ingredient.id] },
    { enabled: confirmDeleteOpened }
  );

  const deleteIngredient = api.ingredients.delete.useMutation({
    onSettled: () => utils.ingredients.get.invalidate(),
  });

  const [name, setName] = useState(ingredient.name);
  const [category, setCategory] = useState(ingredient.category);

  return (
    <tr>
      <td className="px-4 py-2">
        <Textarea
          className="break-word overflow-hidden"
          value={name}
          variant="unstyled"
          onBlur={({ target: { value: name } }) => {
            if (name !== ingredient.name) {
              update.mutate({ id: ingredient.id, name });
            }
          }}
          onChange={(selection) => {
            setName(selection.target.value);
          }}
          autosize
          styles={minimalInputStyle}
        />
      </td>
      <td className="px-4 py-2">
        {" "}
        <Textarea
          className="break-word overflow-hidden"
          value={category}
          variant="unstyled"
          onBlur={({ target: { value: category } }) => {
            if (category !== ingredient.category) {
              update.mutate({ id: ingredient.id, category });
            }
          }}
          onChange={(selection) => {
            setCategory(selection.target.value);
          }}
          autosize
          styles={minimalInputStyle}
        />
      </td>
      <ConfirmModal
        action={() => deleteIngredient.mutate({ id: ingredient.id })}
        actionDescription={
          <>
            Delete {ingredient.name}.
            {relatedMeals.data?.length && relatedMeals.data?.length > 0 && (
              <>
                {" "}
                This will remove it from:
                <ul>
                  {relatedMeals.data?.map((meal) => (
                    <li key={meal.id}>{meal.name}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        }
        opened={confirmDeleteOpened}
        onClose={closeConfirmDelete}
      />
      <td className="hidden px-4 py-2 sm:table-cell">
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => openConfirmDelete()}
        >
          <IconTrash stroke={1.5} />
        </ActionIcon>
      </td>
    </tr>
  );
};

export default Ingredients;
