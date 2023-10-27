import { auth, googleAuth } from "~/server/auth";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { parseCookie } from "lucia/utils";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  const cookies = parseCookie(req.headers.cookie ?? "");
  const storedState = cookies.google_oauth_state;
  const state = req.query.state;
  const code = req.query.code;
  // validate state
  if (
    !storedState ||
    !state ||
    storedState !== state ||
    typeof code !== "string"
  ) {
    console.log("HERE");
    res.status(400).end();
    return;
  }
  try {
    const { getExistingUser, googleUser, createUser } =
      await googleAuth.validateCallback(code);

    console.log("HERE");

    const user = await getExistingUser();
    if (!user) {
      res.status(401).end();
      return;
    }
    console.log("HERE2");

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    console.log("HERE3");

    const authRequest = auth.handleRequest({ req, res });
    authRequest.setSession(session);
    res.status(302).setHeader("Location", "/").end(); // redirect to profile page
    console.log("HERE4");
    return;
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      res.status(400).end();
    } else {
      res.status(500).end();
      throw e;
    }
  }
};

export default handler;
