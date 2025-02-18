import "dotenv/config";

import mongoose from "mongoose";
import dbConnect from "~/server/db";
import { DonorModel } from "~/server/models/Donor";

(async () => {
  await dbConnect();
  try {
    console.log("Migrating donor timestamps...");
    
    const result = await DonorModel.updateMany(
      { createdAt: { $exists: false } },
      [
        {
          $set: {
            createdAt: { $toDate: "$_id" },
            updatedAt: { $toDate: "$_id" },
          },
        },
      ],
    );
    console.log("Done!");
  } catch (e) {
    console.error("Migration failed: ", e);
  } finally {
    mongoose.connection.close();
  }
})();
