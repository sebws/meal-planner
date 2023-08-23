import { Select, Text, Button, Card, Tooltip, Popover } from "@mantine/core";
import { type Meal, type Plan } from "@prisma/client";
import {
  IconArrowDown,
  IconArrowUp,
  IconCurrentLocation,
} from "@tabler/icons-react";
import { type api } from "~/utils/api";
import { numberToServings } from "~/utils/content";
import { minimalInputStyle } from "~/utils/helper";
import LinkOrText from "../LinkOrText";

interface ITimelineDay {
  meals: { label: string; value: number }[] | undefined;
  day: Plan & { meal: Meal };
  update: ReturnType<typeof api.plan.update.useMutation>;
  plan: (Plan & { meal: Meal })[];
}

const TimelineDay: React.FC<ITimelineDay> = ({ meals, day, update, plan }) => {
  return (
    <>
      <Select
        data={
          meals?.map(({ value, label }) => ({
            label,
            value: String(value),
            disabled: !!plan.find(
              (plan) => plan.meal_id == value && plan.meal.name !== "Takeaway"
            ),
          })) || []
        }
        searchable
        value={String(day.meal_id)}
        onChange={(selection) => {
          update.mutate({ id: day.id, meal_id: Number(selection) });
        }}
        styles={minimalInputStyle}
      />
      <div className="grid grid-cols-6 items-center sm:w-3/4 md:w-auto">
        <Text className="col-span-3" size={"sm"}>
          {numberToServings(day.serves)}
        </Text>
        <Button
          onClick={() => update.mutate({ id: day.id, serves: day.serves - 1 })}
          className="mt-0.5 w-fit"
          compact
          variant="light"
          color="dark"
        >
          <IconArrowDown size={10} />
        </Button>
        <Button
          className="mt-0.5 w-fit"
          onClick={() => update.mutate({ id: day.id, serves: day.serves + 1 })}
          compact
          variant="light"
          color="dark"
        >
          <IconArrowUp size={10} />
        </Button>
        <Popover>
          <Popover.Target>
            <IconCurrentLocation className="mx-4" size={12} />
          </Popover.Target>
          <Popover.Dropdown>
            <LinkOrText text={day.meal.location} />
          </Popover.Dropdown>
        </Popover>
      </div>
    </>
  );
};

export default TimelineDay;
