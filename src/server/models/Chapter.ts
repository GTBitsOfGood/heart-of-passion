import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IChapter {
  name: string;
  year: string;
  totalCost: number;
  fundExpected: number;
  fundActual: number;
}

const ChapterSchema = new Schema<IChapter>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  year: {
    type: String,
    required: true,
  },
  totalCost: {
    type: Number,
  },
  fundExpected: {
    type: Number,
  },
  fundActual: {
    type: Number,
  },
});

export const Model =
  (mongoose.models.Chapter as mongoose.Model<IChapter>) ??
  mongoose.model("Chapter", ChapterSchema);
