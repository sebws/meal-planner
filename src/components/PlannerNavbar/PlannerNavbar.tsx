import { Navbar, NavLink } from "@mantine/core";
import { IconCalendar, IconMeat, IconToolsKitchen2 } from "@tabler/icons-react";
import Link from "next/link";

export const PlannerNavbar = () => (
  <Navbar width={{ base: 200 }} className="p-4">
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
