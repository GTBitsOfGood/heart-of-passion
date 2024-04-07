import "dotenv/config";
import mongoose from "mongoose";

import readline from "readline";
import { roleSchema, Role } from "~/common/types";
import { auth } from "~/server/auth";

async function getUserOptions(): Promise<{
  name: string;
  email: string;
  role: Role;
}> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const name = await new Promise<string>((resolve) => {
    rl.question("Enter name: ", (answer) => {
      resolve(answer);
    });
  });

  const email = await new Promise<string>((resolve) => {
    rl.question("Enter email: ", (answer) => {
      resolve(answer);
    });
  });

  const role = await new Promise<string>((resolve) => {
    rl.question("Enter role: ", (answer) => {
      resolve(answer);
    });
  });

  rl.close();

  if (!roleSchema.parse(role)) {
    throw new Error("Invalid role");
  }

  return { name, email, role: role as Role };
}

(async () => {
  const { name, email, role } = await getUserOptions();
  let user = await auth.createUser({
    key: null, // To be created when they attempt to log in for the first time
    attributes: {
      name,
      role,
      email,
    },
  });
  mongoose.connection.close();
})();
