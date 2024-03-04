import mongoose from "mongoose";
import { z } from "zod";
import { transactionSchema } from "~/common/types";

const { Schema } = mongoose;

export interface ITransaction extends z.infer<typeof transactionSchema> {
  _id: string;
}

const TransactionSchema = new Schema<ITransaction>({
  chapter: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  transactionDate: {
    type: String,
    required: true,
  },
  payerEmail: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  payerName: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true
  }
});

export const TransactionModel =
  (mongoose.models.Transaction as mongoose.Model<ITransaction>) ??
  mongoose.model("Transaction", TransactionSchema);
