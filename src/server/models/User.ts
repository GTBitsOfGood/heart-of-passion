import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IUser {
  name: string;
  email: string;
  chapter: mongoose.Types.ObjectId;
  role: "student" | "mentor" | "admin";
}

const UserSchema = new Schema<IUser>({
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
});

export const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ??
  mongoose.model("User", UserSchema);
