import mongoose, { mongo } from "mongoose";
import { number } from "zod";

const { Schema } = mongoose;
export interface IExpense {
  name: string;
  cost: number;
  type: "entertainment" | "transportation" | "other";
  costType: "per unit" | "flat cost";
  numberOfUnits: number;
  notes: string;
}
export interface IEvent {
  retreatId: mongoose.Types.ObjectId;
  name: string;
  location: string; //optional
  energyLevel: "low" | "medium" | "high"; //optional
  category: "entertainment" | "educational" | "other"; //optional
  dates: [mongoose.Schema.Types.Mixed];
  expenses: [IExpense];
}

const EventSchema = new Schema<IEvent>({
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
  energyLevel: {
    type: String,
    enum: ["low", "medium", "high"],
  },
  category: {
    type: String,
    enum: ["entertainment", "educational", "other"],
  },
  dates: {
    type: [Schema.Types.Mixed], // [{date: Date, from: time, to: time}]
    required: true,
  },
  expenses: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          enum: ["entertainment", "transportation", "other"],
          required: true,
        },
        costType: {
          type: String,
          enum: ["per unit", "flat cost"],
          required: true,
        },
        numberOfUnits: {
          type: Number,
          default: 1,
          required: true,
        },
        notes: {
          type: String,
        },
      },
    ],
  },
});

export const EventModel =
  (mongoose.models.Event as mongoose.Model<IEvent>) ??
  mongoose.model("Event", EventSchema);
