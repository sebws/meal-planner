/* eslint-disable camelcase */
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";

const zodNewIngredientWithNewUnit = z.object({
  name: z.string(),
  unit: z.string(),
  qty: z.number(),
  category: z.string(),
});

const zodNewIngredient = z.object({
  name: z.string(),
  unit_id: z.number(),
  qty: z.number(),
  category: z.string(),
});

const zodExistingIngredientWithNewUnit = z.object({
  ingredient_id: z.number(),
  unit: z.string(),
  qty: z.number(),
});

const zodExistingIngredient = z.object({
  ingredient_id: z.number(),
  unit_id: z.number(),
  qty: z.number(),
});

const ingredientTypes = z.union([
  zodNewIngredientWithNewUnit,
  zodNewIngredient,
  zodExistingIngredientWithNewUnit,
  zodExistingIngredient,
]);

type NewIngredient = z.infer<typeof zodNewIngredient>;
type NewIngredientWithNewUnit = z.infer<typeof zodNewIngredientWithNewUnit>;
type ExistingIngredientWithNewUnit = z.infer<
  typeof zodExistingIngredientWithNewUnit
>;
type ExistingIngredient = z.infer<typeof zodExistingIngredient>;

type Ingredient = z.infer<typeof ingredientTypes>;

export const recipesRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input: { id } }) => {
      return ctx.prisma.meal.findMany({
        include: {
          materials: {
            include: {
              ingredient: true,
            },
          },
        },
        where: {
          id,
        },
      });
    }),
  add: publicProcedure
    .input(
      z.object({
        meal: z.object({
          name: z.string(),
          location: z.string(),
          servings: z.number(),
        }),
        ingredients: z.array(ingredientTypes),
      })
    )
    .mutation(({ ctx, input: { meal, ingredients } }) => {
      const existingIngredients = ingredients.filter(isExisting);
      const existingIngredientsWithNewUnit = ingredients.filter(
        isExistingWithNewUnit
      );
      const newIngredients = ingredients.filter(isNew);
      const newIngredientsWithNewUnit = ingredients.filter(isNewWithNewUnit);

      return ctx.prisma.meal.create({
        data: {
          ...meal,
          materials: {
            create: [
              ...existingIngredients.map((ingredient) => ({
                qty: ingredient.qty,
                unit: { connect: { id: ingredient.unit_id } },
                ingredient: { connect: { id: ingredient.ingredient_id } },
              })),
              ...existingIngredientsWithNewUnit.map((ingredient) => ({
                qty: ingredient.qty,
                unit: { create: { name: ingredient.unit } },
                ingredient: { connect: { id: ingredient.ingredient_id } },
              })),
              ...newIngredients.map((ingredient) => ({
                qty: ingredient.qty,
                unit: { connect: { id: ingredient.unit_id } },
                ingredient: {
                  create: {
                    name: ingredient.name,
                    category: ingredient.category,
                  },
                },
              })),
              ...newIngredientsWithNewUnit.map((ingredient) => ({
                qty: ingredient.qty,
                unit: { create: { name: ingredient.unit } },
                ingredient: {
                  create: {
                    name: ingredient.name,
                    category: ingredient.category,
                  },
                },
              })),
            ],
          },
        },
      });
    }),
});

const isExisting = (
  ingredient: Ingredient
): ingredient is ExistingIngredient => {
  return (
    "ingredient_id" in ingredient &&
    "unit_id" in ingredient &&
    "qty" in ingredient
  );
};

const isExistingWithNewUnit = (
  ingredient: Ingredient
): ingredient is ExistingIngredientWithNewUnit => {
  return (
    "ingredient_id" in ingredient && "unit" in ingredient && "qty" in ingredient
  );
};

const isNew = (ingredient: Ingredient): ingredient is NewIngredient => {
  return (
    "name" in ingredient &&
    "unit_id" in ingredient &&
    "qty" in ingredient &&
    "category" in ingredient
  );
};

const isNewWithNewUnit = (
  ingredient: Ingredient
): ingredient is NewIngredientWithNewUnit => {
  return (
    "name" in ingredient &&
    "unit" in ingredient &&
    "qty" in ingredient &&
    "category" in ingredient
  );
};
