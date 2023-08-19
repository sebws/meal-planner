import { type Meal, type Plan } from "@prisma/client";
import { Timeline, Text, Stack, Button, Flex } from "@mantine/core";
import { numberToDay } from "~/utils/content";
import TimelineBullet from "./TimelineBullet";
import { api, RouterOutputs } from "~/utils/api";
import TimelineDay from "./TimelineDay";
import { IconArrowsShuffle, IconLock, IconLockOpen } from "@tabler/icons-react";
import { Suspense } from "react";
import ActualTimeline from "./ActualTimeline";

export const PlannerTimeline: React.FC = () => {
  const utils = api.useContext();

  const lock = api.plan.lock.useMutation({
    onSettled: () => utils.plan.get.invalidate(),
    onMutate: async () => {
      await utils.plan.get.cancel();
      const prevData = utils.plan.get.getData();
      utils.plan.get.setData(undefined, (old) =>
        old !== undefined
          ? old.map((day) => ({ ...day, locked: true }))
          : undefined
      );
      return { prevData };
    },
    onError: (_err, _data, ctx) => {
      utils.plan.get.setData(undefined, ctx?.prevData);
    },
  });

  const unlock = api.plan.unlock.useMutation({
    onSettled: () => utils.plan.get.invalidate(),
    onMutate: async () => {
      await utils.plan.get.cancel();
      const prevData = utils.plan.get.getData();
      utils.plan.get.setData(undefined, (old) =>
        old !== undefined
          ? old.map((day) => ({ ...day, locked: false }))
          : undefined
      );
      return { prevData };
    },
    onError: (_err, _data, ctx) => {
      utils.plan.get.setData(undefined, ctx?.prevData);
    },
  });

  const randomise = api.plan.randomise.useMutation({
    onSettled: () => {
      void utils.plan.get.invalidate();
    },
  });

  return (
    <>
      <Flex justify="center" align="center" className="mb-2">
        <Button onClick={() => unlock.mutate()} variant="subtle" color="light">
          <IconLockOpen size={17} color="gray" />
        </Button>
        <Button onClick={() => lock.mutate()} variant="subtle" color="green">
          <IconLock size={17} color="gray" />
        </Button>
        <Button
          onClick={() => randomise.mutate()}
          variant="subtle"
          color="orange"
        >
          <IconArrowsShuffle size={17} color="gray" />
        </Button>
      </Flex>
      <Suspense
        fallback={
          <Timeline>
            {[...Array(7).keys()].map((_, index) => (
              <Timeline.Item
                key={index}
                title={
                  <Text size={"xs"} color="blue">
                    {numberToDay(index)}
                  </Text>
                }
                bullet={
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-500">
                    <div className="h-2 w-2 rounded-full bg-gray-200" />
                  </div>
                }
              />
            ))}
          </Timeline>
        }
      >
        <ActualTimeline />
      </Suspense>
    </>
  );
};
