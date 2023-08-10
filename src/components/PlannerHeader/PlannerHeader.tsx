import { useLocalStorage } from "@mantine/hooks";
import {
  ActionIcon,
  Avatar,
  Burger,
  MediaQuery,
  useMantineTheme,
  type ColorScheme,
} from "@mantine/core";
import {
  IconSun,
  IconMoonStars,
  IconLockAccessOff,
  IconLogin,
} from "@tabler/icons-react";
import { Button, Header, NavLink, Text } from "@mantine/core";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

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
    <Header height="60" className="items-center p-4">
      <div className="flex h-full items-center justify-between">
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
        <SessionButton />
        <ColorSchemeToggle />
      </div>
    </Header>
  );
};

const SessionButton: React.FC = () => {
  const { data: session } = useSession();

  return session ? (
    <Avatar
      src={session.user.image}
      alt={session.user.name ?? ""}
      onClick={() => {
        signOut().catch(console.error);
      }}
    />
  ) : (
    <ActionIcon
      onClick={() => {
        signIn("discord").catch(console.error);
      }}
    >
      <IconLogin />
    </ActionIcon>
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
