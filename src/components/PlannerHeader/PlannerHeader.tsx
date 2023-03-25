import { Button, Header, NavLink, Text } from "@mantine/core";
import { IconMeat } from "@tabler/icons-react";
import Link from "next/link";

export const PlannerHeader = () => (
  <Header height="60" className="p-4">
    <div className="flex h-full align-middle">
      <Link href="/">
        <Button variant="subtle" color="dark">
          <Text size="xl" weight={700} className="flex-1">
            Planner
          </Text>
        </Button>
      </Link>
    </div>
  </Header>
);
