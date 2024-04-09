import { z } from "zod";
import { FormDonation, formDonationSchema } from "~/common/types";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import formsiteClient, { FormsiteResult } from "~/server/formsite";

import {
  IFormDonations,
  FormDonationsModel,
} from "~/server/models/FormDonations";

async function getRecentFormDonations(): Promise<FormDonation[]> {
  const recentSubmissions = await formsiteClient.getRecentSubmissions();
  const parsedFormDonations = parseFormDonations(recentSubmissions);

  return parsedFormDonations;
}

function parseFormDonations(
  recentSubmissions: FormsiteResult[],
): FormDonation[] {
  return recentSubmissions.map((submission) => {
    const amountItem = submission.items.find((item) => item.id === "1");
    const noteItem = submission.items.find((item) => item.id === "12")
      ?.values?.[0];
    const firstNameItem = submission.items.find((item) => item.id === "3");
    const lastNameItem = submission.items.find((item) => item.id === "4");

    const amount = amountItem ? parseFloat(amountItem.value ?? "0") : 0;
    const note = noteItem ? noteItem.value : undefined;
    const firstName = firstNameItem ? firstNameItem.value : "";
    const lastName = lastNameItem ? lastNameItem.value : "";

    return formDonationSchema.parse({
      referenceNumber: submission.id,
      name: `${firstName} ${lastName}`.trim(),
      amount: amount,
      possibleChapter: "",
      date: new Date(submission.date_finish),
      note: "Earmarked for: " + note,
    });
  });
}

export const formDonationsRouter = createTRPCRouter({
  getDonations: adminProcedure
    .output(z.array(formDonationSchema))
    .query(async () => {
      const formDonations = await FormDonationsModel.findOne().exec();

      if (!formDonations) {
        const recentFormDonations = await getRecentFormDonations();
        await FormDonationsModel.create({
          donations: recentFormDonations,
          lastUpdated: new Date(),
        });

        return recentFormDonations;
      }

      const ONE_DAY = 1000 * 60 * 60 * 24;
      if (
        new Date().getTime() - formDonations.lastUpdated.getTime() >
        ONE_DAY
      ) {
        const recentFormDonations = await getRecentFormDonations();
        updateRecentFormDonations(formDonations, recentFormDonations);
        formDonations.lastUpdated = new Date();
        await formDonations.save();
      }

      return formDonations.donations;
    }),

  updateDonation: adminProcedure
    .input(
      z.object({
        referenceNumber: z.string(),
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const formDonation = await FormDonationsModel.findOne({});
      if (!formDonation) {
        throw new Error("Form donation not found");
      }

      console.log("Updating donation", input.referenceNumber, input.chapterId);

      formDonation.donations.forEach((donation) => {
        if (donation.referenceNumber === input.referenceNumber) {
          console.log(
            "Updating donation",
            donation.referenceNumber,
            input.chapterId,
          );
          donation.chapterId = input.chapterId;
        }
      });

      await formDonation.save();
    }),
});

function updateRecentFormDonations(
  formDonations: IFormDonations,
  recentFormDonations: FormDonation[],
) {
  const alreadyInserted = formDonations.donations.map(
    (formDonation) => formDonation.referenceNumber,
  );

  const newFormDonations = recentFormDonations.filter(
    (formDonation) => !alreadyInserted.includes(formDonation.referenceNumber),
  );

  formDonations.donations = [...formDonations.donations, ...newFormDonations];
}
