import { z } from "zod";

import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { UserModel } from "~/server/models/User";
import { DonorModel } from "~/server/models/Donor";
import { ChapterModel } from "~/server/models/Chapter";
import { Chapter, User, userSchema } from "~/common/types";
import { Donor } from "~/common/types";
import { donorSchema } from "~/common/types";
import { auth } from "~/server/auth";
import { TRPCError } from "@trpc/server";
export const donorRouter = createTRPCRouter({
  createDonor: studentProcedure
    .input(donorSchema)
    .mutation(async ({ input }) => {
        const donor = new DonorModel(input)
        await donor.save() 
    }),

  deleteDonor: mentorProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
    await UserModel.findByIdAndDelete(input).exec();
  }),

  updateDonor: mentorProcedure
    .input(
        z.object({
            donorId: z.string(),
            updatedDonor: donorSchema,
        })
    )
    .mutation(async ({ input }) => {
        const { donorId, updatedDonor } = input;
        await DonorModel.findByIdAndUpdate(donorId, updatedDonor).exec();
    }),
  getDonor: studentProcedure
    .input(z.string())
    .query(async ({ input }): Promise<Donor> => {
      const donor = await UserModel
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
    donorEmail: obj.email,
    source: obj.source,
    sponsorLevel: obj.sponsorLevel,
  };
}
