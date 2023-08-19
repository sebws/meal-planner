'use client';

import { List, Tooltip, Text } from "@mantine/core";
import { useState } from "react";

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
      onClick={() => {
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

export default Ingredient;
