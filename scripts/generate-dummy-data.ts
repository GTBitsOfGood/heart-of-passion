import "dotenv/config";

import dbConnect from "../src/server/db";
import { ChapterModel } from "../src/server/models/Chapter";
import mongoose, { Types } from "mongoose";
import { RetreatModel } from "~/server/models/Retreat";
import { EventModel } from "~/server/models/Event";

const generateData = async (chapterId: Types.ObjectId) => {
  var retreat = await RetreatModel.create({
    year: 2023,
    chapterId: chapterId,
  });

  var event1 = await EventModel.create({
    retreatId: retreat._id,
    name: "Yoga and Meditation Retreat",
    location: "Mountain Retreat Center",
    energyLevel: "high",
    dates: [
      { day: 1, from: "2:30 pm", to: "4:30 pm" },
      { day: 2, from: "5:30 pm", to: "6:30 pm" },
      { day: 3, from: "4:30 pm", to: "5:30 pm" },
      { day: 4, from: "11:30 am", to: "12:00 pm" },
    ],
    expenses: [
      {
        name: "Venue Rental",
        cost: 2000,
        type: "Miscellaneous",
        numUnits: 1,
      },
      {
        name: "Transportation",
        cost: 500,
        type: "Transportation",
        numUnits: 1,
      },
      {
        name: "Guest Speaker",
        cost: 1000,
        type: "Entertainment",
        numUnits: 2,
      },
    ],
  });
  var event2 = await EventModel.create({
    retreatId: retreat._id,
    name: "Art and Creativity Workshop",
    location: "City Art Center",
    energyLevel: "medium",
    dates: [
      { day: 1, from: "1:30 pm", to: "8:30 pm" },
      { day: 1, from: "1:45 pm", to: "2:00 pm" },
      { day: 1, from: "8:00 pm", to: "8:30 pm" },
      { day: 2, from: "3:30 pm", to: "6:30 pm" },
      { day: 3, from: "4:30 pm", to: "5:30 pm" },
      { day: 4, from: "11:30 am", to: "12:00 pm" },
    ],
    expenses: [
      {
        name: "Art Supplies",
        cost: 800,
        type: "Miscellaneous",
        numUnits: 1,
      },
      {
        name: "Instructor Fee",
        cost: 600,
        type: "Transportation",
        notes: "Professional art instructor.",
        numUnits: 1,
      },
    ],
  });
  return retreat._id;
};

(async () => {
  await dbConnect();
  try {
    var chapter = await ChapterModel.create({
      name: "Test Chapter",
    });
    const id = await generateData(chapter._id);
    console.log(`Retreat Generated: ${id}\nChapter Generated: ${chapter._id}`);
  } catch (e) {
    await ChapterModel.findOneAndDelete({ name: "Test Chapter" });
    var chapter = await ChapterModel.create({
      name: "Test Chapter",
    });
    const id = await generateData(chapter._id);
    console.log(`Retreat Generated: ${id}\nChapter Generated: ${chapter._id}`);
  }
  mongoose.connection.close();
})();
