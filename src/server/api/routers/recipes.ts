/* eslint-disable camelcase */
import { z } from "zod";
import { publicProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

const zodNewIngredientWithNewUnit = z.object({
  type: z.literal("11"),
  name: z.string(),
  unit: z.string(),
  qty: z.number(),
  category: z.string(),
});

const zodNewIngredient = z.object({
  type: z.literal("10"),
  name: z.string(),
  unit_id: z.string(),
  qty: z.number(),
  category: z.string(),
});

const zodExistingIngredientWithNewUnit = z.object({
  type: z.literal("01"),
  ingredient_id: z.string(),
  unit: z.string(),
  qty: z.number(),
});

const zodExistingIngredient = z.object({
  type: z.literal("00"),
  ingredient_id: z.string(),
  unit_id: z.string(),
  qty: z.number(),
});

const ingredientTypes = z.discriminatedUnion("type", [
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
      return ctx.prisma.meal.findFirst({
        include: {
          materials: {
            include: {
              ingredient: true,
              unit: true,
            },
          },
        },
        where: {
          id,
        },
      });
    }),
  add: protectedProcedure
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
  // update: publicProcedure.input(z.object({
  //   id: z.number(),
  //   ingredients: z.array(ingredientTypes),
  // })).mutation(({ ctx, input: { id, meal, ingredients } }) => {
  //   return ctx.prisma.meal.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       ...meal,
  //       materials: {

  //   })
  // }),
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
