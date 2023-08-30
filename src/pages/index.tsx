import { type NextPage } from "next";
import { Container } from "@mantine/core";
import { PlannerTimeline } from "~/components/PlannerTimeline/PlannerTimeline";
import ShoppingList from "~/components/ShoppingList/ShoppingList";

const Home: NextPage = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <Container fluid className="overflow-visible">
        <PlannerTimeline />
      </Container>
      <Container fluid className="ml-4 md:col-span-2">
        <ShoppingList />
      </Container>
    </div>
  );
};

export default Home;
