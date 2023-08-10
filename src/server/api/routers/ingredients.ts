import { z } from "zod";
import { publicProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

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
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(({ ctx, input: { id, name, category } }) => {
      return ctx.prisma.ingredient.update({
        where: {
          id,
        },
        data: {
          ...(name && { name }),
          ...(category && { category }),
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) => {
      return ctx.prisma.ingredient.delete({
        where: {
          id,
        },
      });
    }),
});
