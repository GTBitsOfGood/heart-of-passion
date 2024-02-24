import mongoose, { mongo } from "mongoose";
import { number, z } from "zod";
import { fundSchema } from "~/common/types";

const { Schema } = mongoose;

export interface IFund extends z.infer<typeof fundSchema> {
  retreatId: mongoose.Types.ObjectId;
}

export const FundSchema = new Schema<IFund>({
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
    type: String, // [{date: Date, from: time, to: time}]
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  source: {
    ref: "Event",
    type: String,
    required: true,
  },
});

export const FundModel =
  (mongoose.models.Fund as mongoose.Model<IFund>) ??
  mongoose.model("Fund", FundSchema);
