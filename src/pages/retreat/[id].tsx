import { useRouter } from "next/router";
import { Box, Flex, Text } from "@chakra-ui/react";
// import Card from "./card";
import CalendarCard from "src/components/Calendar/CalendarCard";
import "@fontsource/oswald/700.css";
import {Category, EnergyLevel, ExpenseType, CostType, Event} from  "~/common/types/types";

const sampleData: Event[] = [
  {
    name: "Event 1",
    location: "Location A",
    energyLevel: EnergyLevel.Low,
    category: Category.Entertainment,
    dates: [
      { day: 1, from: "10:00 AM", to: "04:00 PM" },
      { day: 2, from: "11:00 AM", to: "03:00 PM" }
    ],
    expenses: [
      {
        name: "123",
        type: ExpenseType.Entertainment,
        costType: CostType.FlatCost,
        numberOfUnits: 2,
        notes: "Early bird discount"
      },
      {
        name: "123",
        type: ExpenseType.Transportation,
        costType: CostType.PerUnit,
        numberOfUnits: 3
      }
    ]
  },

  {
    name: "Event 2",
    location: "Location B",
    energyLevel: EnergyLevel.Medium,
    dates: [
      { day: 3, from: "09:00 AM", to: "12:00 AM" },
    ],
    expenses: [
      {
        name: "123",
        type: ExpenseType.Transportation,
        costType: CostType.FlatCost,
        numberOfUnits: 1,
        notes: "Student discount"
      },
    ]
  },

  {
    name: "Event 3",
    location: "Location B",
    energyLevel: EnergyLevel.High,
    category: Category.Other,
    dates: [
      { day: 1, from: "08:00 AM", to: "06:00 PM" },
      { day: 3, from: "09:00 AM", to: "05:00 PM" },
      { day: 4, from: "09:00 AM", to: "05:00 PM" }
    ],
    expenses: [
      {
        name: "123",
        type: ExpenseType.Other,
        costType: CostType.FlatCost,
        numberOfUnits: 2
      },{
        name: "123",
        type: ExpenseType.Other,
        costType: CostType.FlatCost,
        numberOfUnits: 2
      },
      {
        name: "123",
        type: ExpenseType.Transportation,
        costType: CostType.PerUnit,
        numberOfUnits: 4
      }
    ]
  },
];
export default function Calendar() {
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
                  {sampleData.map(event => {
                    return event.dates.map((date, index) => {
                      if (date.day === num) {
                        return <CalendarCard date={date} event={event} expenses={event.expenses[index]}/>
                      }
                    })
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
