import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  role: {
    type: String,
    enum: ["student", "mentor", "admin"],
    default: "student",
  },
});

export default mongoose.models.User ?? mongoose.model("User", UserSchema);
