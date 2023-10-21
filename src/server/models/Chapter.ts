import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IChapter {
  _id: string,
  name: string;
}

const ChapterSchema = new Schema<IChapter>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const ChapterModel =
  (mongoose.models.Chapter as mongoose.Model<IChapter>) ??
  mongoose.model("Chapter", ChapterSchema);
