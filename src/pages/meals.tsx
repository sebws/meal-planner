import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  Stack,
  Table,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { type NextPage } from "next";
import { useState } from "react";
import ConfirmModal from "~/components/ConfirmModal/ConfirmModal";
import IngredientsEditor from "~/components/IngredientsEditor.tsx/IngredientsEditor";
import { MealAdder } from "~/components/MealAdder/MealAdder";
import { api, type RouterOutputs } from "~/utils/api";
import { minimalInputStyle } from "~/utils/helper";

const Meals: NextPage = () => {
  const { data: mealsData } = api.meals.get.useQuery();
  const [search, setSearch] = useDebouncedState("", 300);
  const [opened, { open, close }] = useDisclosure(false);
  const meals = search
    ? mealsData?.filter(
        (meal) =>
          meal.name.toLowerCase().includes(search.toLowerCase()) ||
          meal.materials.some((material) =>
            material.ingredient.name
              .toLowerCase()
              .includes(search.toLowerCase())
          )
      )
    : mealsData;

  return (
    <>
      <Modal size={"xl"} centered opened={opened} onClose={close}>
        <MealAdder onClose={close}/>
      </Modal>
      <Stack>
        <Group>
          <TextInput
            className="w-full sm:w-auto"
            label="Filter meals"
            placeholder="Search by name or ingredient"
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button
            className="w-full self-end sm:w-auto"
            variant="outline"
            onClick={open}
          >
            Add meal
          </Button>
        </Group>
        <Table
          horizontalSpacing="xs"
          className="w-fit table-fixed overflow-auto"
        >
          <colgroup>
            <col className="w-4/6 sm:w-1/2" span={1} />
            <col className="sm:w-1/3" span={1} />
            <col className="hidden sm:table-cell" span={1} />
            <col className="hidden sm:table-cell" span={1} />
          </colgroup>
          <thead>
            <tr>
              <th>Meal</th>
              <th className="sm:w-1/3">Location</th>
              <th className="hidden sm:table-cell sm:w-1/6">Serves</th>
              <th className="hidden sm:table-cell sm:w-1/6"></th>
            </tr>
          </thead>
          <tbody>
            {meals?.map((meal) => (
              <Meal key={meal.id} meal={meal} />
            ))}
          </tbody>
        </Table>
      </Stack>
    </>
  );
};

interface IMeal {
  meal: RouterOutputs["meals"]["get"][number];
}

const Meal: React.FC<IMeal> = ({ meal }) => {
  const utils = api.useContext();

  const update = api.meals.update.useMutation({
    onSettled: () => utils.meals.get.invalidate(),
    onMutate: async (data) => {
      await utils.meals.get.cancel();
      const prevData = utils.meals.get.getData();
      utils.meals.get.setData(undefined, (old) =>
        old !== undefined
          ? old.map((meal) =>
              meal.id === data.id ? { ...meal, ...data } : meal
            )
          : undefined
      );
      return { prevData };
    },
    onError: (_err, _data, ctx) => {
      utils.meals.get.setData(undefined, ctx?.prevData);
    },
  });

  const deleteMeal = api.meals.delete.useMutation({
    onSettled: () => utils.meals.get.invalidate(),
  });

  const [name, setName] = useState(meal.name);
  const [location, setLocation] = useState(meal.location);

  const [
    confirmDeleteOpened,
    { open: openConfirmDelete, close: closeConfirmDelete },
  ] = useDisclosure(false);
  const [
    editIngredientsOpened,
    { open: openEditIngredients, close: closeEditIngredients },
  ] = useDisclosure(false);

  return (
    <tr>
      <td className="w-full">
        <Textarea
          className="break-word overflow-hidden"
          value={name}
          variant="unstyled"
          onBlur={(selection) => {
            if (selection.target.value !== meal.name) {
              update.mutate({ id: meal.id, name: selection.target.value });
            }
          }}
          onChange={(selection) => {
            setName(selection.target.value);
          }}
          autosize
          styles={minimalInputStyle}
        />
      </td>
      <td className="break-all">
        <Textarea
          className="break-word overflow-hidden"
          value={location}
          variant="unstyled"
          onBlur={({ target: { value: location } }) => {
            if (location !== meal.location) {
              update.mutate({ id: meal.id, location });
            }
          }}
          onChange={(selection) => {
            setLocation(selection.target.value);
          }}
          autosize
          styles={minimalInputStyle}
        />
      </td>
      <td className="hidden sm:table-cell">
        <NumberInput
          className="break-word overflow-hidden"
          value={meal.servings}
          variant="unstyled"
          min={0}
          step={1}
          onChange={(servings) => {
            if (servings !== "") {
              update.mutate({ id: meal.id, servings });
            }
          }}
          styles={minimalInputStyle}
        />
      </td>
      <td className="hidden sm:table-cell">
        <ConfirmModal
          action={() => deleteMeal.mutate({ id: meal.id })}
          actionDescription={`Delete "${meal.name}"`}
          opened={confirmDeleteOpened}
          onClose={closeConfirmDelete}
        />
        <Modal
          size={"xl"}
          centered
          opened={editIngredientsOpened}
          onClose={closeEditIngredients}
        >
          <IngredientsEditor id={meal.id} />
        </Modal>
        <Flex direction={"row"} justify="space-around">
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => openConfirmDelete()}
          >
            <IconTrash stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="green"
            onClick={() => openEditIngredients()}
          >
            <IconEdit stroke={1.5} />
          </ActionIcon>
        </Flex>
      </td>
    </tr>
  );
};

export default Meals;
