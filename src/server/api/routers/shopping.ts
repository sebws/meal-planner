import { publicProcedure, createTRPCRouter } from "../trpc";

export const shoppingRouter = createTRPCRouter({
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
      where: {
        serves: {
          gt: 0,
        },
      },
    });
    // .then((plans) => {
    //   const ret = plans
    //     .flatMap((plan) =>
    //       plan.meal.materials.map((material) => ({
    //         id: material.ingredient.id,
    //         qty:  Math.round(material.qty * (plan.serves / plan.meal.servings) * 100) / 100,
    //         name: material.ingredient.name,
    //         unit: material.unit.name,
    //         category: material.ingredient.category,
    //         meals: [
    //           {
    //             name: plan.meal.name,
    //             id: plan.meal.id,
    //           },
    //         ],
    //       }))
    //     )
    //     .reduce(
    //       (acc, value) => {
    //         const key = `${value.id}${value.unit}`;
    //         const val = acc[key];
    //         if (val !== undefined) {
    //           val.qty += value.qty;
    //           val.meals = val.meals.concat(value.meals);
    //         } else {
    //           acc[key] = value;
    //         }
    //         return acc;
    //       },
    //       {} as {
    //         [key: string]: {
    //           id: number;
    //           qty: number;
    //           name: string;
    //           unit: string;
    //           category: string;
    //           meals: { name: string; id: number }[];
    //         };
    //       }
    //     );

    //   return Object.values(ret);
    // });
  }),
});
