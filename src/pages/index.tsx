import { type NextPage } from "next";
import { Container } from "@mantine/core";
import { PlannerTimeline } from "~/components/PlannerTimeline/PlannerTimeline";
import ShoppingList from "~/components/ShoppingList/ShoppingList";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";

export const getServerSideProps = async () => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: null,
    }),
    transformer: superjson,
  });

  await helpers.plan.get.prefetch();
  await helpers.meals.get.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};
const Home: NextPage = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <Container fluid className="w-full overflow-visible">
        <PlannerTimeline />
      </Container>
      <Container fluid className="ml-4 md:col-span-2">
        <ShoppingList />
      </Container>
    </div>
  );
};

export default Home;
