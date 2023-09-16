/* eslint-disable camelcase */
import { publicProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const planRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.plan.findMany({
      include: {
        meal: {
          include: {
            materials: {
              select: {
                qty: true,
                ingredient: {
                  select: {
                    id: true,
                    name: true,
                    category: true,
                  },
                },
                unit: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
  }),
  randomise: publicProcedure.mutation(async ({ ctx }) => {
    const meals = await ctx.prisma.randomMeals.findMany();
    return ctx.prisma.$transaction(
      (await ctx.prisma.plan.findMany()).map((plan) =>
        ctx.prisma.plan.updateMany({
          where: {
            id: plan.id,
            locked: false
          },
          data: {
            meal_id: meals.pop()!.id,
          },
        })
      )
    );
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        meal_id: z.string().optional(),
        serves: z.number().optional(),
        name: z.string().optional(),
        servings: z.number().optional(),
        location: z.string().optional(),
        locked: z.boolean().optional(),
        has_recipe: z.boolean().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (
        input.serves !== undefined &&
        (isNaN(input.serves) || input.serves < 0)
      ) {
        return Promise.reject("serves must be a positive number");
      } else {
        return ctx.prisma.plan.updateMany({
          where: {
            id: input.id,
          },
          data: input,
        });
      }
    }),
  lock: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.plan.updateMany({
      data: {
        locked: true,
      },
    });
  }),
  unlock: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.plan.updateMany({
      data: {
        locked: false,
      },
    });
  }),
});
