import "dotenv/config";

import dbConnect from "../src/server/db";
import { ChapterModel } from "../src/server/models/Chapter";
import mongoose from "mongoose";

(async () => {
  await dbConnect();

  // Dummy Chapter
  await ChapterModel.create({
    name: "Test Chapter",
  });

  console.log("Dummy data generated!");
  mongoose.connection.close();
})();
