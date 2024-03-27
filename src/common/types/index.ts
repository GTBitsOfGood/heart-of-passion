import { z } from "zod";
import {
  sponsorLevelOptions,
  sourceOptions,
  statusOptions,
} from "~/server/models/Donor";

// Role
export const roleSchema = z.enum(["student", "mentor", "admin"]);
export type Role = z.infer<typeof roleSchema>;

// Donor

export const sponsorLevelSchema = z.enum(
  sponsorLevelOptions as [string, ...string[]],
);
export type SponsorLevel = z.infer<typeof sponsorLevelSchema>;

export const sourceSchema = z.enum(sourceOptions as [string, ...string[]]);
export type Source = z.infer<typeof sourceSchema>;

export const statusDonorSchema = z.enum(statusOptions as [string, ...string[]]);
export type Status = z.infer<typeof statusDonorSchema>;

export const donorSchema = z.object({
  studentName: z.string(),
  donorName: z.string(),
  donorEmail: z.string().email(),
  source: sourceSchema,
  sponsorLevel: sponsorLevelSchema,
  status: statusDonorSchema,
});
export type Donor = z.infer<typeof donorSchema>;

//DonorList
export const donorListSchema = z.object({
  title: z.string(),
  donors: z.array(donorSchema),
});
export type DonorList = z.infer<typeof donorListSchema>;

// User
export const userSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    role: roleSchema,
    chapter: z.string(),
  })
  .refine((data) => {
    if (data.role === "student" || data.role === "mentor") {
      return data.chapter !== undefined;
    }

    return true;
  });
export type User = z.infer<typeof userSchema>;

// User List
export const userListSchema = z.object({
  title: z.string(),
  users: z.array(userSchema),
});
export type UserList = z.infer<typeof userListSchema>;

// Role
export const expenseTypeSchema = z.enum([
  "Entertainment",
  "Food",
  "Transportation",
  "Hotel",
  "Decorations",
  "Miscellaneous",
]);
export type Type = z.infer<typeof expenseTypeSchema>;

export const dateObjectSchema = z.object({
  day: z.number(),
  from: z.string(),
  to: z.string(),
});
export type DateObject = z.infer<typeof dateObjectSchema>;

// Expense
export const expenseSchema = z.object({
  name: z.string().min(1, "Expense name is empty"),
  _id: z.string().optional(),
  event: z.string().optional(),
  eventId: z.string().optional(),
  type: expenseTypeSchema,
  cost: z.number().min(0, "Cost must be a positive amount"),
  numUnits: z.number().min(1, "Minimum 1 unit is needed"),
});
export type Expense = z.infer<typeof expenseSchema>;

// Expense List
export const expenseListSchema = z.object({
  title: z.string(),
  expenses: z.array(expenseSchema),
});
export type ExpenseList = z.infer<typeof expenseListSchema>;

// Chapter
export const chapterSchema = z.object({
  name: z.string(),
  totalCost: z.number(),
  fundExpected: z.number(),
  fundActual: z.number(),
  id: z.string(),
});
export type Chapter = z.infer<typeof chapterSchema>;

// Retreat
export const retreatSchema = z.object({
  chapterId: z.string(),
  year: z.number(),
});
export type Retreat = z.infer<typeof retreatSchema>;

// Energy Level
export const energyLevelSchema = z.enum(["low", "medium", "high"]);
export const statusSchema = z.enum(["planning", "pending", "confirmed"]);
export type EnergyLevel = z.infer<typeof energyLevelSchema>;

export const eventSchema = z
  .object({
    name: z.string().min(1, "Event name is empty"),
    location: z.string().optional(),
    status: statusSchema.optional(),
    energyLevel: energyLevelSchema.optional(),
    dates: z.array(dateObjectSchema),
    expenses: z.array(expenseSchema),
    notes: z.string().optional(),
  })
  .refine((data) => data.dates.length > 0, {
    message: "Event must have at least one date.",
  });
export type Event = z.infer<typeof eventSchema>;

export const fundraiserSchema = z.object({
  name: z.string().min(1, "Fundraiser name is empty"),
  location: z.string().min(1, "Location name is empty"),
  date: z.string().datetime(),
  contactName: z.string().min(1, "Contact name is empty"),
  email: z.string().email(),
  profit: z
    .number({
      required_error: "Profit is required",
      invalid_type_error: "Profit must be a number",
    })
    .nonnegative(),
  expenses: z.array(expenseSchema),
});

export type Fundraiser = z.infer<typeof fundraiserSchema>;

export const eventsByYearSchema = z.record(z.number(), z.array(eventSchema));
export type EventsByYear = z.infer<typeof eventsByYearSchema>;

// Fund
/*
export const fundDateSchema = z.object({
  month: z.number(),
  date: z.number(),
  year: z.number(),
});
*/
export const fundSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  date: z.string(),
  amount: z.number(),
  source: z.string(),
});
export type Fund = z.infer<typeof fundSchema>;

// Fund List
export const fundListSchema = z.object({
  title: z.string(),
  funds: z.array(fundSchema),
});
export type FundList = z.infer<typeof fundListSchema>;
