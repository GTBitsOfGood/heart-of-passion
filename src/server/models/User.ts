import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IUser {
  role: "student" | "mentor" | "admin";
}

const UserSchema = new Schema<IUser>({
  role: {
    type: String,
    enum: ["student", "mentor", "admin"],
    default: "student",
  },
});

export const Model =
  (mongoose.models.User as mongoose.Model<IUser>) ??
  mongoose.model("User", UserSchema);
