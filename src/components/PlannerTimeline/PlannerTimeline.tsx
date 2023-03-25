import { type Meal, type Plan } from "@prisma/client";
import { Timeline, Text } from "@mantine/core";
import { numberToDay } from "~/utils/content";
import TimelineBullet from "./TimelineBullet";
import { type api } from "~/utils/api";
import TimelineDay from "./TimelineDay";

interface IPlannerTimeline {
  meals: { label: string; value: number }[] | undefined;
  update: ReturnType<typeof api.plan.update.useMutation>;
  plan: (Plan & { meal: Meal })[] | undefined;
}

export const PlannerTimeline: React.FC<IPlannerTimeline> = ({
  plan,
  update,
  meals,
}) => {
  return (
    <Timeline>
      {plan?.map((day, index) => (
        <Timeline.Item
          key={day.id}
          title={
            <Text size={"xs"} color="gray">
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
