import { z } from "zod";

// Role
export const roleSchema = z.enum(["student", "mentor", "admin"]);
export type Role = z.infer<typeof roleSchema>;

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
export const typeSchema = z.enum([
  "Entertainment",
  "Food",
  "Transportation",
  "Hotel",
  "Decorations",
  "Miscellaneous",
]);
export type Type = z.infer<typeof typeSchema>;

// Expense
export const expenseSchema = z.object({
  name: z.string(),
  event: z.string().optional(),
  dates: z.array(z.string()),
  type: typeSchema,
  cost: z.number(),
  numUnits: z.number().optional(),
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
export type EnergyLevel = z.infer<typeof energyLevelSchema>;

// Category
export const categorySchema = z.enum(["entertainment", "educational", "other"]);
export type Category = z.infer<typeof categorySchema>;

export const expenseTypeSchema = z.enum([
  "entertainment",
  "transportation",
  "other",
]);
export type ExpenseType = z.infer<typeof expenseTypeSchema>;

export const costTypeSchema = z.enum(["per unit", "flat cost"]);
export type CostType = z.infer<typeof costTypeSchema>;

export const dateObjectSchema = z.object({
  day: z.number(),
  from: z.string(),
  to: z.string(),
});
export type DateObject = z.infer<typeof dateObjectSchema>;

export const expenseObjectSchema = z.object({
  name: z.string(),
  type: expenseTypeSchema,
  costType: costTypeSchema,
  cost: z.number().positive().int(),
  numberOfUnits: z.number().optional(),
  notes: z.string().optional(),
});
export type ExpenseObject = z.infer<typeof expenseObjectSchema>;

export const eventSchema = z.object({
  name: z.string(),
  location: z.string().optional(),
  energyLevel: energyLevelSchema.optional(),
  category: categorySchema.optional(),
  dates: z.array(dateObjectSchema),
  expenses: z.array(expenseObjectSchema),
});
export type Event = z.infer<typeof eventSchema>;
