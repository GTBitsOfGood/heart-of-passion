type IUser = import("~/server/models/User").IUser;

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./src/server/auth").Auth;

  type DatabaseUserAttributes = Omit<IUser, "_id">;
  type DatabaseSessionAttributes = {};
}
