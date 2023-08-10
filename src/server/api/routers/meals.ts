import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";

export const mealsRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z
        .object({
          contains: z.string().optional(),
          filterPlanned: z.boolean().optional(),
          hasIngredientIds: z.array(z.number()).optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      const { contains, filterPlanned, hasIngredientIds } = input || {};

      const containsCondition = {
        name: {
          contains,
        },
      };

      const filterPlannedCondition = {
        plan: undefined,
      };

      const hasIngredientIdsCondition = {
        materials: {
          some: {
            ingredient_id: {
              in: hasIngredientIds,
            },
          },
        },
      };

      return ctx.prisma.meal.findMany({
        include: {
          materials: {
            include: {
              ingredient: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
        ...(contains || filterPlanned || hasIngredientIds
          ? {
              where: {
                ...(contains ? containsCondition : {}),
                ...(filterPlanned ? filterPlannedCondition : {}),
                ...(hasIngredientIds ? hasIngredientIdsCondition : {}),
              },
            }
          : {}),
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input: { id } }) => {
      return ctx.prisma.meal.delete({
        where: {
          id,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        servings: z.number().nonnegative().optional(),
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
