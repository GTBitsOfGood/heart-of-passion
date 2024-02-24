import { z } from "zod";
import { eventSchema, expenseSchema } from "~/common/types";

import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { EventModel, ExpenseModel, IEvent } from "~/server/models/Event";
import { RetreatModel } from "~/server/models/Retreat";
export const eventRouter = createTRPCRouter({
  updateEvent: mentorProcedure
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
  createEvent: mentorProcedure
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
  updateExpense: mentorProcedure
    .input(
      z.object({
        expenseId: z.string(),
        expense: expenseSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { expenseId, expense } = input;
      await ExpenseModel.findByIdAndUpdate(expenseId, expense).exec();
    }),
  updateExpenseByEvent: mentorProcedure
    .input(
      z.object({
        expenseId: z.string(),
        expense: expenseSchema,
        eventId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { expenseId, expense, eventId } = input;
      const event = await EventModel.findById(eventId).exec();
      if (!event) {
        throw new Error("Event not found: " + event);
      }
      const expenseIndex = event.expenses.findIndex(
        (exp) => exp._id?.toString() === expenseId,
      );
      if (expenseIndex === -1) {
        throw new Error("Expense not found with ID: " + expenseId);
      }
      event.expenses[expenseIndex] = expense;
      await event.save();
    }),
  createExpense: mentorProcedure
    .input(
      z.object({
        retreatId: z.string().optional(),
        expenseDetails: expenseSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { retreatId, expenseDetails } = input;
      if (retreatId) {
        const expense = new ExpenseModel({ retreatId, ...expenseDetails });
        await expense.save();
      } else {
        const { expenseDetails } = input;
        const expense = new ExpenseModel({ ...expenseDetails });
        await expense.save();
      }
    }),
  createEventInLatestRetreat: mentorProcedure
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

  deleteEvent: mentorProcedure.input(z.string()).mutation(async ({ input }) => {
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
  getExpenses: studentProcedure.input(z.string()).query(async (opts) => {
    const expenses = await ExpenseModel.find({ retreatId: opts.input }).exec();
    return expenses;
  }),
});
