import { z } from "zod";
import { Chapter } from "~/common/types/types";

import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Model } from "~/server/models/Chapter";
export const chapterRouter = createTRPCRouter({
  createChapter: publicProcedure
    .input(
      z.object({
        name: z.string(),
        year: z.string(),
      }),
    )
    .mutation(async (opts: any) => {
      try {
        const chapter = new Model({
          name: opts.input.name,
          year: opts.input.year,
          totalCost: 100,
          fundExpected: 100,
          fundActual: 0,
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
      const chapter = await Model.findOne({ name: opts.input });
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
      const chapters = await Model.find();
      return {
        success: true,
        message: chapters,
      } as {
        success: boolean;
        message: Chapter[];
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }),
});
