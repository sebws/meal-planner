import { Navbar, NavLink } from "@mantine/core";
import { IconCalendar, IconMeat, IconToolsKitchen2 } from "@tabler/icons-react";
import Link from "next/link";

interface IPlannerNavbar {
  isMenuOpen: boolean;
  setMenuClosed: () =>  void;
}

export const PlannerNavbar: React.FC<IPlannerNavbar> = ({ isMenuOpen, setMenuClosed }) => (
  <Navbar width={{ md: 175, sm: 80 }} hiddenBreakpoint="sm" hidden={!isMenuOpen} className="p-4">
    <Navbar.Section>
      <Link href="/">
        <NavLink onClick={setMenuClosed} label="Planner" icon={<IconCalendar />} />
      </Link>
      <Link href="/meals">
        <NavLink onClick={setMenuClosed} label="Meals" icon={<IconToolsKitchen2 />} />
      </Link>
      <Link href="/ingredients">
        <NavLink onClick={setMenuClosed} label="Ingredients" icon={<IconMeat />} />
      </Link>
    </Navbar.Section>
  </Navbar>
);
