import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IUser {
  name: string;
  email: string;
  chapter: string;
  role: "student" | "mentor" | "admin";
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "mentor", "admin"],
    default: "student",
    required: true,
  },
  chapter: {
    type: String,
    required: false,
  },
});

export const Model =
  (mongoose.models.User as mongoose.Model<IUser>) ??
  mongoose.model("User", UserSchema);
