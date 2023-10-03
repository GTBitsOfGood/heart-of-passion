import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { IUser, Model } from "~/server/models/User";
import { ChapterModel } from "~/server/models/Chapter";
import { Chapter, User, userSchema } from "~/common/types";
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
      ).exec();

      return user;
    }),
  getUser: publicProcedure
    .input(z.string())
    .query(async (opts): Promise<User> => {
      const user = await Model.findOne({ email: opts.input })
        .populate<{ chapter: Chapter }>("chapter")
        .exec();
      return processUser(user);
    }),
  getUsers: publicProcedure.query(async (opts): Promise<User[]> => {
    const users = await Model.find()
      .populate<{ chapter: Chapter }>("chapter")
      .exec();

    return users.map(processUser);
  }),
});

function processUser(user: any): User {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    chapter: user.chapter.name,
  };
}
