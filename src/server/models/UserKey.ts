import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IUserKey {
  _id: string;
  user_id: string;
  hashed_password?: string;
}

const UserKeySchema = new Schema<IUserKey>({
  _id: {
    type: String,
    required: true,
  },

  user_id: {
    type: String,
    required: true,
  },
  hashed_password: {
    type: String,
    required: false,
  },
});

export const UserKeyModel =
  (mongoose.models.UserKey as mongoose.Model<IUserKey>) ??
  mongoose.model("UserKey", UserKeySchema);
