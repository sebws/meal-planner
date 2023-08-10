import { createTRPCRouter, publicProcedure } from "../trpc";

export const unitsRouter = createTRPCRouter({
  get: publicProcedure.query(({ctx}) => {
    return ctx.prisma.unit.findMany();
  })
});
