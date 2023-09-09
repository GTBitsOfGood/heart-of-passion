import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { getGlobalCount, incrementGlobalCount } from "~/server/actions/Count";
import dbConnect from "~/server/db";
import { Model } from '~/server/models/Chapter'
export const chapterRouter = createTRPCRouter({
    createChapter: publicProcedure
        .input(z.string())
        .mutation(async (opts) => {
            await dbConnect();
            const chapter = new Model({ name: opts.input })
            await chapter.save();
            return chapter;
        }),
    getChapter: publicProcedure
        .input(z.string())
        .query(async (opts) => {
            const chapter = await Model.findOne({ name: opts.input });
            return chapter;
        }),
    getChapters: publicProcedure
        .query(async (opts) => {
            const chapters = await Model.find();
            return chapters;
        })
});
