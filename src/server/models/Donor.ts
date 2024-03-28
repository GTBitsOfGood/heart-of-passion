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
}

export const sponsorLevelOptions = [
  "Platinum",
  "Gold",
  "Silver",
  "Star",
  "Bronze",
];
export const statusOptions = [
  "Waiting for Reply",
  "Send Thank You Note",
  "Note Sent",
  "Send Email",
];

const DonorSchema = new Schema<IDonor>({
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
    required: true,
    unique: true,
  },
  source: {
    type: String,
    required: true,
  },
  sponsorLevel: {
    type: String,
    enum: sponsorLevelOptions,
    required: true,
  },
  status: {
    type: String,
    enum: statusOptions,
    required: true,
  },
});

export const DonorModel =
  mongoose.models && mongoose.models.Donor
    ? (mongoose.models.Donor as mongoose.Model<IDonor>)
    : mongoose.model<IDonor>("Donor", DonorSchema);
