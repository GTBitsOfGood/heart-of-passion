import { Role } from ".";

export type User = {
  name: string;
  email: string;
  role: string;
  chapter?: string;
};

export type Chapter = {
  name: string;
};

export type Time = {
  day: string;
  start: string;
  end: string;
};

export type Times = {
  [key: string]: Time[];
};

export type Expense = {
  name: string;
  type: string;
  cost: number;
  //1 - per unit
  //2 - flat cost
  costType: string;
  units: number;
  notes: string;
};

export type Retreat = {
  id: string;
  year: number;
  chapterId: string;
};
