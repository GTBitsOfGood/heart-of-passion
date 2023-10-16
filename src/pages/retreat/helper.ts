import { DateObject } from "~/common/types";

export const generateDateObject = (
  date: {
    date: Date;
    from: string;
    to: string;
  },
  num: number,
) => {
  const day1 = new Date();
  day1.setHours(0, 0, 0, 0);
  day1.setDate(new Date().getDate() + num);
  const day2 = new Date(date.date);

  const dayDifference = day1.getDate() - day2.getDate() - 1;

  const dateObject: DateObject = {
    day: dayDifference,
    from: date.from,
    to: date.to,
  };
  return [dayDifference, dateObject];
};
