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
export const donorRouter = createTRPCRouter({
  createDonor: studentProcedure
    .input(donorSchema)
    .mutation(async ({ input }) => {
        const donor = new DonorModel(input)
        await donor.save() 
    }),

  deleteDonor: studentProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
    await DonorModel.findByIdAndDelete(input).exec();
  }),

  updateDonor: studentProcedure
    .input(
        z.object({
            donorEmail: z.string(),
            updatedDonor: donorSchema,
        })
    )
    .mutation(async ({ input }) => {
        const { donorEmail, updatedDonor } = input;
        await DonorModel.findOneAndUpdate({ donorEmail: donorEmail }, updatedDonor).exec();
    }),
  getDonor: studentProcedure
    .input(z.string())
    .query(async ({ input }): Promise<Donor> => {
      const donor = await DonorModel
        .findById(input)
        .exec();
      return processDonor(donor);
    }),
  getDonors: studentProcedure.query(async () => {
    const donors = await DonorModel
        .find()
        .exec();
    return donors.map(processDonor);
  }),
});

function processDonor(obj: any): Donor {
  return {
    donorName: obj.donorName ?? "",
    studentName: obj.studentName ?? "",
    donorEmail: obj.donorEmail,
    source: obj.source,
    sponsorLevel: obj.sponsorLevel,
    status: obj.status,
  };
}
