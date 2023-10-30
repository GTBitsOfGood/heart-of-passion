import { Box, Flex, Text } from "@chakra-ui/react";
import CalendarCard from "src/components/Calendar/CalendarCard";

import "@fontsource/oswald/700.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "~/utils/api";
import { DateObject, Chapter } from "~/common/types";
import Sidebar from "~/components/Sidebar";

export default function Calendar() {
  const [event, setEvent]: any[] = useState([]);

  const router = useRouter();
  const { id }: { id?: string } = router.query;

  const chapter: Chapter = trpc.chapter.getChapterByRetreatId.useQuery(
    id || "123",
  )?.data!;
  const { data: currEventData } = trpc.event.getEvents.useQuery(id!, {
    enabled: !!id,
  });

  useEffect(() => {
    setEvent(currEventData);
  }, [currEventData]);

  return (
    <Box>
      {<Sidebar chapter={chapter} year={2023} />}
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
