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
      }),
    )
    .mutation(async (opts: any) => {
      try {
        const chapter = new Model({
          name: opts.input.name,
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
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }),
});
