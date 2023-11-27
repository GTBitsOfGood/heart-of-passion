import { z } from "zod";
import { eventSchema } from "~/common/types";

import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { EventModel, IEvent } from "~/server/models/Event";
import { RetreatModel } from "~/server/models/Retreat";
export const eventRouter = createTRPCRouter({
  updateEvent: studentProcedure
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
  createEvent: studentProcedure
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

  createEventInLatestRetreat: studentProcedure
    .input(
      z.object({
        chapterId: z.string(),
        eventDetails: eventSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { chapterId, eventDetails } = input;

      const retreat = await RetreatModel.findOne({
        chapterId,
      }).sort({ year: -1 });

      if (!retreat) {
        throw new Error("No retreat found");
      }

      const retreatId = retreat._id;

      const event = new EventModel({ retreatId, ...eventDetails });
      await event.save();
    }),

  deleteEvent: studentProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await EventModel.findByIdAndDelete(input).exec();
    }),

  getEvent: studentProcedure.input(z.string()).query(async (opts) => {
    const event = await EventModel.findOne({ _id: opts.input }).exec();
    return event;
  }),
  getEvents: studentProcedure.input(z.string()).query(async (opts) => {
    const events = await EventModel.find({ retreatId: opts.input }).exec();
    return events;
  }),
});
