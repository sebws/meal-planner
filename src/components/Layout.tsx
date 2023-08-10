import { AppShell } from "@mantine/core";
import Head from "next/head";
import { useState, type ReactElement } from "react";
import { PlannerHeader } from "./PlannerHeader/PlannerHeader";
import { PlannerNavbar } from "./PlannerNavbar/PlannerNavbar";

const Layout = ({ children }: { children: ReactElement }) => {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        navbar={<PlannerNavbar opened={menuOpened} />}
        navbarOffsetBreakpoint="sm"
        header={<PlannerHeader opened={menuOpened} setOpened={setMenuOpened} />}
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