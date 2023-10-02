import { z } from "zod";

import {
    createTRPCRouter,
    adminProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { Model } from '~/server/models/Retreat'
export const retreatRouter = createTRPCRouter({
    createRetreat: publicProcedure
        .input(z.object({
            chapterId: z.string(),
            year: z.number()
        }))
        .mutation(async ({ input }) => {
            try {
                const retreat = new Model(input)
                await retreat.save();
                return {
                    success: true,
                    message: retreat
                };
            } catch (e) {
                return {
                    success: false,
                    message: e
                }
            }
        }),
    getRetreat: publicProcedure
        .input(z.object({
            chapterId: z.string(),
            year: z.number()
        }))
        .query(async (opts) => {
            try {
                const retreat = await Model.findOne({ chapterId: opts.input.chapterId, year: opts.input.year });
                return {
                    success: true,
                    message: retreat
                };
            } catch (e) {
                return {
                    success: false,
                    message: e
                }
            }
        }),
    getRetreatYears: publicProcedure
        .input(z.string())
        .query(async (opts) => {
            try {
                let retreats = await Model.find({ chapterId: opts.input });
                return {
                    success: true,
                    message: retreats.map(e => e.year)
                };
            } catch (e) {
                return {
                    success: false,
                    message: e
                }
            }
        })
});
