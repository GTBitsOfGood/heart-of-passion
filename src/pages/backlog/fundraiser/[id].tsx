import { Box, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "~/utils/api";
import "@fontsource/oswald/700.css";
import Sidebar from "~/components/Sidebar";
import Select from "react-select";
import FundraisingHandler from "~/components/FundraisingBacklog/FundraisingHandler";
import FundraisingCopyModal from "~/components/FundraisingBacklog/FundrasingCopyModal";
import { Event, EventsByYear } from "~/common/types";

export enum BacklogSort {
  ViewByDate = "View by Date",
  LowestCost = "Lowest Cost",
  HighestCost = "Highest Cost",
}

export default function Backlog() {
  const toast = useToast();
  const chapter = {
    name: "Test Chapter",
    totalCost: 1000,
    fundExpected: 1000,
    fundActual: 1000,
    id: "12345",
  };
  const eventsByYear: EventsByYear = {
    2024: [
      {
        name: "Test5",
        dates: [
          {
            from: "9am",
            day: 1,
            to: "10am",
          },
        ],
        expenses: [
          {
            name: "TestExpense",
            type: "Entertainment",
            cost: 1000,
            numUnits: 1,
            event: "Test",
            eventId: "Test",
            _id: "Test",
          },
        ],
        location: "Test",
        status: "planning",
        energyLevel: "low",
      },
    ],
  };
  const sortOptions = Object.values(BacklogSort).map((sortMethod) => ({
    value: sortMethod,
    label: sortMethod,
  }));
  const [sortMethod, setSortMethod] = useState<BacklogSort>(
    BacklogSort.ViewByDate,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [eventToCopy, setEventToCopy] = useState<Event | undefined>(undefined);

  const openCopyModal = (event: Event) => {
    setEventToCopy(event);
    onOpen();
  };

  return (
    <>
      <Box>
        {eventsByYear && (
          <Box display={"flex"}>
            <Box>{chapter ? <Sidebar chapter={chapter} /> : <Spinner />}</Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              marginLeft={400}
              padding={50}
              width={"100%"}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                borderBottom={"1px solid black"}
                paddingX={3}
              >
                <Text fontSize={36} fontWeight={700} fontFamily={"oswald"}>
                  PREVIOUS FUNDRAISER EVENTS
                </Text>
                <Box display={"flex"} gap={2} alignItems={"center"}>
                  <Select
                    value={{ label: sortMethod, value: sortMethod }}
                    options={sortOptions}
                    onChange={(event) => {
                      setSortMethod(event!.value);
                    }}
                    isSearchable={false}
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        border: 0,
                        boxShadow: "none",
                        textAlign: "right",
                        fontSize: "20px",
                        fontFamily: "nunito",
                      }),
                      dropdownIndicator: (base: any) => ({
                        ...base,
                        color: "black",
                      }),
                    }}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                  />
                </Box>
              </Box>
              <FundraisingHandler
                openCopyModal={openCopyModal}
                sortMethod={sortMethod}
                eventsByYear={eventsByYear}
              />
            </Box>
          </Box>
        )}
      </Box>

      <FundraisingCopyModal
        event={eventToCopy}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </>
  );
}
