import "dotenv/config";

import dbConnect from "../src/server/db";
import { ChapterModel } from "../src/server/models/Chapter";
import mongoose, { Types } from "mongoose";
import { RetreatModel } from "../src/server/models/Retreat";
import { EventModel } from "../src/server/models/Event";
import { FundraiserModel } from "../src/server/models/Fundraiser";

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

  var fundraiser1 = await FundraiserModel.create({
    retreatId: retreat._id,
    name: "School Fundraising Activity",
    date: "2024-03-05",
    contactName: "J",
    email: "J@gmail.com",
    profit: 50000,
    expenses: [
      {
        name: "Preparation",
        cost: 400,
        type: "Miscellaneous",
        numUnits: 1,
      },
      {
        name: "Transportation",
        cost: 50,
        type: "Transportation",
        numUnits: 1,
      },
    ],
  });

  var fundraiser2 = await FundraiserModel.create({
    retreatId: retreat._id,
    name: "Museum Fundraising Activity",
    date: "2023-12-01",
    contactName: "Q",
    email: "Q@gmail.com",
    profit: 10000,
    expenses: [
      {
        name: "Preparation Materials",
        cost: 200,
        type: "Miscellaneous",
        numUnits: 1,
      },      
      {
        name: "Lunch",
        cost: 20,
        type: "Food",
        numUnits: 10,
      },
      {
        name: "Transportation",
        cost: 100,
        type: "Transportation",
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
    const id = await generateData(chapter._id as Types.ObjectId);
    console.log(`Retreat Generated: ${id}\nChapter Generated: ${chapter._id}`);
  } catch (e) {
    await ChapterModel.findOneAndDelete({ name: "Test Chapter" });
    var chapter = await ChapterModel.create({
      name: "Test Chapter",
    });
    const id = await generateData(chapter._id as Types.ObjectId);
    console.log(`Retreat Generated: ${id}\nChapter Generated: ${chapter._id}`);
  }
  mongoose.connection.close();
})();
