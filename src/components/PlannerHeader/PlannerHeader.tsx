import { useLocalStorage } from "@mantine/hooks";
import {
  ActionIcon,
  Burger,
  MediaQuery,
  useMantineTheme,
  type ColorScheme,
} from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { Button, Header, NavLink, Text } from "@mantine/core";
import { IconMeat } from "@tabler/icons-react";
import Link from "next/link";

interface IPlannerHeader {
  opened: boolean;
  setOpened: (func: (o: boolean) => boolean) => void;
}

export const PlannerHeader: React.FC<IPlannerHeader> = ({
  opened,
  setOpened,
}) => {
  const theme = useMantineTheme();
  return (
    <Header height="60" className="p-4 items-center">
      <div className="flex h-full justify-between items-center">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
          />
        </MediaQuery>
        <Button variant="subtle" color="dark" className="items-center">
          <Link href="/">
            <Text size="xl" weight={700}>
              Planner
            </Text>
          </Link>
        </Button>
        <ColorSchemeToggle />
      </div>
    </Header>
  );
};

const ColorSchemeToggle: React.FC = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
  });

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <ActionIcon onClick={toggleColorScheme}>
      {colorScheme === "dark" ? <IconSun /> : <IconMoonStars />}
    </ActionIcon>
  );
};
