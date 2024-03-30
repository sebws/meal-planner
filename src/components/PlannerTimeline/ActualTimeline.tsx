import { Timeline, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { numberToDay } from "~/utils/content";
import TimelineBullet from "./TimelineBullet";
import TimelineDay from "./TimelineDay";

const ActualTimeline: React.FC = () => {
  const utils = api.useContext();
  const session = useSession();

  const { data: plan } = api.plan.get.useQuery();
  const { data: meals } = api.meals.get.useQuery(undefined, {
    select: (md) =>
      md.map((meal) => ({
        label: meal.name,
        value: meal.id,
      })),
  });

  const update = api.plan.update.useMutation({
    onSettled: () => {
      void utils.plan.get.invalidate();
    },
    onMutate: async (data) => {
      if (session.status !== "authenticated") return;
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
    <Timeline>
      {plan?.map((day, index) => (
        <Timeline.Item
          key={day.id}
          title={
            <Text size={"xs"} color="blue">
              {numberToDay(index)}
            </Text>
          }
          bullet={<TimelineBullet day={day} update={update} />}
        >
          <TimelineDay meals={meals} day={day} update={update} plan={plan} />
        </Timeline.Item>
      ))}
    </Timeline>
  );
};

export default ActualTimeline;
