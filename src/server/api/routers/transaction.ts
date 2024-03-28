import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Chapter, Transaction, transactionSchema } from "~/common/types";

import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { ChapterModel } from "~/server/models/Chapter";
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
          chapter: "Unclassified",
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
        transactionDetails: transactionSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { transactionDetails } = input;
      // const transaction = new TransactionModel({
      //   chapterId,
      //   ...transactionDetails,
      // });

      const transactionId = transactionDetails.transactionId;
      await TransactionModel.updateOne(
        { transactionId },
        { $set: { ...transactionDetails } },
        { upsert: true },
      );
    }),
  updateTransaction: studentProcedure
    .input(
      z.object({
        transactionId: z.string(),
        updatedTransaction: transactionSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { transactionId, updatedTransaction } = input;
      await TransactionModel.findOneAndUpdate(
        { transactionId: transactionId },
        updatedTransaction,
      ).exec();
    }),
  updateTransactionChapter: studentProcedure
    .input(
      z.object({
        transactionId: z.string(),
        chapter: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { transactionId, chapter } = input;
      await TransactionModel.findOneAndUpdate(
        { transactionId: transactionId },
        { chapter: chapter },
      ).exec();
    }),
  deleteTransaction: studentProcedure
    .input(
      z.object({
        transaction: transactionSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { transaction } = input;
      await TransactionModel.findOneAndDelete({
        transactionId: transaction.transactionId,
      }).exec();
    }),
  getTransaction: studentProcedure
    .input(z.string())
    .query(async ({ input }): Promise<Transaction> => {
      const transaction = await TransactionModel.findById(input).exec();
      return processTransactions(transaction);
    }),
  getTransactions: studentProcedure.query(async () => {
    const transactions = await TransactionModel.find().exec();
    return transactions.map(processTransactions);
  }),
});

function processTransactions(obj: any): Transaction {
  return {
    transactionId: obj.transactionId,
    transactionDate: obj.transactionDate,
    amount: obj.amount,
    payerEmail: obj.payerEmail,
    message: obj.message,
    payerName: obj.payerName,
    chapter: obj.chapter,
  };
}
