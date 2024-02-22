import mongoose, { mongo } from "mongoose";
import { number, z } from "zod";
import { fundSchema } from "~/common/types";

const { Schema } = mongoose;

// interface IFundDate extends z.infer<typeof fundDateSchema> {}

export interface IFund extends z.infer<typeof fundSchema> {
  retreatId: mongoose.Types.ObjectId;
}

/*
const FundDateSchema = new Schema<IFundDate>({
  month: { type: Number, required: true },
  date: { type: Number, required: true },
  year: { type: Number, required: true },
});
*/

export const FundSchema = new Schema<IFund>({
  retreatId: {
    ref: "Retreat",
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
  },
  date: {
    type: String, // [{date: Date, from: time, to: time}]
  },
  amount: {
    type: Number,
    required: true,
  },
  source: {
    ref: "Event",
    type: String,
    // required: true,
  },
});

export const FundModel =
  (mongoose.models.Fund as mongoose.Model<IFund>) ??
  mongoose.model("Fund", FundSchema);
