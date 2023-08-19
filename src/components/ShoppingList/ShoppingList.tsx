import { Text, List, Flex, Collapse, Tooltip } from "@mantine/core";
import { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { groupBy } from "~/utils/helper";
import CategoryIcon from "../CategoryIcon";

const ShoppingList = () => {
  const { data: planData } = api.plan.get.useQuery();
  const shoppingData = plansToShoppingList(planData || []);
  const shopping = shoppingData
    ? groupBy(shoppingData, (item) => item.category)
    : [];

  return (
    <Flex
      direction="row"
      gap="md"
      align="flex-start"
      wrap="nowrap"
      className="h-full flex-wrap"
    >
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
    </Flex>
  );
};

interface IShoppingCategory {
  category: string;
  values: {
    id: number;
    qty: number;
    name: string;
    unit: string;
    category: string;
    meals: {
      name: string;
      id: number;
    }[];
  }[];
}

const ShoppingCategory: React.FC<IShoppingCategory> = ({
  category,
  values,
}) => {
  const [opened, setOpened] = useState(true);

  return (
    <div>
      <button onClick={() => setOpened(!opened)}>
        <CategoryIcon category={category} />
      </button>
      <Collapse in={opened}>
        <List>
          {values.map((entry, _index) => (
            <Ingredient entry={entry} key={`${entry.id}-${entry.unit}`} />
          ))}
        </List>
      </Collapse>
    </div>
  );
};

interface IIngredient {
  entry: {
    id: number;
    qty: number;
    name: string;
    unit: string;
    category: string;
    meals: {
      name: string;
      id: number;
    }[];
  };
}

const Ingredient: React.FC<IIngredient> = ({ entry }) => {
  const [struck, setStruck] = useState(false);

  return (
    <List.Item
      onClick={(e) => {
        setStruck((s) => !s);
      }}
    >
      <Tooltip
        openDelay={650}
        label={entry.meals.map((meal) => (
          <div key={meal.id}>{meal.name}</div>
        ))}
      >
        <Text
          size="sm"
          className={`w-full ${
            struck ? "line-through" : ""
          } hover:line-through`}
        >
          {entry.qty} {entry.unit}
          {entry.qty !== 1 && entry.unit.at(-1) !== "s" ? "s" : ""} {entry.name}
        </Text>
      </Tooltip>
    </List.Item>
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
