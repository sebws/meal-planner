import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";

export const ingredientsRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.ingredient.findMany();
  }),
  searchName: publicProcedure
    .input(z.object({ q: z.string() }))
    .query(({ ctx, input: { q } }) => {
      return ctx.prisma.ingredient.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          name: {
            contains: q,
          },
        },
        distinct: ["name"],
      });
      // TODO: FIX THINGS EXPECTING VALUE:LABEL
    }),
  categories: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.ingredient.findMany({
      distinct: ["category"],
      select: {
        category: true,
      },
    });
  }),
});
