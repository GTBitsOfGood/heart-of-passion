import { z } from "zod";
import {
  expenseSchema,
  fundraiserSchema,
  savedFundraiserSchema,
} from "~/common/types";

import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { ExpenseModel } from "~/server/models/Event";
import { FundraiserModel, IFundraiser } from "~/server/models/Fundraiser";

export const fundraiserRouter = createTRPCRouter({
  updateFundraiser: studentProcedure
    .input(
      z.object({
        fundraiserId: z.string(),
        fundraiser: fundraiserSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { fundraiserId, fundraiser } = input;
      await FundraiserModel.findByIdAndUpdate(fundraiserId, fundraiser).exec();
    }),
  createFundraiser: studentProcedure
    .input(
      z.object({
        retreatId: z.string(),
        fundraiserDetails: fundraiserSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { retreatId, fundraiserDetails } = input;
      const fundraiser = new FundraiserModel({
        retreatId,
        ...fundraiserDetails,
      });

      await fundraiser.save();
    }),
  updateExpenseByFundraiser: studentProcedure
    .input(
      z.object({
        expenseId: z.string(),
        expense: expenseSchema,
        fundraiserId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { expenseId, expense, fundraiserId } = input;
      const fundraiser = await FundraiserModel.findById(fundraiserId).exec();
      if (!fundraiser) {
        throw new Error("Fundraiser not found with ID: " + fundraiserId);
      }
      const expenseIndex = fundraiser.expenses.findIndex(
        (exp) => exp._id?.toString() === expenseId,
      );
      if (expenseIndex === -1) {
        throw new Error("Expense not found with ID: " + expenseId);
      }
      fundraiser.expenses[expenseIndex] = expense;
      await fundraiser.save();
    }),

  deleteFundraiser: studentProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await FundraiserModel.findByIdAndDelete(input).exec();
    }),

  getFundraiser: studentProcedure
    .input(z.string())
    .output(savedFundraiserSchema)
    .query(async (opts) => {
      const event = await FundraiserModel.findOne({ _id: opts.input }).exec();
      if (!event) {
        throw new Error("Fundraiser not found");
      }

      return processEvent(event);
    }),

  getFundraisers: studentProcedure
    .input(z.string())
    .output(z.array(savedFundraiserSchema))
    .query(async (opts) => {
      const events = await FundraiserModel.find({
        retreatId: opts.input,
      }).exec();

      const parsedEvents = events.map(processEvent);

      return parsedEvents;
    }),
});

function processExpense(expense: any) {
  return {
    name: expense.name,
    _id: expense._id.toString(),
    event: expense.event,
    eventId: expense.eventId,
    type: expense.type,
    cost: expense.cost,
    numUnits: expense.numUnits,
    notes: expense.notes,
  };
}

function processEvent(fundraiser: IFundraiser) {
  return {
    name: fundraiser.name,
    location: fundraiser.location,
    date: fundraiser.date,
    contactName: fundraiser.contactName,
    email: fundraiser.email,
    profit: fundraiser.profit,
    notes: fundraiser.notes,

    expenses: fundraiser.expenses.map(processExpense),
    _id: fundraiser._id.toString(),
    retreatId: fundraiser.retreatId.toString(),
  };
}
