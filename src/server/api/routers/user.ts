import { z } from "zod";

import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { getGlobalCount, incrementGlobalCount } from "~/server/actions/Count";
import { Model } from "~/server/models/User";
export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string(),
        role: z.string(),
        chapter: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = new Model(input);
      await user.save();
      return user as any;
    }),
  deleteUser: publicProcedure.input(z.string()).mutation(async (opts) => {
    try {
      console.log(opts.input);
      const user = await Model.findOneAndDelete({ email: opts.input });
      return {
        success: true,
        message: user,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
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
      try {
        const user = await Model.findOneAndUpdate(
          { email: opts.input.email },
          opts.input.updateData,
        );
        return {
          success: true,
          message: user,
        };
      } catch (e) {
        return {
          success: false,
          message: e,
        };
      }
    }),
  getUser: publicProcedure.input(z.string()).query(async (opts) => {
    try {
      const user = await Model.findOne({ email: opts.input });
      return {
        success: true,
        message: user,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }),
  getUsers: publicProcedure.query(async (opts) => {
    try {
      const users = await Model.find();
      return {
        success: true,
        message: users,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }),
});
