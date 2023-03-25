import { Select, Text, Button } from "@mantine/core";
import { type Meal, type Plan } from "@prisma/client";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { type api } from "~/utils/api";
import { numberToServings } from "~/utils/content";

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
            disabled: !!plan.find((plan) => plan.meal_id == value),
          })) || []
        }
        searchable
        value={String(day.meal_id)}
        onChange={(selection) => {
          update.mutate({ id: day.id, meal_id: Number(selection) });
        }}
        styles={(theme) => ({
          rightSection: {
            display: "none",
          },
          input: {
            padding: "0",
            fontSize: theme.fontSizes.md,
            backgroundColor: "transparent",
            border: "none",
            textUnderlineOffset: "0.4em",
            "&:focus": {
              textDecoration: "underline",
              // backgroundColor: theme.colors.gray[2],
            },
          },
          wrapper: {
            padding: 0,
            backgroundColor: "transparent",
          },
        })}
      ></Select>
      <div className="mt-1 flex items-center">
        <Text className="mr-2" size={"sm"}>
          {numberToServings(day.serves)}
        </Text>
        <Button
          onClick={() => update.mutate({ id: day.id, serves: day.serves - 1 })}
          className="mr-2"
          compact
          variant="default"
          color="dark"
        >
          <IconArrowDown size={10} />
        </Button>
        <Button
          onClick={() => update.mutate({ id: day.id, serves: day.serves + 1 })}
          compact
          variant="default"
          color="dark"
        >
          <IconArrowUp size={10} />
        </Button>
      </div>
    </>
  );
};

export default TimelineDay;
