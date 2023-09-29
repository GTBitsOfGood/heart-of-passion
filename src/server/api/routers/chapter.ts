import { z } from "zod";
import { Chapter } from "~/common/types/types";

import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { ChapterModel } from "~/server/models/Chapter";
export const chapterRouter = createTRPCRouter({
  createChapter: publicProcedure
    .input(z.string())
    .mutation(async (opts: any) => {
      try {
        const chapter = new ChapterModel({
          name: opts.input,
        });
        await chapter.save();
        return {
          success: true,
          message: chapter,
        };
      } catch (e) {
        return {
          success: true,
          message: e,
        };
      }
    }),
  getChapter: publicProcedure.input(z.string()).query(async (opts: any) => {
    try {
      const chapter = await ChapterModel.findOne({ name: opts.input });
      return {
        success: true,
        message: chapter,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }),
  getChapters: publicProcedure.query(async (opts: any) => {
    try {
      const chapters = await ChapterModel.find();
      return {
        success: true,
        message: chapters,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }),
});
