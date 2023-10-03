import { DateObject } from "~/common/types";
import { Select, Input } from "@chakra-ui/react";

type PropT = {
  date: DateObject;
};

export default function TimesEditor({ date }: PropT) {
  return (
    <>
      Day
      <Select>
        <option value="day1">Day 1</option>
        <option value="day2">Day 2</option>
        <option value="day3">Day 3</option>
        <option value="day4">Day 4</option>
      </Select>
      Start
      <Input />
      End
      <Input />
    </>
  );
}
