'use client';

import { Collapse, List } from "@mantine/core";
import { useState } from "react";
import CategoryIcon from "../CategoryIcon";
import Ingredient from "./Ingredient";

interface IShoppingCategory {
  category: string;
  values: {
    id: string;
    qty: number;
    name: string;
    unit: string;
    category: string;
    meals: {
      name: string;
      id: string;
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

export default ShoppingCategory;
