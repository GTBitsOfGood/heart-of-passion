import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { chapterRouter } from "./routers/chapter";
import { retreatRouter } from "./routers/retreat";
import { eventRouter } from "./routers/event";
import { donorRouter } from "./routers/donor";
import { fundraiserRouter } from "./routers/fundraiser";
import { fundRouter } from "./routers/fund";
import { transactionRouter } from "./routers/transaction";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  chapter: chapterRouter,
  retreat: retreatRouter,
  event: eventRouter,
  donor: donorRouter,
  fundraiser: fundraiserRouter,
  fund: fundRouter,
  transaction: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
