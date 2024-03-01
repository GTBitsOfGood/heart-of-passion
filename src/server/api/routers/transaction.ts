import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { transactionSchema } from "~/common/types";

import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { TransactionModel } from "~/server/models/Transaction";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

// const baseUrl = "https://api-m.paypal.com";
const baseUrl = "https://api-m.sandbox.paypal.com";

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data.access_token;
};

export const transactionRouter = createTRPCRouter({
  getRecentTransactions: studentProcedure
    .input(
      z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      }),
    )
    .query(async ({input}) => {
      // const {startDate, endDate} = opts;
      
      const accessToken = await getAccessToken();
      console.log(`access:${accessToken}`);

      const {startDate, endDate } = input;
      console.log(startDate);
      console.log(endDate);
      const queryParams = `start_date=${startDate}&end_date=${endDate}`
      const url = `${baseUrl}/v1/reporting/transactions?${queryParams}`;
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      });

      if (!response) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const data = await response.json();
      console.log(data);
      return data;
    }),

  storeTransaction: studentProcedure
    .input(z.object({ chapterId: z.string(), transactionDetails: transactionSchema }))
    .mutation(async ({ input }) => {
      const { chapterId, transactionDetails } = input;
      const transaction = new TransactionModel({chapterId, ...transactionDetails});
      await transaction.save();
    }),
});
