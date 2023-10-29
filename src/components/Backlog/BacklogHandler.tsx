import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import "@fontsource/oswald/700.css";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import BacklogCard from "~/components/Backlog/BacklogCard";
import { IEvent } from "~/server/models/Event";

export default function BacklogHandler({
  label,
  chapterEvents,
  toggleYears,
  setToggleYears,
}: {
  label: string;
  chapterEvents: any;
  toggleYears: any;
  setToggleYears: any;
}) {
  const handleToggle = (year: any) => {
    setToggleYears({ ...toggleYears, [year]: !toggleYears[year] });
  };
  return (
    <Box>
      {Object.keys(chapterEvents).map((year: any) => {
        return (
          <Box
            display={"flex"}
            justifyContent={"center"}
            marginTop={7}
            key={year}
          >
            <Box width={"97%"}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                borderBottom={"1px solid #AEAEAE"}
              >
                <Text fontSize={20} fontWeight={700} fontFamily={"nunito"}>
                  {year}
                </Text>
                <Box display={"flex"} alignItems={"center"}>
                  <TriangleDownIcon
                    cursor={"pointer"}
                    onClick={() => handleToggle(year)}
                    transform={!toggleYears[year] ? "rotate(180deg)" : ""}
                    transition={"transform 150ms ease"}
                  />
                </Box>
              </Box>
              <Box display={"flex"} gap={10} flexWrap={"wrap"} marginTop={7}>
                {label === "View by Date" ? (
                  toggleYears[year] &&
                  chapterEvents[year].map((event: any) => {
                    const totalExpense = event.expenses.reduce(
                      (acc: any, cv: any) => acc + cv.cost,
                      0,
                    );
                    return (
                      <BacklogCard
                        key={event.name}
                        {...event}
                        totalCost={totalExpense}
                      />
                    );
                  })
                ) : label === "Lowest Cost" ? (
                  toggleYears[year] &&
                  chapterEvents[year]
                    .sort((event1: IEvent, event2: IEvent) => {
                      const totalExpense1 = event1.expenses.reduce(
                        (acc: any, cv: any) => acc + cv.cost,
                        0,
                      );
                      const totalExpense2 = event2.expenses.reduce(
                        (acc: any, cv: any) => acc + cv.cost,
                        0,
                      );
                      return totalExpense1 - totalExpense2;
                    })
                    .map((event: any) => {
                      const totalExpense = event.expenses.reduce(
                        (acc: any, cv: any) => acc + cv.cost,
                        0,
                      );
                      return (
                        <BacklogCard
                          key={event.name}
                          {...event}
                          totalCost={totalExpense}
                        />
                      );
                    })
                ) : label === "Highest Cost" ? (
                  toggleYears[year] &&
                  chapterEvents[year]
                    .sort((event1: IEvent, event2: IEvent) => {
                      const totalExpense1 = event1.expenses.reduce(
                        (acc: any, cv: any) => acc + cv.cost,
                        0,
                      );
                      const totalExpense2 = event2.expenses.reduce(
                        (acc: any, cv: any) => acc + cv.cost,
                        0,
                      );
                      return totalExpense2 - totalExpense1;
                    })
                    .map((event: any) => {
                      const totalExpense = event.expenses.reduce(
                        (acc: any, cv: any) => acc + cv.cost,
                        0,
                      );
                      return (
                        <BacklogCard
                          key={event.name}
                          {...event}
                          totalCost={totalExpense}
                        />
                      );
                    })
                ) : (
                  <></>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
