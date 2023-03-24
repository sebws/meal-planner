import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";

const mealArray = z.array(
  z.object({
    name: z.string(),
    id: z.number(),
  })
);

export const shoppingRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.$queryRaw<
      {
        ingredient_id: number;
        category: string;
        name: string;
        unit_id: number;
        unit: string;
        qty: number;
        meals: string;
      }[]
    >`
      select
        ingredients.id as ingredient_id,
        ingredients.category,
        ingredients.name,
        units.id as unit_id,
        units.name as unit,
        round(sum(materials.qty * (cast(plan.serves as real) / meals.servings)), 2) as qty,
        json_group_array(json_object('name', meals.name, 'id', meals.id)) as meals
      from
        plan
      join
        materials on plan.meal_id=materials.meal_id
      join
        ingredients on ingredients.id=materials.ingredient_id
      join
        units on units.id=materials.unit_id
      join
        meals on meals.id=materials.meal_id
      group by
        ingredients.category, ingredients.name, units.id
      having
        round(sum(materials.qty * (cast(plan.serves as real) / meals.servings)), 2) != 0;
      `.then((rows) => {
      return rows.map((row) => ({
        ...row,
        meals: mealArray.parse(JSON.parse(row.meals)),
      }));
    });
  }),
});
