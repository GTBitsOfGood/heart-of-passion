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
        to: "12:30 pm",
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
        to: "1:20 pm", // Longer duration
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
        to: "5:00 pm", // Longer duration
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
        to: "7:30 pm", // Longer duration
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
        type: ExpenseType.Entertainment,
        costType: CostType.FlatCost,
        notes: "Delicious dinner.",
      },
    ],
  },
  // Add more diverse events as needed.
];

// You can continue to add more objects with different durations.


// You can continue to add more objects with diverse "day" values.


export default function Calendar() {
  const router = useRouter();
  const eventInfo: any[] = []
  sampleData.forEach(e => {
    const expenseTotal = e.expenses.reduce((acc, obj) => acc + (obj.numberOfUnits ?? 0), 0)
    e.dates.forEach(d => {
      eventInfo.push({
        date: {
          to: d.to,
          from: d.from,
        },
        expenseTotal,
        name: e.name,
        location: e.location,
        event: e,
        day: d.day,
      })
    })
  })
  return (
    <Box>
      <Flex justifyContent="center" alignItems="center">
        <Box>{/*Sidebar*/}</Box>
        <Box display={"flex"} gap={"34px"}>
          {[1,2,3,4].map(num => {
            return <Box>
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
                <Box marginRight={"34px"}>
                  {eventInfo.map(einfo => {
                    return einfo.day === num ? <CalendarCard {...einfo}/> : ""
                  })}
                </Box>
                {num !== 4 && <Box width={"1px"} background={"#989898"} height={"788px"} />}
              </Box>
          </Box>
          })}
        </Box>
      </Flex>
    </Box>
  );
}
