import { time } from "console";
import mongoose from "mongoose";
import { z } from "zod";
import { donorSchema, SponsorLevel, Status } from "~/common/types";

const { Schema } = mongoose;

export interface IDonor extends z.infer<typeof donorSchema> {
  _id: string;
  donorName: string;
  studentName: string;
  donorEmail: string;
  source: string;
  sponsorLevel: SponsorLevel;
  status: Status;
  notes: string;
  address: string;
}

export const SPONSOR_LEVEL_OPTIONS = [
  "Bronze",
  "Platinum",
  "Gold",
  "Silver",
  "Star",
];
export const STATUS_OPTIONS = [
  "Waiting for Reply",
  "Send Thank You Note",
  "Note Sent",
  "Send Email",
];

const DonorSchema = new Schema<IDonor>(
  {
    donorName: {
      type: String,
      required: true,
    },

    studentName: {
      type: String,
      required: true,
    },
    donorEmail: {
      type: String,
      required: false,
      // unique: false,
      // sparse: true
    },
    source: {
      type: String,
      required: true,
    },
    sponsorLevel: {
      type: String,
      enum: SPONSOR_LEVEL_OPTIONS,
      required: true,
    },
    status: {
      type: String,
      enum: STATUS_OPTIONS,
      required: true,
    },
    notes: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true },
);

export const DonorModel =
  mongoose.models && mongoose.models.Donor
    ? (mongoose.models.Donor as mongoose.Model<IDonor>)
    : mongoose.model<IDonor>("Donor", DonorSchema);
