import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Transaction, transactionSchema } from "~/common/types";

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
  /*
    startDate: beginning of search query
    endDate: end of search query
      search query can only be 31 days long
    Returns array of transactions in transactionSchema format within search query
  */
  getRecentTransactions: studentProcedure
    .input(
      z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      }),
    )
    .query(async ({ input }) => {
      // const {startDate, endDate} = opts;

      const accessToken = await getAccessToken();
      console.log(`access:${accessToken}`);

      const { startDate, endDate } = input;
      console.log(startDate);
      console.log(endDate);
      const queryParams = `start_date=${startDate}&end_date=${endDate}`;
      const url = `${baseUrl}/v1/reporting/transactions?${queryParams}`;
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const data = await response.json();

      const txs = data.transaction_details.map((e: any) => {
        const tx_info = e.transaction_info;
        const tx: Transaction = {
          transactionId: tx_info.transaction_id,
          transactionDate: tx_info.transaction_initiation_date,
          payerEmail: e.payer_info?.email_address ?? "",
          message: tx_info.transaction_note ?? "",
          payerName: e.payer_info?.payer_name?.alternate_full_name ?? "",
          amount: parseFloat(tx_info.transaction_amount.value),
        };

        return tx;
      });

      // console.log(data)
      console.log(txs);
      return txs;
    }),

  /*
    Takes a chapterId and transaction in the form of transactionSchema and stores in db
  */
  storeTransaction: studentProcedure
    .input(
      z.object({
        chapterId: z.string(),
        transactionDetails: transactionSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { chapterId, transactionDetails } = input;
      // const transaction = new TransactionModel({
      //   chapterId,
      //   ...transactionDetails,
      // });

      const transactionId = transactionDetails.transactionId;
      await TransactionModel.updateOne(
        { transactionId },
        { $set: { chapterId, ...transactionDetails } },
        { upsert: true },
      );
    }),
});
