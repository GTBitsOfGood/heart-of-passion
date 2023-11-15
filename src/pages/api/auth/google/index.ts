import { googleAuth } from "~/server/auth";
import { serializeCookie } from "lucia/utils";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).end();
  }

  const [url, state] = await googleAuth.getAuthorizationUrl();
  const stateCookie = serializeCookie("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  res
    .status(302)
    .setHeader("Set-Cookie", stateCookie)
    .setHeader("Location", url.toString())
    .end();
};

export default handler;
