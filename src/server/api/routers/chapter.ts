import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { ChapterModel, IChapter } from "~/server/models/Chapter";
import { Chapter, Expense } from "~/common/types";
import { EventModel, IEvent } from "~/server/models/Event";
import { RetreatModel, IRetreat } from "~/server/models/Retreat";

export const chapterRouter = createTRPCRouter({
  createChapter: publicProcedure
    .input(z.string())
    .mutation(async ({ input: name }) => {
      const chapter = new ChapterModel({
        name,
      });

      await chapter.save();
      const retreat = new RetreatModel({
        chapterId: chapter.id,
        year: new Date().getFullYear(),
      });
      await retreat.save();
    }),
  getChapterByName: publicProcedure
    .input(z.string())
    .query(async (opts): Promise<Chapter> => {
      const chapter = (await ChapterModel.findOne({
        name: opts.input,
      }).exec())!;
      return processChapter(chapter);
    }),
  getChapterById: publicProcedure
    .input(z.string())
    .query(async (opts): Promise<Chapter> => {
      const chapter = (await ChapterModel.findOne({
        _id: opts.input,
      }).exec())!;
      return processChapter(chapter);
    }),
  getChapterByRetreatId: publicProcedure
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
  getChapterIdByName: publicProcedure.input(z.string()).query(async (opts) => {
    const chapter = await ChapterModel.findOne({
      name: opts.input,
    }).exec();
    return chapter?._id ?? "";
  }),
  getChapters: publicProcedure.query(async (opts): Promise<Chapter[]> => {
    const chapters = (await ChapterModel.find().exec())!;
    return await Promise.all(chapters.map(processChapter));
  }),

  updateChapter: publicProcedure
    .input(z.object({ oldChapterName: z.string(), newChapterName: z.string() }))
    .mutation(async (opts) => {
      const chapter = await ChapterModel.findOneAndUpdate(
        { name: opts.input.oldChapterName },
        { name: opts.input.newChapterName },
      ).exec();
      return chapter;
    }),

  getLatestRetreatId: publicProcedure.input(z.string()).query(async (opts) => {
    const retreat = await RetreatModel.findOne({ chapterId: opts.input })
      .sort("-year")
      .exec();
    return retreat?._id;
  }),
});

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
