import { useRouter } from "next/router";
import { Box, Flex, Text } from "@chakra-ui/react";
// import Card from "./card";
import CalendarCard from "src/components/Calendar/CalendarCard";
import "@fontsource/oswald/700.css";
import { Event as EventT, EnergyLevel, Category, ExpenseType, CostType } from "src/common/types/types"
import { useRef } from "react";

const sampleData: EventT[] = [
  {
    name: "Breakfast",
    location: "123 First Drive",
    energyLevel: EnergyLevel.Low,
    category: Category.Other,
    dates: [
      {
        day: 1,
        from: "9:30 am",
        to: "10:00 am",
      },
    ],
    expenses: [
      {
        name: "Expense Name",
        type: ExpenseType.Other,
        costType: CostType.FlatCost,
        notes: "",
      },
    ],
    startTime: "9:30 am",
    endTime: "10:00 am",
  },
  {
    name: "Lunch",
    location: "456 Second Street",
    energyLevel: EnergyLevel.Medium,
    category: Category.Entertainment,
    dates: [
      {
        day: 2,
        from: "12:30 pm",
        to: "1:15 pm",
      },
    ],
    expenses: [
      {
        name: "Lunch Expense",
        type: ExpenseType.Entertainment,
        costType: CostType.FlatCost,
        notes: "Enjoyed a nice meal.",
      },
    ],
    startTime: "12:30 pm",
    endTime: "1:15 pm",
  },
  {
    name: "Meeting",
    location: "789 Third Avenue",
    energyLevel: EnergyLevel.High,
    category: Category.Educational,
    dates: [
      {
        day: 3,
        from: "2:00 pm",
        to: "3:00 pm",
      },
    ],
    expenses: [
      {
        name: "Meeting Expense",
        type: ExpenseType.Transportation,
        costType: CostType.PerUnit,
        numberOfUnits: 4,
        notes: "Travel expenses.",
      },
    ],
    startTime: "2:00 pm",
    endTime: "3:00 pm",
  },
  {
    name: "Workshop",
    location: "101 Fourth Street",
    energyLevel: EnergyLevel.Medium,
    category: Category.Educational,
    dates: [
      {
        day: 4,
        from: "4:30 pm",
        to: "6:30 pm",
      },
    ],
    expenses: [
      {
        name: "Workshop Expense",
        type: ExpenseType.Entertainment,
        costType: CostType.FlatCost,
        notes: "Materials and equipment.",
      },
    ],
    startTime: "4:30 pm",
    endTime: "6:30 pm",
  },
  {
    name: "Dinner",
    location: "987 Fifth Avenue",
    energyLevel: EnergyLevel.Medium,
    category: Category.Entertainment,
    dates: [
      {
        day: 1,
        from: "7:00 pm",
        to: "8:00 pm",
      },
      {
        day: 4,
        from: "7:00 pm",
        to: "8:00 pm",
      },
    ],
    expenses: [
      {
        name: "Dinner Expense",
        type: ExpenseType.Entertainment,
        costType: CostType.FlatCost,
        notes: "Delicious dinner.",
      },
    ],
    startTime: "7:00 pm",
    endTime: "8:00 pm",
  },
  // Add more diverse events as needed.
];

// You can continue to add more objects with diverse "day" values.


export default function Calendar() {
  const router = useRouter();
  const dayGrouped = Array(4).fill([])
  sampleData.forEach(e => {
    e.dates.forEach(d => {
      console.log(dayGrouped)
      if (dayGrouped[d.day]) {
        dayGrouped[d.day].push({
          to: d.to,
          from: d.from,
          name: e.name,
          location: e.location,
          eventObject: e,
          energyLevel: e.energyLevel
        })
      }
    })
  })
  return (
    <Box>
      <Flex justifyContent="center" alignItems="center">
        <Box>{/*Sidebar*/}</Box>
        <Box display={"flex"} gap={"34px"}>
          {dayGrouped.map((day, index) => {
            return (
              <Box key={index}>
                <Text
                  width={"158px"}
                  height={"81px"}
                  fontSize={36}
                  fontWeight={700}
                  textAlign={"center"}
                  fontFamily={"oswald"}
                >
                  Day {index + 1}
                </Text>
                <Box display={"flex"}>
                  <Box marginRight={"34px"}>
                    {day.map((event: any) => {
                      return <CalendarCard event={event} key={index} />;
                    })}
                  </Box>
                  <Box width={"1px"} background={"#989898"} height={"788px"} />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Flex>
    </Box>
  );
}
