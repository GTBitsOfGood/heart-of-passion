import { z } from "zod";

// Role
export const roleSchema = z.enum(["student", "mentor", "admin"]);
export type Role = z.infer<typeof roleSchema>;

// User
export const userSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    role: roleSchema,
    chapter: z.string().optional(),
  })
  .refine((data) => {
    if (data.role === "student") {
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

// Chapter
export const chapterSchema = z.object({
  name: z.string(),
  totalCost: z.number(),
  fundExpected: z.number(),
  fundActual: z.number(),
});
export type Chapter = z.infer<typeof chapterSchema>;
