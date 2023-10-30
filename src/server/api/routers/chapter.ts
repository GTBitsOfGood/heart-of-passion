import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { ChapterModel, IChapter } from "~/server/models/Chapter";
import { Chapter } from "~/common/types";
import { EventModel, IEvent, IExpense } from "~/server/models/Event";
import { RetreatModel, IRetreat } from "~/server/models/Retreat";
import { exec } from "child_process";


export const chapterRouter = createTRPCRouter({
  createChapter: publicProcedure
    .input(z.string())
    .mutation(async ({ input: name }) => {
      const chapter = new ChapterModel({
        name,
      });

      await chapter.save();
      const retreat = new RetreatModel({ chapterId: chapter.id, year: new Date().getFullYear() });
      await retreat.save();
    }),

  getChapter: publicProcedure
    .input(z.string())
    .query(async (opts): Promise<Chapter> => {
      const chapter = (await ChapterModel.findOne({
        name: opts.input,
      }).exec())!;
      return processChapter(chapter);
    }),
  getChapterWithRetreat: publicProcedure
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
  getChapters: publicProcedure.query(async (opts): Promise<Chapter[]> => {
    const chapters = (await ChapterModel.find().exec())!;
    return await Promise.all(chapters.map(processChapter));
  }),
});

// TODO: We need to calculate this information based on expenses
async function processChapter(chapterModel: IChapter): Promise<Chapter> {
  let retreat: IRetreat | null = (await RetreatModel.findOne({ chapterId: chapterModel._id }).sort("-year").exec())!
  let cost = 0
  if (retreat) {
    const events = (await EventModel.find({ retreatId: retreat?._id }).exec())!
    events?.forEach((event: IEvent) => {
      let expenses: [IExpense] = event.expenses
      expenses?.forEach((expense) => {
        if (expense.costType == "flat cost") {
          cost += expense.cost
        } else {
          cost += expense.cost * expense.numberOfUnits;
        }
      });
    })
  }
  return {
    name: chapterModel.name,
    totalCost: cost,
    fundExpected: 5100,
    fundActual: 2600,
    id: chapterModel._id,
    retreat: retreat
  };
}
