import { Box, Flex, Text } from "@chakra-ui/react";
import CalendarCard from "src/components/Calendar/CalendarCard";

import "@fontsource/oswald/700.css";
import { useRouter } from "next/router";
import { RefObject, useRef, useState } from "react";
import { trpc } from "~/utils/api";
import Sidebar from "~/components/Sidebar";
import { DateObject } from "~/common/types";
import { IEvent } from "~/server/models/Event";
import { Event } from "~/common/types";

function Content({ events }: { events: IEvent[] }) {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flex={2}
      width={"max-content"}
    >
      <Box display={"flex"} gap={"14px"}>
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
                  {events.map((einfo) => {
                    return einfo.dates.map((date) => {
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

                      const totalExpense = einfo.expenses.reduce(
                        (acc: any, cv: any) => acc + cv.cost,
                        0,
                      );

                      const event: Event = {
                        ...einfo,
                        dates: [dateObject],
                      };

                      return (
                        dayDifference === 0 && (
                          <CalendarCard
                            key={einfo.name}
                            expenseTotal={totalExpense}
                            date={dateObject}
                            event={event}
                          />
                        )
                      );
                    });
                  })}
                </Box>
                {num !== 4 && (
                  <Box width={"1px"} background={"#989898"} height={"788px"} />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Flex>
  );
}

export default function Calendar() {
  const router = useRouter();
  const { id }: { id?: string } = router.query;

  const events = trpc.event.getEvents.useQuery(id!, {
    enabled: !!id,
  }).data;
  const chapter = trpc.chapter.getChapterByRetreatId.useQuery(id!, {
    enabled: !!id,
  })?.data;
  const retreat = trpc.retreat.getRetreatById.useQuery(id!, {
    enabled: !!id,
  })?.data;

  return (
    <Box>
      <Box display="flex">
        <Box zIndex={1000}>
          {chapter && retreat && (
            <Sidebar chapter={chapter} year={retreat.year} />
          )}
        </Box>
        <Box position="relative" left="436px" overflowX={"visible"}>
          {events && <Content events={events} />}
        </Box>
      </Box>
    </Box>
  );
}
