import {
  Box,
  Flex,
  Text,
  Grid,
  HStack,
  StackDivider,
  GridItem,
} from "@chakra-ui/react";
import CalendarCard from "src/components/Calendar/CalendarCard";
import { Event } from "src/common/types";

import "@fontsource/oswald/700.css";
import { useEffect, useRef, useState } from "react";

const sampleData: Event[] = [
  {
    name: "Breakfast",
    location: "123 First Drive",
    energyLevel: "low",
    category: "other",
    dates: [
      {
        day: 1,
        from: "12:00 am",
        to: "1:00 am",
      },
    ],
    expenses: [
      {
        name: "Expense Name",
        type: "other",
        costType: "flat cost",
        notes: "",
        cost: 121,
      },
    ],
  },
  {
    name: "Lunch",
    location: "456 Second Street",
    energyLevel: "medium",
    category: "entertainment",
    dates: [
      {
        day: 1,
        from: "2:00 am",
        to: "3:00 am", // Longer duration
      },
    ],
    expenses: [
      {
        name: "Lunch Expense",
        type: "entertainment",
        costType: "flat cost",
        notes: "Enjoyed a nice meal.",
        cost: 21,
      },
    ],
  },
  {
    name: "Meeting",
    location: "789 Third Avenue",
    energyLevel: "high",
    category: "educational",
    dates: [
      {
        day: 3,
        from: "2:00 pm",
        to: "5:00 pm", // Longer duration
      },
    ],
    expenses: [
      {
        name: "Meeting Expense",
        type: "transportation",
        costType: "per unit",
        numberOfUnits: 4,
        notes: "Travel expenses.",
        cost: 41,
      },
    ],
  },
  {
    name: "Workshop",
    location: "101 Fourth Street",
    energyLevel: "high",
    category: "educational",
    dates: [
      {
        day: 4,
        from: "4:30 pm",
        to: "7:30 pm", // Longer duration
      },
    ],
    expenses: [
      {
        name: "Workshop Expense",
        type: "entertainment",
        costType: "flat cost",
        notes: "Materials and equipment.",
        cost: 420,
      },
    ],
  },
  {
    name: "Dinner",
    location: "987 Fifth Avenue",
    energyLevel: "medium",
    category: "entertainment",
    dates: [
      {
        day: 1,
        from: "7:00 pm",
        to: "10:00 pm", // Longer duration
      },
      {
        day: 4,
        from: "7:00 pm",
        to: "10:00 pm", // Longer duration
      },
    ],
    expenses: [
      {
        name: "Dinner Expense",
        type: "entertainment",
        costType: "flat cost",
        notes: "Delicious dinner.",
        cost: 4201,
      },
    ],
  },
  // Add more diverse events as needed.
];

// You can continue to add more objects with different durations.

// You can continue to add more objects with diverse "day" values.

interface EventInfo {
  date: {
    day: number;
    to: string;
    from: string;
  };
  expenseTotal: number;
  name: string;
  location?: string;
  event: Event;
  day: number;
  ghost?: boolean;
}

export default function Calendar() {
  let eventInfo: EventInfo[] = [];
  sampleData.forEach((e) => {
    const expenseTotal = e.expenses.reduce(
      (acc, obj) => acc + (obj.numberOfUnits ?? 0),
      0,
    );
    e.dates.forEach((d) => {
      eventInfo.push({
        date: {
          day: d.day,
          to: d.to,
          from: d.from,
        },
        expenseTotal,
        name: e.name,
        location: e.location,
        event: e,
        day: d.day,
      });
    });
  });
  const Ghost = () => <GridItem w="207px" h={0} area="stack" />;
  const CalendarCards = (num: number) =>
    eventInfo.map((einfo) => {
      return einfo.day === num ? (
        <CalendarCard key={einfo.name} {...einfo} />
      ) : (
        ""
      );
    });
  const calendarColRef = useRef<any>();
  const [colHeight, setColHeight] = useState<number>(-1);
  useEffect(() => {
    if (calendarColRef.current) {
      const ht = calendarColRef.current.getBoundingClientRect().height;
      setColHeight(ht);
    }
  }, [calendarColRef]);
  return (
    <Box>
      <Flex justifyContent="center" alignItems="center">
        <Box>{/*Sidebar*/}</Box>
        <Box display={"flex"} gap={"34px"}>
          {[1, 2, 3, 4].map((num) => {
            return (
              <Box key={num}>
                <Text
                  width={"158px"}
                  height={"81px"}
                  fontSize={36}
                  fontWeight={700}
                  textAlign={"center"}
                  fontFamily={"oswald"}
                >
                  Day {num}
                </Text>
                <Box display={"flex"}>
                  <Grid
                    gridTemplateAreas="stack"
                    marginRight={"34px"}
                    ref={calendarColRef}
                    mb="30px"
                  >
                    {CalendarCards(num)}
                    {Ghost()}
                  </Grid>
                  {num !== 4 && (
                    <Box
                      width={"1px"}
                      background={"#989898"}
                      height={colHeight + "px"}
                    />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Flex>
    </Box>
  );
}
