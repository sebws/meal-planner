import { ThemeIcon, Tooltip } from "@mantine/core";
import {
  IconPaperBag,
  IconCarrot,
  IconMeat,
  IconSalt,
  IconMilk,
  IconBeer,
  IconIceCream,
  IconFridge,
  IconBread,
} from "@tabler/icons-react";
import { toTitleCase } from "../utils/content";

type Category =
  | "packaged"
  | "produce"
  | "meat"
  | "canned"
  | "dairy"
  | "alcohol"
  | "frozen"
  | "fridge";

interface ICategoryIcon {
  category: Category | string;
}

const CategoryIcon: React.FC<ICategoryIcon> = ({ category }) => {
  let icon;
  let gradient;
  switch (category) {
    case "packaged":
      icon = <IconPaperBag />;
      gradient = { from: "brown", to: "orange" };
      break;
    case "produce":
      icon = <IconCarrot />;
      gradient = { from: "teal", to: "lime" };
      break;
    case "meat":
      icon = <IconMeat />;
      gradient = { from: "orange", to: "red" };
      break;
    case "canned":
      icon = <IconSalt />;
      gradient = { from: "silver", to: "gray" };
      break;
    case "dairy":
      icon = <IconMilk />;
      gradient = { from: "blue", to: "indigo" };
      break;
    case "alcohol":
      icon = <IconBeer />;
      gradient = { from: "red", to: "purple" };
      break;
    case "frozen":
      icon = <IconIceCream />;
      gradient = { from: "grape", to: "pink" };
      break;
    case "fridge":
      icon = <IconFridge />;
      gradient = { from: "purple", to: "gray" };
      break;
    default:
      icon = <IconBread />;
      break;
  }

  return (
    <Tooltip label={toTitleCase(category)}>
      <ThemeIcon variant="gradient" gradient={gradient} color="gray">
        {icon}
      </ThemeIcon>
    </Tooltip>
  );
};

export default CategoryIcon;
