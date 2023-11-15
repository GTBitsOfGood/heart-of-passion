import { z } from "zod";

import {
  createTRPCRouter,
  mentorProcedure,
  publicProcedure,
  studentProcedure,
} from "~/server/api/trpc";

import { UserModel } from "~/server/models/User";
import { ChapterModel } from "~/server/models/Chapter";
import { Chapter, User, userSchema } from "~/common/types";
import { auth } from "~/server/auth";
import { TRPCError } from "@trpc/server";
export const userRouter = createTRPCRouter({
  createUser: mentorProcedure.input(userSchema).mutation(async ({ input }) => {
    let chapter;
    if (input.chapter) {
      chapter = (await ChapterModel.findOne({
        name: input.chapter,
      }).exec())!;
    }

    let user = await auth.createUser({
      key: null, // To be created when they attempt to log in for the first time
      attributes: {
        name: input.name,
        chapter: chapter?.id,
        role: input.role,
        email: input.email,
      },
    });

    return user;
  }),

  deleteUser: mentorProcedure.input(z.string()).mutation(async (opts) => {
    const user = await UserModel.findOneAndDelete({ email: opts.input }).exec();
    return user;
  }),

  updateUser: mentorProcedure
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
      let chapter;
      if (opts.input.updateData.chapter) {
        chapter = (await ChapterModel.findOne({
          name: opts.input.updateData.chapter,
        }).exec())!;
      }
      opts.input.updateData.chapter = chapter ? chapter.id : null;
      const user = await UserModel.findOneAndUpdate(
        { email: opts.input.email },
        opts.input.updateData,
      ).exec();

      return user;
    }),
  getUser: studentProcedure
    .input(z.string())
    .query(async (opts): Promise<User> => {
      const user = await UserModel.findOne({ email: opts.input })
        .populate<{ chapter: Chapter }>("chapter")
        .exec();
      return processUser(user);
    }),
  getUsers: studentProcedure.query(async (opts): Promise<User[]> => {
    const users = await UserModel.find()
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
    chapter: user.chapter ? user.chapter.name : null,
  };
}
