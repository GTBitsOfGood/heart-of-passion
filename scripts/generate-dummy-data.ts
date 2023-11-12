import "dotenv/config";

import dbConnect from "../src/server/db";
import { ChapterModel } from "../src/server/models/Chapter";
import mongoose from "mongoose";
import { RetreatModel } from "~/server/models/Retreat";
import { EventModel } from "~/server/models/Event";

const generateData = async (chapterId: string) => {
  var retreat = await RetreatModel.create({
    year: 2023,
    chapterId: chapterId,
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

  var event1 = await EventModel.create({
    retreatId: retreat._id,
    name: "Yoga and Meditation Retreat",
    location: "Mountain Retreat Center",
    energyLevel: "high",
    category: "educational",
    dates: [
      { date: day1, from: "7:30 pm", to: "8:30 pm" },
      { date: day2, from: "5:30 pm", to: "6:30 pm" },
      { date: day3, from: "4:30 pm", to: "5:30 pm" },
      { date: day4, from: "11:30 am", to: "12:00 pm" },
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
  var event2 = await EventModel.create({
    retreatId: retreat._id,
    name: "Art and Creativity Workshop",
    location: "City Art Center",
    energyLevel: "medium",
    category: "educational",
    dates: [
      { date: day1, from: "1:30 pm", to: "8:30 pm" },
      { date: day2, from: "3:30 pm", to: "6:30 pm" },
      { date: day3, from: "4:30 pm", to: "5:30 pm" },
      { date: day4, from: "11:30 am", to: "12:00 pm" },
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
  // var retreat2 = await RetreatModel.create({
  //   year: 2023,
  //   chapterId: chapterId,
  // });

  // var event4 = await EventModel.create({
  //   retreatId: retreat2._id,
  //   name: "Wellness and Nutrition Seminar",
  //   location: "Health Hub",
  //   energyLevel: "medium",
  //   category: "educational",
  //   dates: [
  //     { date: day1, from: "10:00 am", to: "12:00 pm" },
  //     { date: day3, from: "2:00 pm", to: "4:00 pm" },
  //   ],
  //   expenses: [
  //     {
  //       name: "Venue Rental",
  //       cost: 1500,
  //       type: "other",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Spacious hall with audio-visual facilities.",
  //     },
  //     {
  //       name: "Nutritionist Fee",
  //       cost: 700,
  //       type: "entertainment",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Certified nutrition expert.",
  //     },
  //   ],
  // });

  // var event5 = await EventModel.create({
  //   retreatId: retreat2._id,
  //   name: "Mindful Nature Walk",
  //   location: "Green Trails Park",
  //   energyLevel: "low",
  //   category: "other",
  //   dates: [
  //     { date: day2, from: "3:00 pm", to: "5:00 pm" },
  //     { date: day4, from: "9:00 am", to: "10:30 am" },
  //   ],
  //   expenses: [
  //     {
  //       name: "Park Entry Fee",
  //       cost: 200,
  //       type: "other",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Entry for all participants.",
  //     },
  //     {
  //       name: "Guide Fee",
  //       cost: 300,
  //       type: "other",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Experienced nature guide.",
  //     },
  //   ],
  // });

  // var event6 = await EventModel.create({
  //   retreatId: retreat2._id,
  //   name: "Group Yoga Session",
  //   location: "Zen Garden",
  //   energyLevel: "high",
  //   category: "entertainment",
  //   dates: [
  //     { date: day1, from: "5:30 pm", to: "7:30 pm" },
  //     { date: day3, from: "7:00 am", to: "8:30 am" },
  //   ],
  //   expenses: [
  //     {
  //       name: "Garden Rental",
  //       cost: 1000,
  //       type: "other",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Peaceful outdoor yoga space.",
  //     },
  //     {
  //       name: "Yoga Instructor",
  //       cost: 500,
  //       type: "other",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Certified yoga instructor.",
  //     },
  //   ],
  // });

  // var retreat3 = await RetreatModel.create({
  //   year: 2023,
  //   chapterId: chapterId,
  // });

  // var event7 = await EventModel.create({
  //   retreatId: retreat3._id,
  //   name: "Tech Innovation Workshop",
  //   location: "Innovation Hub",
  //   energyLevel: "high",
  //   category: "educational",
  //   dates: [
  //     { date: day2, from: "2:00 pm", to: "5:00 pm" },
  //     { date: day4, from: "10:00 am", to: "12:30 pm" },
  //   ],
  //   expenses: [
  //     {
  //       name: "Workshop Space Rental",
  //       cost: 1800,
  //       type: "other",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Equipped with tech facilities.",
  //     },
  //     {
  //       name: "Tech Expert Speaker",
  //       cost: 1200,
  //       type: "other",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Industry expert in tech innovation.",
  //     },
  //   ],
  // });

  // var event8 = await EventModel.create({
  //   retreatId: retreat3._id,
  //   name: "Culinary Delights Showcase",
  //   location: "Gourmet Haven",
  //   energyLevel: "medium",
  //   category: "educational",
  //   dates: [
  //     { date: day1, from: "6:00 pm", to: "8:00 pm" },
  //     { date: day2, from: "2:00 pm", to: "5:00 pm" },
  //     { date: day3, from: "12:00 pm", to: "2:00 pm" },
  //   ],
  //   expenses: [
  //     {
  //       name: "Restaurant Reservation",
  //       cost: 2500,
  //       type: "other",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Exclusive use of the restaurant.",
  //     },
  //     {
  //       name: "Chef's Tasting Menu",
  //       cost: 800,
  //       type: "other",
  //       costType: "per unit",
  //       numberOfUnits: 20,
  //       notes: "Special menu for participants.",
  //     },
  //   ],
  // });

  // var event9 = await EventModel.create({
  //   retreatId: retreat3._id,
  //   name: "Live Music Night",
  //   location: "Harmony Lounge",
  //   energyLevel: "high",
  //   category: "entertainment",
  //   dates: [
  //     { date: day2, from: "8:00 pm", to: "10:00 pm" },
  //     { date: day4, from: "7:30 pm", to: "9:30 pm" },
  //   ],
  //   expenses: [
  //     {
  //       name: "Lounge Rental",
  //       cost: 1200,
  //       type: "other",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Cozy space with stage setup.",
  //     },
  //     {
  //       name: "Live Band",
  //       cost: 1500,
  //       type: "entertainment",
  //       costType: "flat cost",
  //       numberOfUnits: 1,
  //       notes: "Talented musicians for the event.",
  //     },
  //   ],
  // });
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
