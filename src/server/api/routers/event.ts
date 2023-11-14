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
    const events = await EventModel.find({ retreatId: opts.input });
    return events;
  }),
  getEventsByDay: publicProcedure.input(z.string()).query(async (opts) => {
    const events: IEvent[] = await EventModel.find({ retreatId: opts.input });
    const eventMap: { [dayNum: number]: any[] } = {
      1: [],
      2: [],
      3: [],
      4: [],
    };

    const currDay = new Date();
    currDay.setHours(0, 0, 0, 0);

    for (let event of events) {
      for (let date of event.dates) {
        var tempDay = new Date(date.date);
        const dayDifference: number = tempDay.getDate() - currDay.getDate() + 1;
        if (dayDifference > 0) {
          if (eventMap[dayDifference] === undefined) {
            eventMap[dayDifference] = [
              {
                event,
                from: date.from,
                to: date.to,
              },
            ];
          } else {
            eventMap[dayDifference]!.push({
              event,
              from: date.from,
              to: date.to,
            });
          }
        }
      }
    }

    Object.keys(eventMap).map((key: any) => {
      eventMap[key]!.sort((a: any, b: any) => {
        const date1 = new Date(`2000-01-01 ${a.from}`);
        const date2 = new Date(`2000-01-01 ${b.from}`);
        return date1 < date2
          ? -1
          : date1 === date2
          ? 0
          : date1 > date2
          ? 1
          : -1;
      });
    });

    return eventMap;
  }),
});
