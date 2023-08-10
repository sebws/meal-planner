import { Badge, Text } from "@mantine/core";

interface IMealTag {
  meal: {
    id: number;
    name: string;
  };
}

const MealTag: React.FC<IMealTag> = ({ meal }) => {
  return (
    <Badge variant="outline" color="gray">
      {meal.name}
    </Badge>
  );
};

export default MealTag;
