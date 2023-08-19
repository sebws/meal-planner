import { Text, List, Flex, Collapse, Tooltip } from "@mantine/core";
import { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { groupBy } from "~/utils/helper";
import CategoryIcon from "../CategoryIcon";
import ShoppingCategory from "./ShoppingCategory";

const ShoppingList = () => {
  const { data: shoppingData } = api.plan.get.useQuery(undefined, {select: plansToShoppingList});
  const shopping = shoppingData
    ? groupBy(shoppingData, (item) => item.category)
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
      {Object.entries(shopping)
        .sort(
          ([_cat_a, values_a], [_cat_b, values_b]) =>
            values_b.length - values_a.length
        )
        .map(([category, values]) => (
          <ShoppingCategory
            key={category}
            category={category}
            values={values}
          />
        ))}
    </div>
  );
};

const plansToShoppingList = (plans: RouterOutputs["plan"]["get"]) =>
  Object.values(
    plans
      .flatMap((plan) =>
        plan.meal.materials.map((material) => ({
          id: material.ingredient.id,
          qty:
            Math.round(
              material.qty * (plan.serves / plan.meal.servings) * 100
            ) / 100,
          name: material.ingredient.name,
          unit: material.unit.name,
          category: material.ingredient.category,
          meals: [
            {
              name: plan.meal.name,
              id: plan.meal.id,
            },
          ],
        }))
      )
      .reduce(
        (acc, value) => {
          const key = `${value.id}${value.unit}`;
          const val = acc[key];
          if (val !== undefined) {
            val.qty += value.qty;
            val.meals = val.meals.concat(value.meals);
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as {
          [key: string]: {
            id: number;
            qty: number;
            name: string;
            unit: string;
            category: string;
            meals: { name: string; id: number }[];
          };
        }
      )
  );

export default ShoppingList;
