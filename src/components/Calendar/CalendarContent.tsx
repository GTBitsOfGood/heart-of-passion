import {
  Box,
  Button,
  Flex,
  HStack,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CalendarCard from "src/components/Calendar/CalendarCard";

import "@fontsource/oswald/700.css";
import { useRouter } from "next/router";
import { trpc } from "~/utils/api";
import Sidebar from "~/components/Sidebar";
import { DateObject } from "~/common/types";
import { Event } from "~/common/types";
import { useState } from "react";
import { computeHeight } from "~/components/Calendar/computeHeight";
import { IEvent } from "~/server/models/Event";
import { NewEventModal } from "~/components/NewEventModal";

type EventWithStamp = {
  event: IEvent;
  from: string;
  to: string;
  day: number;
};

export default function CalendarContent({
  events,
  counter,
  retreatId,
  zoom,
}: {
  events: IEvent[];
  counter: number;
  retreatId: string;
  zoom: number;
}) {
  const StrToMinutes = (timeStr: string): number => {
    const parts = timeStr.match(/(\d+):(\d+) (\w+)/);
    // if (!parts) {
    //   throw new Error('Invalid time format');
    // }
    // Extract hours, minutes, and the period (AM/PM)
    let [_, hours, minutes, period] = parts!;
    // Get hours in 24hr format
    const hoursNumber =
      ((parseInt(hours!) % 12) + (period!.toLowerCase() === "pm" ? 12 : 0)) %
      24;
    const minutesNumber = parseInt(minutes!);
    // Calculate total minutes
    return hoursNumber * 60 + minutesNumber;
  };
  const DayComparator = (a: EventWithStamp, b: EventWithStamp): number => {
    const afrom = StrToMinutes(a.from);
    const bfrom = StrToMinutes(b.from);
    if (afrom == bfrom) {
      const ato = StrToMinutes(a.to);
      const bto = StrToMinutes(b.to);
      return bto - ato; // descending 'to's otherwise
    }
    return afrom - bfrom; // ascending 'from's first
  };
  let eventsByDay: EventWithStamp[][] = [[], [], [], []];

  for (const event of events) {
    const { dates } = event;
    for (const date of dates) {
      const { from, to, day } = date;
      eventsByDay[day - 1]!.push({ event, from, to, day });
      console.log(from);
    }
  }
  console.log(eventsByDay);
  for (const dayEvents of eventsByDay) {
    dayEvents.sort(DayComparator);
  }

  function MapEventsForDay(day: number) {
    return function bruhEvent(
      einfo: EventWithStamp,
      index: number,
      arr: EventWithStamp[],
    ) {
      if (counter > 0) {
        counter--;
        return <></>;
      }
      const {
        event: currEvent,
        from: currFrom,
        to: currTo,
        day: currDay,
      } = einfo;
      const dateObject: DateObject = {
        day,
        from: currFrom,
        to: currTo,
      };

      const totalExpense = currEvent.expenses.reduce(
        (acc: any, cv: any) => acc + cv.cost,
        0,
      );

      const event: EventWithStamp = {
        event: currEvent,
        from: currFrom,
        to: currTo,
        day: currDay,
      };
      if (index < arr.length - 1) {
        const nextEventsArray = [];
        var {
          event: afterEvent,
          from: nextFrom,
          to: nextTo,
          day: nextDay,
        } = eventsByDay[day - 1]![index + 1]!;
        // Check if the next event's "from" time is between the current event's from and to
        // appends every additional case where next event's time is between original "from" and "to"
        let prevTop: number | null = null;
        while (
          index < arr.length - 1 &&
          StrToMinutes(nextFrom) >= StrToMinutes(currFrom) &&
          StrToMinutes(nextFrom) < StrToMinutes(currTo)
        ) {
          const nextDateObject: DateObject = {
            day: nextDay,
            from: nextFrom,
            to: nextTo,
          };
          const nextTotalExpense = currEvent.expenses.reduce(
            (acc: any, cv: any) => acc + cv.cost,
            0,
          );

          const nextEventObject: Event = {
            ...afterEvent,
          };

          var topY = computeHeight(nextFrom, currFrom, screen.height, zoom);
          if (prevTop) {
            topY += prevTop;
          }
          nextEventsArray.push({
            nextDateObject,
            nextTotalExpense,
            nextEventObject,
            topY,
          });
          prevTop = topY;
          index++;
          counter++;
          if (index + 1 === arr.length) {
            break;
          }
          var {
            event: afterEvent,
            from: nextFrom,
            to: nextTo,
          } = eventsByDay[day - 1]![index + 1]!;
        }
        return (
          <Box display={"flex"} key={index}>
            {nextEventsArray.length === 0 ? (
              <CalendarCard
                retreatId={retreatId}
                expenseTotal={totalExpense}
                date={dateObject}
                event={event.event}
                startTime={
                  StrToMinutes("9:00 am") >= StrToMinutes(arr[0]!.from)
                    ? arr[0]!.from
                    : "9:00 am"
                }
                width={207}
                zoom={zoom}
              />
            ) : (
              <>
                <CalendarCard
                  expenseTotal={totalExpense}
                  date={dateObject}
                  event={event.event}
                  startTime={
                    StrToMinutes("9:00 am") >= StrToMinutes(arr[0]!.from)
                      ? arr[0]!.from
                      : "9:00 am"
                  }
                  width={207 / (nextEventsArray.length + 1)}
                  retreatId={retreatId}
                  zoom={zoom}
                />
                {console.log(nextEventsArray)}
                <Box>
                  {nextEventsArray.map((nextEvent: any, index) => {
                    return (
                      <CalendarCard
                        right={
                          0 + (index + 1) * (207 / (nextEventsArray.length + 1))
                        }
                        retreatId={retreatId}
                        key={index}
                        startTime={
                          StrToMinutes("9:00 am") >= StrToMinutes(arr[0]!.from)
                            ? arr[0]!.from
                            : "9:00 am"
                        }
                        expenseTotal={nextEvent.nextTotalExpense}
                        date={nextEvent.nextDateObject}
                        event={nextEvent.nextEventObject}
                        width={207 / (nextEventsArray.length + 1)}
                        zoom={zoom}
                      />
                    );
                  })}
                </Box>
              </>
            )}
          </Box>
        );
      }
      return (
        <CalendarCard
          retreatId={retreatId}
          key={index}
          expenseTotal={totalExpense}
          date={dateObject}
          startTime={
            StrToMinutes("9:00 am") >= StrToMinutes(arr[0]!.from)
              ? arr[0]!.from
              : "9:00 am"
          }
          event={event.event}
          width={207}
          zoom={zoom}
        />
      );
    };
  }

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
        {[1, 2, 3, 4].map((day, index) => {
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
                Day {day}
              </Text>
              <Box display={"flex"} position={"relative"}>
                <Box marginRight={"34px"} minW={"180px"}>
                  {eventsByDay[day - 1]!.map(MapEventsForDay(day))}
                </Box>
                {day !== 4 && (
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
