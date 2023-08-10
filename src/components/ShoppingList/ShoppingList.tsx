import {
  Text,
  List,
  Flex,
  Collapse,
  Tooltip,
  ScrollArea,
  Button,
} from "@mantine/core";
import { useState } from "react";
import { api } from "~/utils/api";
import { groupBy } from "~/utils/helper";
import CategoryIcon from "../CategoryIcon";

const ShoppingList = () => {
  const { data: shoppingData } = api.shopping.get.useQuery();
  const shopping = shoppingData
    ? groupBy(shoppingData, (item) => item.category)
    : [];

  return (
    // <ScrollArea className="h-full pl-5 pt-3" h="100vh" w="200%">
    <Flex
      direction="column"
      gap="sm"
      align="flex-start"
      // wrap="wrap"
      className="h-full flex-nowrap sm:flex-wrap"
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
    // </ScrollArea>
  );
};

interface IShoppingCategory {
  category: string;
  values: {
    meals: { id: number; name: string }[];
    ingredient_id: number;
    category: string;
    name: string;
    unit_id: number;
    unit: string;
    qty: number;
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
            <Ingredient
              entry={entry}
              key={`${entry.ingredient_id}-${entry.unit_id}`}
            />
          ))}
        </List>
      </Collapse>
    </div>
  );
};

interface IIngredient {
  entry: {
    meals: {
      id: number;
      name: string;
    }[];
    ingredient_id: number;
    category: string;
    name: string;
    unit_id: number;
    unit: string;
    qty: number;
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
          className={`w-full ${struck ? "line-through" : ""} ${
            struck ? "hover:no-underline" : "hover:line-through"
          }`}
        >
          {entry.qty} {entry.unit}
          {entry.qty !== 1 && entry.unit.at(-1) !== "s" ? "s" : ""} {entry.name}
        </Text>
      </Tooltip>
    </List.Item>
  );
};

export default ShoppingList;
