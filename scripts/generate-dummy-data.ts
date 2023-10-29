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
  try {
    var retreat = await RetreatModel.create({
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

    var event1 = await EventModel.create({
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
    var event2 = await EventModel.create({
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
    var event3 = await EventModel.create({
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
    var retreat2 = await RetreatModel.create({
      year: 2023,
      chapterId: chapter._id,
    });

    var event4 = await EventModel.create({
      retreatId: retreat2._id,
      name: "Wellness and Nutrition Seminar",
      location: "Health Hub",
      energyLevel: "medium",
      category: "educational",
      dates: [
        { date: day1, from: "10:00 am", to: "12:00 pm" },
        { date: day3, from: "2:00 pm", to: "4:00 pm" },
      ],
      expenses: [
        {
          name: "Venue Rental",
          cost: 1500,
          type: "other",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Spacious hall with audio-visual facilities.",
        },
        {
          name: "Nutritionist Fee",
          cost: 700,
          type: "entertainment",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Certified nutrition expert.",
        },
      ],
    });

    var event5 = await EventModel.create({
      retreatId: retreat2._id,
      name: "Mindful Nature Walk",
      location: "Green Trails Park",
      energyLevel: "low",
      category: "other",
      dates: [
        { date: day2, from: "3:00 pm", to: "5:00 pm" },
        { date: day4, from: "9:00 am", to: "10:30 am" },
      ],
      expenses: [
        {
          name: "Park Entry Fee",
          cost: 200,
          type: "other",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Entry for all participants.",
        },
        {
          name: "Guide Fee",
          cost: 300,
          type: "other",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Experienced nature guide.",
        },
      ],
    });

    var event6 = await EventModel.create({
      retreatId: retreat2._id,
      name: "Group Yoga Session",
      location: "Zen Garden",
      energyLevel: "high",
      category: "entertainment",
      dates: [
        { date: day1, from: "5:30 pm", to: "7:30 pm" },
        { date: day3, from: "7:00 am", to: "8:30 am" },
      ],
      expenses: [
        {
          name: "Garden Rental",
          cost: 1000,
          type: "other",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Peaceful outdoor yoga space.",
        },
        {
          name: "Yoga Instructor",
          cost: 500,
          type: "other",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Certified yoga instructor.",
        },
      ],
    });

    var retreat3 = await RetreatModel.create({
      year: 2023,
      chapterId: chapter._id,
    });

    var event7 = await EventModel.create({
      retreatId: retreat3._id,
      name: "Tech Innovation Workshop",
      location: "Innovation Hub",
      energyLevel: "high",
      category: "educational",
      dates: [
        { date: day2, from: "2:00 pm", to: "5:00 pm" },
        { date: day4, from: "10:00 am", to: "12:30 pm" },
      ],
      expenses: [
        {
          name: "Workshop Space Rental",
          cost: 1800,
          type: "other",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Equipped with tech facilities.",
        },
        {
          name: "Tech Expert Speaker",
          cost: 1200,
          type: "other",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Industry expert in tech innovation.",
        },
      ],
    });

    var event8 = await EventModel.create({
      retreatId: retreat3._id,
      name: "Culinary Delights Showcase",
      location: "Gourmet Haven",
      energyLevel: "medium",
      category: "educational",
      dates: [
        { date: day1, from: "6:00 pm", to: "8:00 pm" },
        { date: day3, from: "12:00 pm", to: "2:00 pm" },
      ],
      expenses: [
        {
          name: "Restaurant Reservation",
          cost: 2500,
          type: "other",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Exclusive use of the restaurant.",
        },
        {
          name: "Chef's Tasting Menu",
          cost: 800,
          type: "other",
          costType: "per unit",
          numberOfUnits: 20,
          notes: "Special menu for participants.",
        },
      ],
    });

    var event9 = await EventModel.create({
      retreatId: retreat3._id,
      name: "Live Music Night",
      location: "Harmony Lounge",
      energyLevel: "high",
      category: "entertainment",
      dates: [
        { date: day2, from: "8:00 pm", to: "10:00 pm" },
        { date: day4, from: "7:30 pm", to: "9:30 pm" },
      ],
      expenses: [
        {
          name: "Lounge Rental",
          cost: 1200,
          type: "other",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Cozy space with stage setup.",
        },
        {
          name: "Live Band",
          cost: 1500,
          type: "entertainment",
          costType: "flat cost",
          numberOfUnits: 1,
          notes: "Talented musicians for the event.",
        },
      ],
    });

    console.log(
      `Retreat Generated: ${retreat._id}\nChapter Generated: ${chapter._id}\nEvents Generated: ${event1._id}, ${event2._id}, ${event3._id}`,
    );
  } catch (e) {
    console.error(e);
    await ChapterModel.findOneAndDelete({ _id: chapter._id });
  }
  mongoose.connection.close();
})();
