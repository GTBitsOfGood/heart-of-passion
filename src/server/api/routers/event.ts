import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { EventModel, IEvent } from "~/server/models/Event";
export const eventRouter = createTRPCRouter({
  createEvent: publicProcedure
    .input(
      z.object({
        retreatId: z.string(),
        name: z.string(),
        location: z.string().optional(),
        energyLevel: z.string().optional(),
        category: z.string().optional(),
        dates: z.array(z.date()),
        expenses: z.array(
          z.object({
            cost: z.number(),
            name: z.string(),
            type: z.string(),
            costType: z.string(),
            numberOfUnits: z.number(),
            notes: z.string().optional(),
          }),
        ),
      }),
    )
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
