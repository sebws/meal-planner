import { type NextPage } from "next";
import { Container, Timeline, Text, Button, Select, Flex } from "@mantine/core";
import { api } from "~/utils/api";
import { PlannerTimeline } from "~/components/PlannerTimeline/PlannerTimeline";

const Home: NextPage = () => {
  const utils = api.useContext();

  const { data: mealsData } = api.meals.get.useQuery();
  const meals = mealsData?.map((meal) => ({
    label: meal.name,
    value: meal.id,
  }));

  const { data: plan } = api.plan.get.useQuery();
  const update = api.plan.update.useMutation({
    onSettled: () => utils.plan.get.invalidate(),
    onMutate: async (data) => {
      await utils.plan.get.cancel();
      const prevData = utils.plan.get.getData();
      utils.plan.get.setData(undefined, (old) =>
        old !== undefined
          ? old.map((day) => (day.id === data.id ? { ...day, ...data } : day))
          : undefined
      );
      return { prevData };
    },
    onError: (_err, _data, ctx) => {
      utils.plan.get.setData(undefined, ctx?.prevData);
    },
  });

  return (
    <Flex>
      <Container fluid className="mx-0 w-full">
        <PlannerTimeline plan={plan} meals={meals} update={update} />
      </Container>
      <Container bg={"blue"}>test</Container>
    </Flex>
  );
};

export default Home;
