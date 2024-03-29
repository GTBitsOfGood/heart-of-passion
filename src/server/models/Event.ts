import mongoose, { mongo } from "mongoose";
import { number, z } from "zod";
import { dateObjectSchema, eventSchema, expenseSchema } from "~/common/types";

const { Schema } = mongoose;

interface IExpense extends z.infer<typeof expenseSchema> {
  _id: string;
  retreatId: mongoose.Types.ObjectId;
}
interface IEventDate extends z.infer<typeof dateObjectSchema> {}

export interface IEvent extends z.infer<typeof eventSchema> {
  _id: string;
  retreatId: mongoose.Types.ObjectId;
}

const DateSchema = new Schema<IEventDate>({
  day: { type: Number, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
});

export const ExpenseSchema = new Schema<IExpense>({
  retreatId: {
    ref: "Retreat",
    type: Schema.Types.ObjectId,
  },
  name: { type: String, required: true },
  event: { type: String },
  type: { type: String, required: true },
  cost: { type: Number, required: true },
  numUnits: { type: Number },
});
export const EventSchema = new Schema<IEvent>({
  retreatId: {
    ref: "Retreat",
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
  },
  energyLevel: {
    type: String,
    enum: ["low", "medium", "high"],
  },
  dates: {
    type: [DateSchema], // [{date: Date, from: time, to: time}]
    required: true,
  },
  expenses: [ExpenseSchema],
  notes: {
    type: String,
  },
});

export const EventModel =
  (mongoose.models.Event as mongoose.Model<IEvent>) ??
  mongoose.model("Event", EventSchema);

export const ExpenseModel =
  (mongoose.models.Expense as mongoose.Model<IExpense>) ??
  mongoose.model("Expense", ExpenseSchema);
