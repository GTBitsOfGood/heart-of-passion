import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IChapter {
  name: string;
}

const ChapterSchema = new Schema<IChapter>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});w

export const Model =
  (mongoose.models.Chapter as mongoose.Model<IChapter>) ??
  mongoose.model("Chapter", ChapterSchema);
