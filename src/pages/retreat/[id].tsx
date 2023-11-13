import { Box, Flex, Text } from "@chakra-ui/react";
import CalendarCard from "src/components/Calendar/CalendarCard";

import "@fontsource/oswald/700.css";
import { useRouter } from "next/router";
import { trpc } from "~/utils/api";
import Sidebar from "~/components/Sidebar";
import { DateObject } from "~/common/types";
import { Event } from "~/common/types";
import { useState } from "react";
import { computeHeight } from "~/components/Calendar/helper";

function Content({
  eventsByDay,
  counter,
}: {
  eventsByDay: any;
  counter: number;
}) {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flex={2}
      width={"max-content"}
      paddingTop={"20px"}
      paddingBottom={"50px"}
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
                <Box marginRight={"34px"} minW={"180px"}>
                  {eventsByDay[num]!.map(
                    (einfo: any, index: number, array: any[]) => {
                      if (counter > 0) {
                        counter--;
                        return <></>;
                      }
                      const { event: currEvent, from, to } = einfo;
                      const dateObject: DateObject = {
                        day: 0,
                        from,
                        to,
                      };

                      const totalExpense = currEvent.expenses.reduce(
                        (acc: any, cv: any) => acc + cv.cost,
                        0,
                      );

                      const event: Event = {
                        ...currEvent,
                        dates: [dateObject],
                      };
                      if (index < array.length - 1) {
                        const nextEventsArray = [];
                        var {
                          event: afterEvent,
                          from: nextFrom,
                          to: nextTo,
                        } = eventsByDay[num][index + 1];
                        // Check if the next event's "from" time is between the current event's from and to
                        // appends every additional case where next event's time is between original "from" and "to"
                        while (
                          index < array.length - 1 &&
                          nextFrom &&
                          nextFrom >= from &&
                          nextFrom <= to
                        ) {
                          const nextDateObject: DateObject = {
                            day: 0,
                            from: nextFrom,
                            to: nextTo,
                          };

                          const nextTotalExpense = currEvent.expenses.reduce(
                            (acc: any, cv: any) => acc + cv.cost,
                            0,
                          );

                          const nextEventObject: Event = {
                            ...afterEvent,
                            dates: [nextDateObject],
                          };

                          var topY = computeHeight(
                            nextFrom,
                            from,
                            screen.height,
                          );
                          if (nextEventsArray.length > 0) {
                            const prevTotalTopY = nextEventsArray.reduce(
                              (acc, nt) =>
                                acc -
                                nt.topY +
                                computeHeight(
                                  nt.nextDateObject.from,
                                  nt.nextDateObject.to,
                                  screen.height,
                                ),
                              0,
                            );
                            topY += prevTotalTopY;
                          }
                          nextEventsArray.push({
                            nextDateObject,
                            nextTotalExpense,
                            nextEventObject,
                            topY,
                          });
                          index++;
                          counter++;
                          if (index + 1 === array.length) {
                            break;
                          }
                          var {
                            event: afterEvent,
                            from: nextFrom,
                            to: nextTo,
                          } = eventsByDay[num][index + 1];
                        }
                        return (
                          <Box display={"flex"} key={index}>
                            {nextEventsArray.length === 0 ? (
                              <CalendarCard
                                expenseTotal={totalExpense}
                                date={dateObject}
                                event={event}
                                width={207}
                              />
                            ) : (
                              <>
                                <CalendarCard
                                  expenseTotal={totalExpense}
                                  date={dateObject}
                                  event={event}
                                  width={103}
                                />
                                <Box>
                                  {nextEventsArray.map(
                                    (nextEvent: any, index) => {
                                      console.log(nextEvent);
                                      return (
                                        <CalendarCard
                                          key={index}
                                          expenseTotal={
                                            nextEvent.nextTotalExpense
                                          }
                                          date={nextEvent.nextDateObject}
                                          event={nextEvent.nextEventObject}
                                          width={103}
                                          topY={-nextEvent.topY}
                                        />
                                      );
                                    },
                                  )}
                                </Box>
                              </>
                            )}
                          </Box>
                        );
                      }

                      return (
                        <CalendarCard
                          key={index}
                          expenseTotal={totalExpense}
                          date={dateObject}
                          event={event}
                          width={207}
                        />
                      );
                    },
                  )}
                </Box>
                {num !== 4 && (
                  <Box
                    width={"1px"}
                    background={"#989898"}
                    minHeight={"80vh"}
                  />
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

  const chapter = trpc.chapter.getChapterByRetreatId.useQuery(id!, {
    enabled: !!id,
  })?.data;
  const retreat = trpc.retreat.getRetreatById.useQuery(id!, {
    enabled: !!id,
  })?.data;

  const eventsByDay = trpc.event.getEventsByDay.useQuery(id!, {
    enabled: !!id,
  }).data;

  const counter = 0; // used to check if next element was within the "from" and "to" time range, if it is then preents duplicate entries
  return (
    // <>
    // <Flex direction="row">
    //   {chapter && retreat && <Sidebar chapter={chapter} year={retreat.year} />}
    //   <Box pl="400px" w="full">
    //   {events && <Content events={events} />}
    //   </Box>
    // </Flex>

    // </>

    <Box>
      <Box display="flex">
        <Box zIndex={1000}>
          {chapter && retreat && (
            <Sidebar
              chapter={chapter}
              year={retreat.year}
              retreatId={retreat._id}
            />
          )}
        </Box>
        <Box position="relative" left="436px" overflowX={"visible"}>
          {eventsByDay && (
            <Content eventsByDay={eventsByDay} counter={counter} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
