import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

import { getGlobalCount, incrementGlobalCount } from "~/server/actions/Count";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `This is the server saying: ${input.text}`,
      };
    }),

  count: publicProcedure
    .output(z.object({ count: z.number() }))
    .query(async () => {
      return { count: await getGlobalCount() };
    }),

  incrementCount: publicProcedure.mutation(async () => {
    incrementGlobalCount();
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return "Todo!";
  }),
});
