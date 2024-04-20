import { z } from "zod";

import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";

import { FundModel } from "~/server/models/Fund";
import { fundSchema } from "~/common/types";
import { FormDonationsModel } from "~/server/models/FormDonations";

export const fundRouter = createTRPCRouter({
  createFund: studentProcedure
    .input(
      z.object({
        retreatId: z.string(),
        fundDetails: fundSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { retreatId, fundDetails } = input;
      const fund = new FundModel({ retreatId, ...fundDetails });
      await fund.save();

      return { success: true };
    }),

  getFunds: studentProcedure.input(z.string()).query(async (opts) => {
    const funds = await FundModel.find({ retreatId: opts.input }).exec();

    return funds.map((f) => {
      return {
        retreatId: f.retreatId,
        name: f.name,
        date: f.date,
        amount: f.amount,
        source: f.source,
        _id: f._id,
      };
    });
  }),

  updateFund: studentProcedure
    .input(
      z.object({
        fundId: z.string(),
        updates: fundSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { fundId, updates } = input;
      const updateData = { ...updates };
      const fund = await FundModel.findByIdAndUpdate(fundId, updateData, {
        new: true,
      }).exec();
      return fund;
    }),

  deleteFund: studentProcedure.input(z.string()).mutation(async ({ input }) => {
    await FundModel.findByIdAndDelete(input).exec();
  }),
});
