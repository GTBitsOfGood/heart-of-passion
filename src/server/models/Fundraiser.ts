import mongoose from "mongoose";
import { z } from "zod";
import { fundraiserSchema } from "~/common/types";
import { ExpenseSchema } from "./Event";

const { Schema } = mongoose;

export interface IFundraiser extends z.infer<typeof fundraiserSchema> {
  _id: string;
  retreatId: mongoose.Types.ObjectId;
}

const FundraiserSchema = new Schema<IFundraiser>({
  retreatId: {
    ref: "Retreat",
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
  expenses: [ExpenseSchema],
});

export const FundraiserModel =
  (mongoose.models.Fundraiser as mongoose.Model<IFundraiser>) ??
  mongoose.model("Fundraiser", FundraiserSchema);
