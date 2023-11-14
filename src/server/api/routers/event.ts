import { z } from "zod";
import { eventSchema } from "~/common/types";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { EventModel, IEvent } from "~/server/models/Event";
export const eventRouter = createTRPCRouter({
  updateEvent: publicProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .merge(eventSchema),
    )
    .mutation(async ({ input }) => {
      const { id, ...update } = input;
      await EventModel.findByIdAndUpdate(id, update).exec();
    }),
  createEvent: publicProcedure
    .input(eventSchema)
    .mutation(async ({ input }) => {
      const event = new EventModel(input);
      await event.save();
    }),

  getEvent: publicProcedure.input(z.string()).query(async (opts) => {
    const event = await EventModel.findOne({ _id: opts.input }).exec();
    return event;
  }),
  getEvents: publicProcedure.input(z.string()).query(async (opts) => {
    const events = await EventModel.find({ retreatId: opts.input }).exec();
    return events;
  }),
});
