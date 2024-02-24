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
  },
  date: {
    type: String,
  },
  contactName: {
    type: String,
  },
  email: {
    type: String,
  },
  profit: {
    type: Number,
  },
  expenses: [ExpenseSchema],
});

export const FundraiserModel =
  (mongoose.models.Chapter as mongoose.Model<IFundraiser>) ??
  mongoose.model("Fundraiser", FundraiserSchema);
