import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { FundModel, IFund } from "~/server/models/Fund";
import { Chapter, Expense, fundSchema } from "~/common/types";
import { EventModel, IEvent } from "~/server/models/Event";
import { RetreatModel, IRetreat } from "~/server/models/Retreat";

export const fundRouter = createTRPCRouter({
//create
  createFund: studentProcedure
    .input(
      z.object({
        retreatId: z.string(),
        fundDetails: fundSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { retreatId, fundDetails } = input;
      console.log(fundDetails);
      const fund = new FundModel({ retreatId, ...fundDetails });
      await fund.save();
    }),
//get
  getFunds: studentProcedure
    .input(z.string())
    .query( async (opts) => {
      const funds = await FundModel.find({ retreatId: opts.input }).exec();
      return funds.map((f) => {
        return {
          retreatId: f.retreatId,
          name: f.name,
          date: f.date,
          amount: f.amount,
          source: f.source,
          _id: f._id,
        };
      });
    }),
/*
  getChapterByName: studentProcedure
    .input(z.string())
    .query(async (opts): Promise<Chapter> => {
      const chapter = (await ChapterModel.findOne({
        name: opts.input,
      }).exec())!;
      return processChapter(chapter);
    }),
  getChapterById: studentProcedure
    .input(z.string())
    .query(async (opts): Promise<Chapter> => {
      const chapter = (await ChapterModel.findOne({
        _id: opts.input,
      }).exec())!;
      return processChapter(chapter);
    }),
  getChapterByRetreatId: studentProcedure
    .input(z.string())
    .query(async (opts): Promise<Chapter> => {
      const retreat = (await RetreatModel.findOne({
        _id: opts.input,
      }).exec())!;
      const chapter = (await ChapterModel.findOne({
        _id: retreat.chapterId,
      }).exec())!;
      return processChapter(chapter);
    }),
  getChapterIdByName: studentProcedure.input(z.string()).query(async (opts) => {
    const chapter = await ChapterModel.findOne({
      name: opts.input,
    }).exec();
    return chapter?._id ?? "";
  }),
  getChapters: studentProcedure.query(async (opts): Promise<Chapter[]> => {
    const chapters = (await ChapterModel.find().exec())!;
    return await Promise.all(chapters.map(processChapter));
  }),
*/
//update
  updateFund: studentProcedure
    .input(
      z.object({
        fundId: z.string(),
        updates: fundSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { fundId, updates } = input;
      const updateData = { ...updates };
      const fund = await FundModel.findByIdAndUpdate(fundId, updateData, { new: true }).exec();
      return fund;
    }),
//delete
  deleteFund: studentProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await FundModel.findByIdAndDelete(input).exec();
    }),
/*
  getLatestRetreatId: studentProcedure.input(z.string()).query(async (opts) => {
    const retreat = await RetreatModel.findOne({ chapterId: opts.input })
      .sort("-year")
      .exec();
    return retreat?._id;
  }),
*/
});

/*
async function processChapter(chapterModel: IChapter): Promise<Chapter> {
  let retreat: IRetreat | null = (await RetreatModel.findOne({
    chapterId: chapterModel._id,
  })
    .sort("-year")
    .exec())!;

  let cost = 0;
  if (retreat) {
    const events = (await EventModel.find({ retreatId: retreat?._id }).exec())!;
    events?.forEach((event: IEvent) => {
      let expenses: Expense[] = event.expenses;
      expenses?.forEach((expense) => {
        cost += expense.cost * (expense.numUnits || 1);
      });
    });
  }

  return {
    name: chapterModel.name,
    totalCost: cost,
    fundExpected: 5100,
    fundActual: 2600,
    id: chapterModel._id,
  };
}
*/