export type User = {
  name: string;
  email: string;
  role: string;
  chapter: string;
};

export type UserList = {
  title: string;
  users: User[];
};
