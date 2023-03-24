import { publicProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";

export const dayRouter = createTRPCRouter({
  hasRecipe: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input: { id } }) => {
      return (
        ctx.prisma.material.findFirst({
          where: {
            meal_id: id,
          },
        }) === undefined
      );
    }),
});
