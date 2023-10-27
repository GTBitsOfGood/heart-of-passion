import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { UserModel } from "~/server/models/User";
import { ChapterModel, IChapter } from "~/server/models/Chapter";
import { Chapter, User, userSchema } from "~/common/types";
import { auth } from "~/server/auth";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure.input(userSchema).mutation(async ({ input }) => {
    let chapter;
    if (input.chapter) {
      chapter = (await ChapterModel.findOne({
        name: input.chapter,
      }).exec())!;
    }


    const user = auth.createUser({
      key: {
        providerId: "google",
        providerUserId: input.email,
        password: null,
      },
      attributes: {
        name: input.name,
        email: input.email,
        role: input.role,
        chapter: chapter?.id,
      },
    });

    return user;
  }),

  deleteUser: publicProcedure.input(z.string()).mutation(async (opts) => {
    const user = await UserModel.findOneAndDelete({ email: opts.input }).exec();
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
      const user = await UserModel.findOneAndUpdate(
        { email: opts.input.email },
        opts.input.updateData,
      ).exec();

      return user;
    }),
  getUser: publicProcedure
    .input(z.string())
    .query(async (opts): Promise<User> => {
      const user = await UserModel.findOne({ email: opts.input })
        .populate<{ chapter: Chapter }>("chapter")
        .exec();
      return processUser(user);
    }),
  getUsers: publicProcedure.query(async (opts): Promise<User[]> => {
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
