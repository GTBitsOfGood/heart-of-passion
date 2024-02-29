import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { expenseSchema, fundraiserSchema } from "~/common/types";

import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { TransactionModel } from "~/server/models/Transaction";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8888 } = process.env;

const baseUrl = "https://api-m.paypal.com";

export const transactionRouter = createTRPCRouter({
  getRecentTransactions: studentProcedure
    .input(
      z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      }),
    )
    .query(async ( opts ) => {
      // const {startDate, endDate} = opts;
      const input = opts.input;
      const queryParams = Object.entries(input).join("&");
      const apiCall = `${baseUrl}/v1/reporting/transactions?${queryParams}`;
      const transactionHistory = await fetch(apiCall);
      if(!transactionHistory) {
        throw new TRPCError({code: "BAD_REQUEST"});
      }
      console.log(transactionHistory);
    }),

  storeTransaction: studentProcedure.input(
    z.object({transactionId: z.string()})
    ).mutation(async({input})=>{
      const { transactionId } = input;
      const transaction = new TransactionModel({
        transactionId,
      });
      await transaction.save();
    }
  )
  
});
