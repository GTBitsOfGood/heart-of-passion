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

export type CalendarCard = {
  cost: string;
  timeRange: [Date, Date]
  name: string;
  location: string;
  energyLevel: ["low", "medium", "spicy"]
}
