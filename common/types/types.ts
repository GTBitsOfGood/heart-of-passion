export type User = {
  name: string;
  email: string;
  role: string;
  chapter: string;
};

export type UList = {
  title: string;
  users: User[];
};

export type Chapter = {
  name: string;
};
