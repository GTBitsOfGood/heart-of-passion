import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { ChapterModel, IChapter } from "~/server/models/Chapter";
import { Chapter } from "~/common/types";

export const chapterRouter = createTRPCRouter({
  createChapter: publicProcedure
    .input(z.string())
    .mutation(async ({ input: name }) => {
      const chapter = new ChapterModel({
        name,
      });

      await chapter.save();
    }),

  getChapter: publicProcedure
    .input(z.string())
    .query(async (opts): Promise<Chapter> => {
      const chapter = (await ChapterModel.findOne({
        name: opts.input,
      }).exec())!;
      return processChapter(chapter);
    }),

  getChapters: publicProcedure.query(async (opts): Promise<Chapter[]> => {
    const chapters = (await ChapterModel.find().exec())!;
    return chapters.map(processChapter);
  }),
});

// TODO: We need to calculate this information based on expenses
function processChapter(chapterModel: IChapter): Chapter {
  return {
    name: chapterModel.name,
    totalCost: 5000,
    fundExpected: 5100,
    fundActual: 2600,
  };
}
