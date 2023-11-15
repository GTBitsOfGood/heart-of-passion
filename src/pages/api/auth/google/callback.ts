import { auth, googleAuth } from "~/server/auth";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { parseCookie } from "lucia/utils";

import type { NextApiRequest, NextApiResponse } from "next";
import { UserModel, IUser } from "~/server/models/User";

async function getUser(email?: string): Promise<IUser | undefined> {
  if (!email) {
    return undefined;
  }

  let user = await UserModel.findOne({ email: email }).exec();

  return user ?? undefined;
}

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
    console.log("HERE 0");
    res.status(400).end();
    return;
  }
  try {
    const { getExistingUser, googleUser, createUser, createKey } =
      await googleAuth.validateCallback(code);

    let user: { userId: string } | null = await getExistingUser();

    if (!user) {
      let iuser = await getUser(googleUser.email);

      if (!iuser) {
        res.status(401).end();
        return;
      }

      user = await createKey(iuser._id);
    }

    await auth.deleteDeadUserSessions(user.userId);
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest({ req, res });
    authRequest.setSession(session);
    res.status(302).setHeader("Location", "/").end();
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
