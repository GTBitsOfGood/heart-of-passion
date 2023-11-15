import { UserSchema, lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { mongoose } from "@lucia-auth/adapter-mongoose";
import { google } from "@lucia-auth/oauth/providers";
import { UserModel } from "./models/User";
import { UserKeyModel } from "./models/UserKey";

// Polyfill for Node.js < 20
import "lucia/polyfill/node";
import dbConnect from "./db";
import { SessionModel } from "./models/Session";

export const auth = lucia({
  env: process.env.NODE_ENV == "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  adapter: mongoose({
    User: UserModel,
    Key: UserKeyModel,
    Session: SessionModel,
  }),

  getUserAttributes: (data) => {
    return {
      _id: data.id,
      ...data,
    };
  },
});

let baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

// We set defaults so that developers don't need to setup oauth in development
export const googleAuth = google(auth, {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  redirectUri: `${baseUrl}/api/auth/google/callback`,
  scope: ["https://www.googleapis.com/auth/userinfo.email"],
});

(async () => {
  await dbConnect();
})();

export type Auth = typeof auth;
