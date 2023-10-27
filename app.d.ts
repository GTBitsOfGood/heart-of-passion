/// <reference types="lucia" />
type IUser = import("~/server/models/User").IUser;

declare namespace Lucia {
  type Auth = import("./lucia.js").Auth;

  type DatabaseUserAttributes = Omit<IUser, "_id">;
  //   type DatabaseSessionAttributes = {};
}
