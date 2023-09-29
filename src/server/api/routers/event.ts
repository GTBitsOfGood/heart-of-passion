import { z } from "zod";

import {
    createTRPCRouter,
    adminProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { Model } from '~/server/models/Event'
export const eventRouter = createTRPCRouter({
    createEvent: publicProcedure
        .input(z.object({
            name: z.string(),
            location: z.string().optional(),
            energyLevel: z.string().optional(),
            category: z.string().optional(),
            dates: z.array(z.date()),
            expenses: z.array(z.object({
                name: z.string(),
                type: z.string(),
                costType: z.string(),
                numberOfUnits: z.number(),
                notes: z.string().optional()
            }))
        }))
        .mutation(async ({ input }) => {
            try {
                const event = new Model(input)
                await event.save();
                return {
                    success: true,
                    message: event
                };
            } catch (e) {
                return {
                    success: false,
                    message: e
                }
            }
        }),
    getEvent: publicProcedure
        .input(z.string())
        .query(async (opts) => {
            try {
                const event = await Model.findOne({ _id: opts.input });
                return {
                    success: true,
                    message: event
                };
            } catch (e) {
                return {
                    success: false,
                    message: e
                }
            }
        }),
    getEvents: publicProcedure
        .input(z.string())
        .query(async (opts) => {
            try {
                const events = await Model.find({ retreatId: opts.input });
                return {
                    success: true,
                    message: events
                };
            } catch (e) {
                return {
                    success: false,
                    message: e
                }
            }
        })
});
