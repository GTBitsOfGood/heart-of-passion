import mongoose from "mongoose";

const { Schema } = mongoose;

export interface ITransaction {
  _id: string;
  transaction_id: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    _id: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
    },
  }
);

export const TransactionModel =
  (mongoose.models.Transaction as mongoose.Model<ITransaction>) ??
  mongoose.model("Transaction", TransactionSchema);
