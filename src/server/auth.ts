import { UserSchema, lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { mongoose } from "@lucia-auth/adapter-mongoose";
import { google } from "@lucia-auth/oauth/providers";
import { UserModel } from "./models/User";
import { UserKeyModel } from "./models/UserKey";

// Polyfill for Node.js < 20
import "lucia/polyfill/node";
import dbConnect from "./db";

export const auth = lucia({
  env: process.env.NODE_ENV == "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  adapter: mongoose({
    User: UserModel,
    Key: UserKeyModel,
    Session: null,
  }),

  getUserAttributes: (data) => {
    return {
      googleEmail: data.email,
    };
  },
});

// We set defaults so that developers don't need to setup oauth in development
export const googleAuth = google(auth, {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  redirectUri:
    process.env.GOOGLE_REDIRECT_URL ??
    "http://localhost:3000/api/auth/google/callback",
  scope: ["https://www.googleapis.com/auth/userinfo.email"],
});

(async () => {
  await dbConnect();
})();

export type Auth = typeof auth;
