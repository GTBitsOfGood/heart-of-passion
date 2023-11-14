import mongoose from "mongoose";
import { EventSchema } from "./Event";
import { eventSchema, retreatSchema } from "~/common/types";
import { z } from "zod";

const { Schema } = mongoose;

export interface IRetreat extends z.infer<typeof retreatSchema> {
  _id: string;
}

const RetreatSchema = new Schema<IRetreat>({
  year: {
    type: Number,
    required: true,
  },
  chapterId: {
    ref: "Chapter",
    type: String,
    required: true,
  },
});

export const RetreatModel =
  (mongoose.models.Retreat as mongoose.Model<IRetreat>) ??
  mongoose.model("Retreat", RetreatSchema);
