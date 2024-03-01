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
  },
  transaction_date: {
    type: String,
    required: true,
  },
  payer_email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  }
});

export const TransactionModel =
  (mongoose.models.Transaction as mongoose.Model<ITransaction>) ??
  mongoose.model("Transaction", TransactionSchema);
