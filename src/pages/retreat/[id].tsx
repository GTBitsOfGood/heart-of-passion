import { Box, Flex, Text } from "@chakra-ui/react";
import CalendarCard from "src/components/Calendar/CalendarCard";

import "@fontsource/oswald/700.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "~/utils/api";
import { DateObject } from "~/common/types";
import Sidebar from "~/components/Sidebar";

// const sampleData: Event[] = [
//   {
//     name: "Breakfast",
//     location: "123 First Drive",
//     energyLevel: "low",
//     category: "other",
//     dates: [
//       {
//         day: 1,
//         from: "9:30 am",
//         to: "12:30 pm",
//       },
//     ],
//     expenses: [
//       {
//         name: "Expense Name",
//         type: "other",
//         costType: "flat cost",
//         notes: "",
//         cost: 70,
//       },
//     ],
//   },
//   {
//     name: "Lunch",
//     location: "456 Second Street",
//     energyLevel: "medium",
//     category: "entertainment",
//     dates: [
//       {
//         day: 2,
//         from: "12:30 pm",
//         to: "1:20 pm", // Longer duration
//       },
//     ],
//     expenses: [
//       {
//         name: "Lunch Expense",
//         type: "entertainment",
//         costType: "flat cost",
//         notes: "Enjoyed a nice meal.",
//         cost: 70,
//       },
//     ],
//   },
//   {
//     name: "Meeting",
//     location: "789 Third Avenue",
//     energyLevel: "high",
//     category: "educational",
//     dates: [
//       {
//         day: 3,
//         from: "2:00 pm",
//         to: "5:00 pm", // Longer duration
//       },
//     ],
//     expenses: [
//       {
//         name: "Meeting Expense",
//         type: "transportation",
//         costType: "per unit",
//         numberOfUnits: 4,
//         notes: "Travel expenses.",
//         cost: 70,
//       },
//     ],
//   },
//   {
//     name: "Workshop",
//     location: "101 Fourth Street",
//     energyLevel: "high",
//     category: "educational",
//     dates: [
//       {
//         day: 4,
//         from: "4:30 pm",
//         to: "7:30 pm", // Longer duration
//       },
//     ],
//     expenses: [
//       {
//         name: "Workshop Expense",
//         type: "entertainment",
//         costType: "flat cost",
//         notes: "Materials and equipment.",
//         cost: 70,
//       },
//     ],
//   },
//   {
//     name: "Dinner",
//     location: "987 Fifth Avenue",
//     energyLevel: "medium",
//     category: "entertainment",
//     dates: [
//       {
//         day: 1,
//         from: "7:00 pm",
//         to: "10:00 pm", // Longer duration
//       },
//       {
//         day: 4,
//         from: "7:00 pm",
//         to: "10:00 pm", // Longer duration
//       },
//     ],
//     expenses: [
//       {
//         name: "Dinner Expense",
//         type: "entertainment",
//         costType: "flat cost",
//         notes: "Delicious dinner.",
//         cost: 70,
//       },
//     ],
//   },
//   // Add more diverse events as needed.
// ];

// You can continue to add more objects with different durations.

// You can continue to add more objects with diverse "day" values.

// interface EventInfo {
//   date: {
//     day: number;
//     to: string;
//     from: string;
//   };
//   expenseTotal: number;
//   name: string;
//   location?: string;
//   event: Event;
//   day: number;
// }

export default function Calendar() {
  const [event, setEvent]: any[] = useState([]);

  const router = useRouter();
  const { id }: { id?: string } = router.query;

  const { data: currEventData } = trpc.event.getEvents.useQuery(id!, {
    enabled: !!id,
  });

  useEffect(() => {
    setEvent(currEventData);
  }, [currEventData]);

  return (
    <Box>
      {event && (
        <Flex justifyContent="center" alignItems="center">
          <Box></Box>
          <Box display={"flex"} gap={"34px"}>
            {[1, 2, 3, 4].map((num, index) => {
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
                    Day {num}
                  </Text>
                  <Box display={"flex"}>
                    <Box marginRight={"34px"}>
                      {event.map((einfo: any) => {
                        return einfo.dates.map((date: any) => {
                          const day1 = new Date();
                          day1.setHours(0, 0, 0, 0);
                          day1.setDate(new Date().getDate() + num);
                          const day2 = new Date(date.date);

                          const dayDifference =
                            day1.getDate() - day2.getDate() - 1;

                          const dateObject: DateObject = {
                            day: dayDifference,
                            from: date.from,
                            to: date.to,
                          };

                          const totalExpense = einfo.expenses.reduce(
                            (acc: any, cv: any) => acc + cv.cost,
                            0,
                          );

                          return (
                            dayDifference === 0 && (
                              <CalendarCard
                                key={einfo.name}
                                expenseTotal={totalExpense}
                                date={dateObject}
                                event={einfo}
                              />
                            )
                          );
                        });
                      })}
                    </Box>
                    {num !== 4 && (
                      <Box
                        width={"1px"}
                        background={"#989898"}
                        height={"788px"}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Flex>
      )}
    </Box>
  );
}
