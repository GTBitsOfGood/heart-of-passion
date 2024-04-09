import mongoose from "mongoose";
import { z } from "zod";
import { FormDonation, formDonationSchema } from "~/common/types";

const { Schema } = mongoose;

export interface IFormDonations {
  donations: FormDonation[];
  lastUpdated: Date;
}

const DonationSchema = new Schema<FormDonation>({
  date: {
    type: Date,
    required: true,
  },

  referenceNumber: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  chapterId: {
    ref: "Chapter",
    type: String,
    required: false,
  },

  note: {
    type: String,
    required: false,
  },
});

const FormDonationsSchema = new Schema<IFormDonations>({
  donations: {
    type: [DonationSchema],
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
});

export const FormDonationsModel =
  mongoose.models && mongoose.models.FormDonations
    ? (mongoose.models.FormDonations as mongoose.Model<IFormDonations>)
    : mongoose.model<IFormDonations>("FormDonations", FormDonationsSchema);
