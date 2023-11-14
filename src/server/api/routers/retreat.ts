import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { IRetreat, RetreatModel } from "~/server/models/Retreat";
import { EventModel, IEvent } from "~/server/models/Event";

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
  getRetreatById: publicProcedure
    .input(z.string())
    .query(async (opts): Promise<IRetreat> => {
      const retreat = await RetreatModel.findOne({
        _id: opts.input,
      });
      return retreat!;
    }),
  existsRetreat: publicProcedure
    .input(
      z.object({
        chapterId: z.string(),
        year: z.number(),
      }),
    )
    .query(async (opts) => {
      const retreat = await RetreatModel.exists({
        chapterId: opts.input.chapterId,
        year: opts.input.year,
      });
      return !!retreat;
    }),
  getRetreatYears: publicProcedure.input(z.string()).query(async (opts) => {
    const retreats = await RetreatModel.find({ chapterId: opts.input })
      .select("year")
      .exec();
    return retreats.map((e) => e.year).sort();
  }),
  getRetreatCost: publicProcedure.input(z.string()).query(async ({ input }) => {
    const events = await EventModel.find({ retreatId: input });
    let cost = 0;
    events.forEach((event: IEvent) => {
      let expenses = event.expenses;
      expenses.forEach((expense) => {
        cost += expense.cost * (expense.numUnits ?? 1);
      });
    });
    return cost;
  }),

  getRetreats: publicProcedure.input(z.string()).query(async (opts) => {
    const retreats = await RetreatModel.find({ chapterId: opts.input }).exec();
    return retreats;
  }),

  getAllEvents: publicProcedure.input(z.string()).query(async (opts) => {
    const retreats: IRetreat[] = await RetreatModel.find({
      chapterId: opts.input,
    }).exec();

    const events: any = {};
    for (const retreat of retreats) {
      if (!events[retreat.year]) {
        events[retreat.year] = [];
      }

      const event = await EventModel.findOne({ retreatId: retreat._id });
      events[retreat.year].push(event);
    }

    return events;
  }),
});
