import { z } from "zod";

import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { DonorModel } from "~/server/models/Donor";
import { Donor } from "~/common/types";
import { donorSchema } from "~/common/types";
import { TRPCError } from "@trpc/server";
export const donorRouter = createTRPCRouter({
  createDonor: studentProcedure
    .input(donorSchema)
    .mutation(async ({ input }) => {
      const donor = new DonorModel(input);
      if (
        input.donorEmail &&
        (await DonorModel.exists({ donorEmail: input.donorEmail }))
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }

      await donor.save();
    }),

  deleteDonor: studentProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await DonorModel.findOneAndDelete({ donorEmail: input }).exec();
    }),

  updateDonor: studentProcedure
    .input(
      z.object({
        donorId: z.string(),
        updatedDonor: donorSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { donorId, updatedDonor } = input;
      await DonorModel.findOneAndUpdate({ _id: donorId }, updatedDonor).exec();
    }),
  getDonor: studentProcedure
    .input(z.string())
    .query(async ({ input }): Promise<Donor> => {
      const donor = await DonorModel.findById(input).exec();
      return processDonor(donor);
    }),
  getDonors: studentProcedure.query(async () => {
    const donors = await DonorModel.find().exec();
    return donors.map(processDonor);
  }),
  getDonorsByYear: studentProcedure
    .input(z.number())
    .query(async ({ input }): Promise<Donor[]> => {
      if (input < 1900) return [];
      const startOfYear = new Date(`${input}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${input + 1}-01-01T00:00:00.000Z`);
      const donors = await DonorModel.find({
        createdAt: { $gte: startOfYear, $lt: endOfYear },
      }).exec();
      return donors.map(processDonor);
    }),
});

function processDonor(obj: any): Donor {
  return {
    _id: obj._id,
    donorName: obj.donorName ?? "",
    studentName: obj.studentName ?? "",
    donorEmail: obj.donorEmail,
    source: obj.source,
    sponsorLevel: obj.sponsorLevel,
    status: obj.status,
    notes: obj.notes ?? "",
    address: obj.address,
    createdAt: obj.createdAt.toISOString(),
  };
}
