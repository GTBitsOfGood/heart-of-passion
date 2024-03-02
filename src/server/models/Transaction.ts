import mongoose from "mongoose";
import { z } from "zod";
import { transactionSchema } from "~/common/types";

const { Schema } = mongoose;

export interface ITransaction extends z.infer<typeof transactionSchema> {
  _id: string;
  chapterId: mongoose.Types.ObjectId;
}

const TransactionSchema = new Schema<ITransaction>({
  chapterId: {
    ref: "Chapter",
    type: Schema.Types.ObjectId,
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
