import { z } from "zod";

import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { IRetreat, RetreatModel } from "~/server/models/Retreat";
import { EventModel, IEvent } from "~/server/models/Event";
import { Event } from "~/common/types";

export const retreatRouter = createTRPCRouter({
  createRetreat: mentorProcedure
    .input(
      z.object({
        chapterId: z.string(),
        year: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const retreat = new RetreatModel(input);
      await retreat.save();

      return retreat;
    }),
  getRetreat: studentProcedure
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
  getRetreatById: studentProcedure
    .input(z.string())
    .query(async (opts): Promise<IRetreat> => {
      const retreat = await RetreatModel.findOne({
        _id: opts.input,
      });
      return retreat!;
    }),
  existsRetreat: studentProcedure
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
  getRetreatYearsAndIds: studentProcedure
    .input(z.string())
    .query(async (opts) => {
      const retreats = await RetreatModel.find({ chapterId: opts.input })
        .select("year")
        .exec();
      return retreats
        .map((r) => {
          return {
            year: r.year,
            id: r._id,
          };
        })
        .sort();
    }),
  getRetreatCost: studentProcedure
    .input(z.string())
    .query(async ({ input }) => {
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

  getRetreats: studentProcedure.input(z.string()).query(async (opts) => {
    const retreats = await RetreatModel.find({ chapterId: opts.input }).exec();
    return retreats;
  }),

  getAllEventsForChapter: studentProcedure
    .input(z.string())
    .query(async (opts) => {
      const retreats: IRetreat[] = await RetreatModel.find({
        chapterId: opts.input,
      }).exec();

      let eventsByYear: { [year: number]: Event[] } = {};

      for (const retreat of retreats) {
        if (!eventsByYear[retreat.year]) {
          eventsByYear[retreat.year] = [];
        }

        const events = await EventModel.find({ retreatId: retreat._id }).exec();
        for (const event of events) {
          eventsByYear[retreat.year]!.push(event);
        }
      }

      return eventsByYear;
    }),
});
