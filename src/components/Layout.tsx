import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import { type ReactElement } from "react";
import { PlannerHeader } from "./PlannerHeader/PlannerHeader";
import { PlannerNavbar } from "./PlannerNavbar/PlannerNavbar";

const Layout = ({ children }: { children: ReactElement }) => {
  const [isMenuOpen, { close: setMenuClosed, toggle: toggleMenuOpen }] =
    useDisclosure(false);

  const closer = () => {
    console.log('closing');
    setMenuClosed();
  }

  return (
    <>
      <Head>
        <title>Meal Planner</title>
        <meta name="description" content="Meal Planner by sebws" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        navbar={
          <PlannerNavbar
            isMenuOpen={isMenuOpen}
            setMenuClosed={closer}
          />
        }
        navbarOffsetBreakpoint="sm"
        header={
          <PlannerHeader
            isMenuOpen={isMenuOpen}
            toggleMenuOpen={toggleMenuOpen}
          />
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            maxHeight: "calc(100vh - 60px)",
            overflowY: "auto",
          },
        })}
        className="max-h-10"
      >
        {children}
      </AppShell>
    </>
  );
};

export default Layout;
