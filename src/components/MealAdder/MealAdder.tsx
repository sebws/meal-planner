/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  NumberInput,
  Select,
  type SelectItem,
  TextInput,
} from "@mantine/core";
import { useForm, type UseFormReturnType, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { type Ingredient, type Unit } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { randomBytes } from "crypto";
import { useState } from "react";
import { z } from "zod";
import { api, type RouterInputs } from "~/utils/api";
import { toTitleCase } from "~/utils/content";

const baseIngredient = {
  key: z.string().nonempty(),
  qty: z.coerce.number().positive().int(),
};

const newName = {
  ingredientId: z.string().nonempty(),
  category: z.string().nonempty(),
};

const newUnit = {
  unitId: z.string().nonempty(),
};

const existingName = {
  ingredientId: z.coerce.number().nonnegative().int(),
};

const existingUnit = {
  unitId: z.coerce.number().nonnegative().int(),
};

const IngredientType = {
  NewName: {
    NewUnit: "11",
    ExistingUnit: "10",
  },
  ExistingName: {
    NewUnit: "01",
    ExistingUnit: "00",
  },
} as const;

const newNameNewUnit = z.object({
  ...baseIngredient,
  ...newName,
  ...newUnit,
  type: z.literal(IngredientType.NewName.NewUnit),
});

const newNameExistingUnit = z.object({
  ...baseIngredient,
  ...newName,
  ...existingUnit,
  type: z.literal(IngredientType.NewName.ExistingUnit),
});

const existingNameNewUnit = z.object({
  ...baseIngredient,
  ...existingName,
  ...newUnit,
  type: z.literal(IngredientType.ExistingName.NewUnit),
});

const existingNameExistingUnit = z.object({
  ...baseIngredient,
  ...existingName,
  ...existingUnit,
  type: z.literal(IngredientType.ExistingName.ExistingUnit),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is a required field"),
  location: z.string().min(1, "Location is a required field"),
  servings: z.coerce
    .number()
    .positive("Servings must be positive")
    .int("Servings must be an integer"),
  ingredients: z.array(
    z.discriminatedUnion("type", [
      newNameNewUnit,
      newNameExistingUnit,
      existingNameNewUnit,
      existingNameExistingUnit,
    ])
  ),
});

type FormValues = z.infer<typeof formSchema>;

const initialValues: FormValues = {
  name: "",
  location: "",
  servings: 4,
  ingredients: [],
};

interface IMealAdder {
  onClose: () => void;
}

export const MealAdder: React.FC<IMealAdder> = ({ onClose }) => {
  const form = useForm({
    initialValues,
    validate: zodResolver(formSchema),
    transformValues: (values): RouterInputs["recipes"]["add"] => ({
      meal: {
        name: values.name,
        location: values.location,
        servings: values.servings,
      },
      ingredients: values.ingredients.map((ingredient) => {
        switch (ingredient.type) {
          case IngredientType.NewName.NewUnit:
            return {
              type: ingredient.type,
              name: ingredient.ingredientId.slice(7),
              unit: ingredient.unitId.slice(7),
              qty: ingredient.qty,
              category: ingredient.category,
            };
          case IngredientType.NewName.ExistingUnit:
            return {
              type: ingredient.type,
              name: ingredient.ingredientId.slice(7),
              unit_id: ingredient.unitId,
              qty: ingredient.qty,
              category: ingredient.category,
            };
          case IngredientType.ExistingName.NewUnit:
            return {
              type: ingredient.type,
              ingredient_id: ingredient.ingredientId,
              unit: ingredient.unitId.slice(7),
              qty: ingredient.qty,
            };
          case IngredientType.ExistingName.ExistingUnit:
            return {
              type: ingredient.type,
              ingredient_id: ingredient.ingredientId,
              unit_id: ingredient.unitId,
              qty: ingredient.qty,
            };
        }
      }),
    }),
  });

  const { data: ingredients } = api.ingredients.get.useQuery();
  const selectItemIngredients = getSelectableIngredients(ingredients);

  const { data: units } = api.units.get.useQuery();
  const selectItemUnits = getSelectableUnits(units);

  const { data: categories } = api.ingredients.categories.useQuery();
  const selectItemCategories = getSelectableCategories(categories);

  const utils = api.useContext();

  const submit = api.recipes.add.useMutation({
    onSettled: () => utils.meals.get.invalidate(),
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        onClose();
        return submit.mutate(values);
      })}
    >
      <TextInput
        withAsterisk
        label="Name"
        placeholder="Spaghetti Bolognese"
        {...form.getInputProps("name")}
      />
      <NumberInput
        withAsterisk
        label="Servings"
        placeholder="4"
        {...form.getInputProps("servings")}
      />
      <TextInput
        withAsterisk
        label="Location"
        placeholder="OTK p.123"
        {...form.getInputProps("location")}
      />
      <Divider className="mt-4" />
      <Button
        className="my-4"
        onClick={() => form.insertListItem("ingredients", EMPTY_INGREDIENT())}
        variant="outline"
      >
        Add Ingredient
      </Button>
      {form.values.ingredients.map((ingredient, index) => {
        return (
          <IngredientField
            key={ingredient.key}
            form={form}
            index={index}
            ingredients={selectItemIngredients}
            units={selectItemUnits}
            categories={selectItemCategories}
          />
        );
      })}
      <Group position="right">
        <Button className="mt-4" type="submit" variant="outline">
          Submit
        </Button>
      </Group>
    </form>
  );
};

interface IIngredientField {
  form: any;
  index: number;
  ingredients: SelectItem[];
  units: SelectItem[];
  categories: SelectItem[];
  defaultValues?: {
    name?: string;
    unit?: string;
    qty?: number;
    category?: string;
  };
}

export const IngredientField: React.FC<IIngredientField> = ({
  form,
  index,
  ingredients,
  units,
  categories,
  defaultValues,
}) => {
  const [showCategory, { open: show, close: hide }] = useDisclosure(false);
  const [newIngredient, setNewIngredient] = useState<SelectItem[]>([]);
  const [newUnit, setNewUnit] = useState<SelectItem[]>([]);
  const [newCategory, setNewCategory] = useState<SelectItem[]>([]);

  return (
    <Flex className="mb-2">
      <Select
        label="Name"
        className="mr-2"
        data={[...ingredients, ...newIngredient]}
        searchable
        creatable
        placeholder="Sugar"
        defaultValue={defaultValues?.name}
        getCreateLabel={getCreateLabel}
        onCreate={(query) => {
          const item = {
            label: toTitleCase(query),
            value: `__new__${query}`,
          };
          show();
          setNewIngredient([item]);
          form.setFieldValue(
            `ingredients.${index}.type`,
            `1${form.values.ingredients[index]?.type?.at(1) || "0"}`
          );
          return item;
        }}
        {...form.getInputProps(`ingredients.${index}.ingredientId`)}
        onChange={(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          form
            .getInputProps(`ingredients.${index}.ingredientId`)
            .onChange(value);

          const isNew = value?.startsWith("__new__");

          if (!isNew) {
            setNewIngredient([]);
          }

          form.setFieldValue(
            `ingredients.${index}.type`,
            `${isNew ? "1" : "0"}${
              form.values.ingredients[index]?.type?.at(1) || "0"
            }`
          );
        }}
      />
      <NumberInput
        label="Qty"
        placeholder="4"
        min={0}
        className="mr-2 basis-1/3"
        defaultValue={defaultValues?.qty}
        {...form.getInputProps(`ingredients.${index}.qty`)}
      />
      <Select
        label="Unit"
        className="mr-2"
        data={[...units, ...newUnit]}
        searchable
        creatable
        placeholder="Teaspoon"
        nothingFound="Nothing found"
        getCreateLabel={getCreateLabel}
        defaultValue={defaultValues?.unit}
        onCreate={(query) => {
          const item = {
            label: toTitleCase(query),
            value: `__new__${query}`,
          };
          setNewUnit([item]);
          form.setFieldValue(
            `ingredients.${index}.type`,
            `${form.values.ingredients[index]?.type?.at(0) || "0"}1`
          );
          return item;
        }}
        {...form.getInputProps(`ingredients.${index}.unitId`)}
        onChange={(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          form.getInputProps(`ingredients.${index}.unitId`).onChange(value);

          const isNew = value?.startsWith("__new__");

          if (!isNew) {
            setNewUnit([]);
          }

          form.setFieldValue(
            `ingredients.${index}.type`,
            `${form.values.ingredients[index]?.type?.at(0) || "0"}${
              isNew ? "1" : "0"
            }`
          );
        }}
      />
      {showCategory && (
        <Select
          label="Category"
          className="mr-2"
          data={[...categories, ...newCategory]}
          searchable
          creatable
          placeholder="Dairy"
          defaultValue={defaultValues?.category}
          getCreateLabel={getCreateLabel}
          onCreate={(query) => {
            const item = {
              label: toTitleCase(query),
              value: query,
            };
            setNewCategory([item]);
            return item;
          }}
          {...form.getInputProps(`ingredients.${index}.category`)}
        />
      )}
      <ActionIcon
        size="lg"
        variant="outline"
        className="self-end"
        onClick={() => form.removeListItem(`ingredients`, index)}
      >
        <IconTrash />
      </ActionIcon>
    </Flex>
  );
};

const EMPTY_INGREDIENT = () => ({
  key: randomBytes(4).toString("hex"),
  type: "00",
});

const getCreateLabel = (string: string): string => `+ Create "${string}"`;

const getSelectableCategories = (
  categories: { category: string }[] | undefined
) =>
  (categories || []).map((category) => ({
    label: toTitleCase(category.category),
    value: category.category,
  }));

const getSelectableUnits = (units: Unit[] | undefined) =>
  (units || []).map((unit) => ({
    label: toTitleCase(unit.name),
    value: String(unit.id),
  }));

const getSelectableIngredients = (ingredients: Ingredient[] | undefined) =>
  (ingredients || []).map((ingredient) => ({
    label: toTitleCase(ingredient.name),
    value: String(ingredient.id),
  }));
