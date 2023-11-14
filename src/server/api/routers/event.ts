import { z } from "zod";
import { eventSchema } from "~/common/types";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { EventModel, IEvent } from "~/server/models/Event";
export const eventRouter = createTRPCRouter({
  updateEvent: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        event: eventSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { eventId, event } = input;
      await EventModel.findByIdAndUpdate(eventId, event).exec();
    }),
  createEvent: publicProcedure
    .input(
      z.object({
        retreatId: z.string(),
        eventDetails: eventSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { retreatId, eventDetails } = input;
      const event = new EventModel({ retreatId, ...eventDetails });
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
