import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Model } from "~/server/models/User";
import { ChapterModel } from "~/server/models/Chapter";
import { User, userSchema } from "~/common/types";
export const userRouter = createTRPCRouter({
  createUser: publicProcedure.input(userSchema).mutation(async ({ input }) => {
    let chapter = (await ChapterModel.findOne({
      name: input.chapter,
    }).exec())!;

    const user = new Model({
      name: input.name,
      chapter: chapter.id,
      email: input.email,
      role: input.role,
    });
    await user.save();
    return user;
  }),
  deleteUser: publicProcedure.input(z.string()).mutation(async (opts) => {
    const user = await Model.findOneAndDelete({ email: opts.input }).exec();
    return user;
  }),
  updateUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        updateData: z.object({
          name: z.string().optional(),
          email: z.string().optional(),
          role: z.string().optional(),
          chapter: z.string().optional(),
        }),
      }),
    )
    .mutation(async (opts) => {
      const user = await Model.findOneAndUpdate(
        { email: opts.input.email },
        opts.input.updateData,
      );

      return user;
    }),
  getUser: publicProcedure.input(z.string()).query(async (opts) => {
    const user = await Model.findOne({ email: opts.input });
    return user;
  }),
  getUsers: publicProcedure.query(async (opts) => {
    const users = await Model.find().populate("chapter");
    return users;
  }),
});
