import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { getGlobalCount, incrementGlobalCount } from "~/server/actions/Count";

export const userRouter = createTRPCRouter({
    createUser: publicProcedure
        .input(z.object({
            name: z.string().optional(), email: z.string(),
            role: z.string(), chapter: z.string().optional()
        }))
        .mutation(({ input }) => {
            console.log(`User created`)
            return {
                success: `User created`,
            };
        })
});
