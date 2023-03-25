import { type Meal, type Plan } from "@prisma/client";
import { type api } from "~/utils/api";

interface ITimelineBullet {
  day: Plan & { meal: Meal };
  update: ReturnType<typeof api.plan.update.useMutation>;
}

const TimelineBullet: React.FC<ITimelineBullet> = ({ day, update }) => {
  return (
    <div
      className={`flex h-4 w-4 items-center justify-center rounded-full bg-${
        day.locked ? "green" : "gray"
      }-500`}
      onClick={() => update.mutate({ id: day.id, locked: !day.locked })}
    >
      <div className="h-2 w-2 rounded-full bg-gray-200"></div>
    </div>
  );
};

export default TimelineBullet;
