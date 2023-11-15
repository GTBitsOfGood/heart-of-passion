import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IUser {
  _id: string;
  name: string;
  email: string;
  chapter?: mongoose.Types.ObjectId;
  role: "student" | "mentor" | "admin";
}

const UserSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
      required: true,
      auto: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
      required: true,
    },
    chapter: {
      ref: "Chapter",
      type: Schema.Types.ObjectId,
    },
  },
  { _id: false },
);

export const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ??
  mongoose.model("User", UserSchema);
