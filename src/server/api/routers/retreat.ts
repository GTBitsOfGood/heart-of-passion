import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { RetreatModel } from "~/server/models/Retreat";
export const retreatRouter = createTRPCRouter({
  createRetreat: publicProcedure
    .input(
      z.object({
        chapterId: z.string(),
        year: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const retreat = new RetreatModel(input);
      await retreat.save();
    }),
  getRetreat: publicProcedure
    .input(
      z.object({
        chapterId: z.string(),
        year: z.number(),
      }),
    )
    .query(async (opts) => {
      const retreat = await RetreatModel.findOne({
        chapterId: opts.input.chapterId,
        year: opts.input.year,
      });
      return retreat;
    }),
  getRetreatYears: publicProcedure.input(z.string()).query(async (opts) => {
    const retreats = await RetreatModel.find({ chapterId: opts.input })
      .select("year")
      .exec();
    return retreats.map((e) => e.year).sort();
  }),
});
