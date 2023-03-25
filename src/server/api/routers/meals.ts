import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";

export const mealsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z
        .object({
          contains: z.string().optional(),
          filterPlanned: z.boolean().optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      const { contains, filterPlanned } = input || {};

      const containsCondition = {
        name: {
          contains,
        },
      };

      const filterPlannedCondition = {
        plan: null,
      };

      return ctx.prisma.meal.findMany({
        ...(contains || filterPlanned
          ? {
              where: {
                ...(contains ? containsCondition : {}),
                ...(filterPlanned ? filterPlannedCondition : {}),
              },
            }
          : {}),
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) => {
      return ctx.prisma.meal.delete({
        where: {
          id,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        servings: z.number().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(({ ctx, input: { id, name, servings, location } }) => {
      return ctx.prisma.meal.update({
        where: {
          id,
        },
        data: {
          ...(name && { name }),
          ...(servings && { servings }),
          ...(location && { location }),
        },
      });
    }),
});
