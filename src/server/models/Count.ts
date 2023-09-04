import mongoose from "mongoose";

const { Schema } = mongoose;

export interface ICount {
  count: number;
}

const CountSchema = new Schema<ICount>({
  count: {
    type: Number,
    default: 0,
  },
});

export const Count =
  (mongoose.models.Count as mongoose.Model<ICount>) ??
  mongoose.model("Count", CountSchema);
