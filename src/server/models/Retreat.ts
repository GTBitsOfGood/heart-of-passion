import mongoose from "mongoose";
import { EventSchema, IExpense } from "./Event";
import { eventSchema } from "~/common/types";

const { Schema } = mongoose;

export interface IRetreat {
  id: string,
  year: number;
  chapterId: mongoose.Types.ObjectId;
  expenses: IExpense;
}

const RetreatSchema = new Schema<IRetreat>({
  year: {
    type: Number,
    required: true,
  },
  chapterId: {
    ref: "Chapter",
    type: Schema.Types.ObjectId,
    required: true,
  },
  expenses: [EventSchema],
});

export const RetreatModel =
  (mongoose.models.Retreat as mongoose.Model<IRetreat>) ??
  mongoose.model("Retreat", RetreatSchema);
