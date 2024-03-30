import { ActionIcon, Center, type SelectItem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { type Ingredient, type Unit } from "@prisma/client";
import { IconRotateClockwise2, IconPlus } from "@tabler/icons-react";
import { randomBytes } from "crypto";
import React from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { toTitleCase } from "~/utils/content";
import { IngredientField } from "../MealAdder/MealAdder";

interface IIngredientsEditor {
  id: string;
}

const IngredientsEditor: React.FC<IIngredientsEditor> = ({ id }) => {
  const { data: recipe } = api.recipes.get.useQuery({ id });
  const { data: ingredients } = api.ingredients.get.useQuery();
  const selectItemIngredients = getSelectableIngredients(ingredients);

  const { data: units } = api.units.get.useQuery();
  const selectItemUnits = getSelectableUnits(units);

  const { data: categories } = api.ingredients.categories.useQuery();
  const selectItemCategories = getSelectableCategories(categories);

  return (
    <div>
      {recipe && ingredients && ingredients.length > 0 ? (
        <IngredientsEditorForm
          recipe={recipe}
          ingredients={selectItemIngredients}
          units={selectItemUnits}
          categories={selectItemCategories}
        />
      ) : (
        <Center>
          <IconRotateClockwise2 className="animate-spin" />
        </Center>
      )}
    </div>
  );
};

interface IIngredientsEditorForm {
  recipe: RouterOutputs["recipes"]["get"];
  ingredients: SelectItem[];
  units: SelectItem[];
  categories: SelectItem[];
}

const IngredientsEditorForm: React.FC<IIngredientsEditorForm> = ({
  recipe,
  ingredients,
  units,
  categories,
}) => {
  const form = useForm({
    initialValues: {
      ingredients:
        recipe?.materials?.map((material) => ({
          key: randomBytes(4).toString("hex"),
          name: String(material.ingredient.id),
          qty: Number(material.qty),
          unit: material.unit.id,
          category: material.ingredient.category,
        })) || [],
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        console.log(values);
      })}
    >
      {form.values.ingredients.length > 0 &&
        form.values.ingredients?.map((ingredient, index) => (
          <IngredientField
            key={ingredient.key}
            form={form}
            index={index}
            defaultValues={{
              name: ingredient.name,
              qty: ingredient.qty,
              unit: ingredient.unit,
              category: ingredient.category,
            }}
            ingredients={ingredients}
            units={units}
            categories={categories}
          />
        ))}
      <ActionIcon
        onClick={() => form.insertListItem("ingredients", EMPTY_INGREDIENT())}
      >
        <IconPlus />
      </ActionIcon>
    </form>
  );
};

const EMPTY_INGREDIENT = () => ({
  key: randomBytes(4).toString("hex"),
  type: "00",
});

export default IngredientsEditor;

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
