import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { IRetreat, RetreatModel } from "~/server/models/Retreat";
import { EventModel, IEvent } from "~/server/models/Event";
import { Event, eventsByYearSchema } from "~/common/types";
import { Fundraiser, fundraisersByYearSchema } from "~/common/types";
import { FundraiserModel } from "~/server/models/Fundraiser";
import { FundModel } from "~/server/models/Fund";
import { ChapterModel } from "~/server/models/Chapter";

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

  getAllFundraisersForChapter: studentProcedure
    .input(z.string())
    .query(async (opts) => {
      const retreats: IRetreat[] = await RetreatModel.find({
        chapterId: opts.input,
      }).exec();

      let fundraisersByYear: { [year: number]: Fundraiser[] } = {};

      for (const retreat of retreats) {
        if (!fundraisersByYear[retreat.year]) {
          fundraisersByYear[retreat.year] = [];
        }

        const fundraisers = await FundraiserModel.find({
          retreatId: retreat._id,
        }).exec();
        for (const fundraiser of fundraisers) {
          fundraisersByYear[retreat.year]!.push(fundraiser);
        }
      }

      return fundraisersByYear;
    }),

  deleteRetreat: adminProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await EventModel.deleteMany({ retreatId: input }).exec();
      await FundModel.deleteMany({ retreatId: input }).exec();
      await FundraiserModel.deleteMany({ retreatId: input }).exec();
      await RetreatModel.findByIdAndDelete(input).exec();
    }),

  getLatestRetreats: studentProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      ),
    )
    .query(async () => {
      const chapters = await ChapterModel.find().exec();
      const latestRetreats = await Promise.all(
        chapters.map(async (chapter) => {
          const latestRetreat = await RetreatModel.findOne({
            chapterId: chapter._id,
          })
            .sort({ year: -1 })
            .exec();

          if (!latestRetreat) {
            return null;
          }

          return {
            id: `${latestRetreat._id}`,
            name: `${chapter.name} ${latestRetreat.year}`,
          };
        }),
      );

      return latestRetreats.filter(
        (retreat): retreat is { id: string; name: string } => retreat !== null,
      );
    }),
});
