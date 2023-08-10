import { Navbar, NavLink } from "@mantine/core";
import { IconCalendar, IconMeat, IconToolsKitchen2 } from "@tabler/icons-react";
import Link from "next/link";

interface IPlannerNavbar {
  opened: boolean;
}

export const PlannerNavbar: React.FC<IPlannerNavbar> = ({ opened }) => (
  <Navbar width={{ md: 175, sm: 80 }} hiddenBreakpoint="sm" hidden={!opened} className="p-4">
    <Navbar.Section>
      <Link href="/">
        <NavLink label="Planner" icon={<IconCalendar />} />
      </Link>
      <Link href="/meals">
        <NavLink label="Meals" icon={<IconToolsKitchen2 />} />
      </Link>
      <Link href="/ingredients">
        <NavLink label="Ingredients" icon={<IconMeat />} />
      </Link>
    </Navbar.Section>
  </Navbar>
);
