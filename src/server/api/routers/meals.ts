import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";

export const mealsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ q: z.string() }))
    .query(({ ctx, input: { q } }) => {
      return ctx.prisma.meal.findMany({
        where: {
          name: {
            contains: q,
          },
        },
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
