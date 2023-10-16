import "dotenv/config";

import dbConnect from "../src/server/db";
import { ChapterModel } from "../src/server/models/Chapter";
import mongoose from "mongoose";
import { RetreatModel } from "~/server/models/Retreat";
import { EventModel } from "~/server/models/Event";

(async () => {
  await dbConnect();

  const chapter = await ChapterModel.create({
    name: "Test Chapter",
  });

  const retreat = await RetreatModel.create({
    year: 2023,
    chapterId: chapter._id,
  });
  const day1 = new Date();
  day1.setHours(0, 0, 0, 0);

  const day2 = new Date();
  day2.setDate(day1.getDate() + 1);
  day2.setHours(0, 0, 0, 0);

  const day3 = new Date();
  day3.setDate(day1.getDate() + 2);
  day3.setHours(0, 0, 0, 0);

  const day4 = new Date();
  day4.setDate(day1.getDate() + 3);
  day4.setHours(0, 0, 0, 0);

  const event1 = await EventModel.create({
    retreatId: retreat._id,
    name: "Yoga and Meditation Retreat",
    location: "Mountain Retreat Center",
    energyLevel: "high",
    category: "educational",
    dates: [
      { date: day1, from: "1:30 pm", to: "4:30 pm" },
      { date: day2, from: "9:30 am", to: "10:00 am" },
      { date: day4, from: "11:30 pm", to: "1:30 pm" },
    ],
    expenses: [
      {
        name: "Venue Rental",
        cost: 2000,
        type: "other",
        costType: "flat cost",
        numberOfUnits: 1,
        notes: "Includes accommodation and amenities.",
      },
      {
        name: "Transportation",
        cost: 500,
        type: "transportation",
        costType: "flat cost",
        numberOfUnits: 1,
        notes: "Bus rental for participants.",
      },
      {
        name: "Guest Speaker",
        cost: 1000,
        type: "entertainment",
        costType: "flat cost",
        numberOfUnits: 1,
        notes: "Expert in mindfulness and meditation.",
      },
    ],
  });
  const event2 = await EventModel.create({
    retreatId: retreat._id,
    name: "Art and Creativity Workshop",
    location: "City Art Center",
    energyLevel: "medium",
    category: "educational",
    dates: [
      { date: day2, from: "1:30 pm", to: "4:30 pm" },
      { date: day4, from: "11:30 am", to: "2:30 pm" },
    ],
    expenses: [
      {
        name: "Art Supplies",
        cost: 800,
        type: "other",
        costType: "flat cost",
        numberOfUnits: 1,
        notes: "Paints, canvases, brushes, etc.",
      },
      {
        name: "Instructor Fee",
        cost: 600,
        type: "transportation",
        costType: "flat cost",
        numberOfUnits: 1,
        notes: "Professional art instructor.",
      },
    ],
  });
  const event3 = await EventModel.create({
    retreatId: retreat._id,
    name: "Outdoor Adventure Retreat",
    location: "Wilderness Camp",
    energyLevel: "high",
    category: "entertainment",
    dates: [
      { date: day1, from: "7:30 pm", to: "8:30 pm" },
      { date: day2, from: "5:30 pm", to: "6:30 pm" },
      { date: day3, from: "4:30 pm", to: "5:30 pm" },
      { date: day4, from: "11:30 am", to: "12:00 pm" },
    ],
    expenses: [
      {
        name: "Campsite Rental",
        cost: 1200,
        type: "other",
        costType: "flat cost",
        numberOfUnits: 1,
        notes: "Includes camping facilities and guides.",
      },
      {
        name: "Equipment Rental",
        cost: 400,
        type: "other",
        costType: "flat cost",
        numberOfUnits: 1,
        notes: "Tents, sleeping bags, etc.",
      },
      {
        name: "Adventure Guides",
        cost: 800,
        type: "entertainment",
        costType: "flat cost",
        numberOfUnits: 2,
        notes: "Experienced guides for hiking and activities.",
      },
    ],
  });

  console.log(
    `Retreat Generated: ${retreat._id}\nChapter Generated: ${chapter._id}\nEvents Generated: ${event1._id}, ${event2._id}, ${event3._id}`,
  );
  mongoose.connection.close();
})();
