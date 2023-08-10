import { createTRPCRouter } from "~/server/api/trpc";
import { ingredientsRouter } from "./routers/ingredients";
import { mealsRouter } from "./routers/meals";
import { planRouter } from "./routers/plan";
import { recipesRouter } from "./routers/recipes";
import { shoppingRouter } from "./routers/shopping";
import { dayRouter } from "./routers/day";
import { unitsRouter } from "./routers/units";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  plan: planRouter,
  day: dayRouter,
  ingredients: ingredientsRouter,
  meals: mealsRouter,
  recipes: recipesRouter,
  shopping: shoppingRouter,
  units: unitsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
