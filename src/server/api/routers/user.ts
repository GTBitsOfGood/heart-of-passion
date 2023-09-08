import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { getGlobalCount, incrementGlobalCount } from "~/server/actions/Count";
import dbConnect from "~/server/db";
import { Model } from '~/server/models/User'
export const userRouter = createTRPCRouter({
    createUser: publicProcedure
        .input(z.object({
            name: z.string().optional(), email: z.string(),
            role: z.string(), chapter: z.string().optional()
        }))
        .mutation(async ({ input }) => {
            await dbConnect();
            const user = new Model(input)
            await user.save();
            return {
                success: `User created`,
            };
        })
});
