import mongoose from "mongoose";
import { chapterSchema } from "~/common/types";
import { number, z } from "zod";
const { Schema } = mongoose;

export interface IChapter extends z.infer<typeof chapterSchema> {}

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
