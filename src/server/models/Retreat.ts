import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IRetreat {
  year: Number;
  chapterId: mongoose.Types.ObjectId;
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
});

export const RetreatModel =
  (mongoose.models.Retreat as mongoose.Model<IRetreat>) ??
  mongoose.model("Retreat", RetreatSchema);
