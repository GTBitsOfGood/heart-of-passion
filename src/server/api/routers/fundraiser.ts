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
  updateExpense: studentProcedure
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
        throw new Error("Event not found: " + fundraiser);
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
  createExpense: studentProcedure
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
      try {
        if (events) savedFundraiserSchema.parse(parsedEvents[0]);
      } catch (e) {
        console.log(parsedEvents[0]);
      }

      return parsedEvents;
    }),
  getExpenses: studentProcedure.input(z.string()).query(async (opts) => {
    const expenses = await ExpenseModel.find({ retreatId: opts.input }).exec();
    return expenses;
  }),
});

function processEvent(fundraiser: IFundraiser) {
  return {
    name: fundraiser.name,
    location: fundraiser.location,
    date: fundraiser.date,
    contactName: fundraiser.contactName,
    email: fundraiser.email,
    profit: fundraiser.profit,
    expenses: fundraiser.expenses,
    _id: fundraiser._id.toString(),
    retreatId: fundraiser.retreatId.toString(),
  };
}
