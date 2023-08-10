import { type NextPage } from "next";
import {
  Container,
  Timeline,
  Text,
  Button,
  Select,
  Flex,
  Divider,
  useMantineTheme,
} from "@mantine/core";
import { api } from "~/utils/api";
import { PlannerTimeline } from "~/components/PlannerTimeline/PlannerTimeline";
import ShoppingList from "~/components/ShoppingList/ShoppingList";
import { useMediaQuery } from "@mantine/hooks";

const Home: NextPage = () => {
  const utils = api.useContext();

  const { data: mealsData } = api.meals.get.useQuery();
  const meals = mealsData?.map((meal) => ({
    label: meal.name,
    value: meal.id,
  }));

  const { data: plan } = api.plan.get.useQuery();
  const update = api.plan.update.useMutation({
    onSettled: () => {
      void utils.plan.get.invalidate();
      void utils.shopping.get.invalidate();
    },
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

  const theme = useMantineTheme();
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Flex className="h-full overflow-auto" direction={{ base: "column", sm: "row" }}>
      <Container fluid className="w-full md:w-1/3 overflow-visible">
        <PlannerTimeline plan={plan} meals={meals} update={update} />
      </Container>
      <Divider orientation={sm ? "horizontal" : "vertical"} className="my-4" />
      <Container
        fluid
        className="h-full sm:w-2/3 w-full mx-0"
      >
        <ShoppingList />
      </Container>
    </Flex>
  );
};

export default Home;
