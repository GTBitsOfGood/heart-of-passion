import { useRouter } from "next/router";
import { Box, Flex, Text } from "@chakra-ui/react";
// import Card from "./card";
import CalendarCard from "src/components/Calendar/CalendarCard";
import "@fontsource/oswald/700.css";

const sampleData = [
  [
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
  ],

  [
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
  ],

  [
    {
      startTime: "9:30 am",
      endTime: "4:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
  ],

  [
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
    {
      startTime: "9:30 am",
      endTime: "12:00 pm",
      task: "Breakfast",
      address: "123 First Drive",
      price: 345,
      priority: "LOW",
    },
  ],
];
export default function Calendar() {
  const router = useRouter();
  return (
    <Box>
      <Flex justifyContent="center" alignItems="center">
        <Box>{/*Sidebar*/}</Box>
        <Box display={"flex"} gap={"34px"}>
          {sampleData.map((day, index) => {
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
                    {day.map((event) => {
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
