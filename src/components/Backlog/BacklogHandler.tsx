import { Box, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import "@fontsource/oswald/700.css";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import BacklogCard from "~/components/Backlog/BacklogCard";
import { Event, EventsByYear } from "~/common/types";
import { BacklogSort } from "~/pages/backlog/[id]";

export default function BacklogHandler({
  sortMethod,
  eventsByYear,
  openCopyModal,
}: {
  sortMethod: BacklogSort;
  eventsByYear: EventsByYear;
  openCopyModal: (event: Event) => void;
}) {
  return (
    <Box>
      {Object.keys(eventsByYear).map((year) => {
        return (
          <BacklogYearContainer
            openCopyModal={openCopyModal}
            key={year}
            events={eventsByYear[parseInt(year)]!}
            year={parseInt(year)}
            sortMethod={sortMethod}
          />
        );
      })}
    </Box>
  );
}

function BacklogYearContainer({
  events: unsortedEvents,
  year,
  sortMethod,
  openCopyModal,
}: {
  events: Event[];
  year: number;
  sortMethod: BacklogSort;
  openCopyModal: (event: Event) => void;
}) {
  const [open, setOpen] = useState(true);
  const toggleOpen = () => setOpen(!open);

  const sortedEvents = useMemo(() => {
    const eventsWithCost = unsortedEvents.map((event) => {
      const totalCost = event.expenses.reduce((acc, { cost }) => acc + cost, 0);

      return { ...event, totalCost };
    });

    switch (sortMethod) {
      case "View by Date":
        return eventsWithCost;
      case "Lowest Cost":
        return eventsWithCost.sort((event1, event2) => {
          return event1.totalCost - event2.totalCost;
        });
      case "Highest Cost":
        return eventsWithCost.sort((event1, event2) => {
          return event2.totalCost - event1.totalCost;
        });
      default:
        return eventsWithCost;
    }
  }, [unsortedEvents, sortMethod]);

  return (
    <Box display={"flex"} justifyContent={"center"} marginTop={7} key={year}>
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
            <TriangleUpIcon
              cursor={"pointer"}
              onClick={toggleOpen}
              transform={open ? "rotate(180deg)" : ""}
              transition={"transform 150ms ease"}
            />
          </Box>
        </Box>
        <Box display={"flex"} gap={10} flexWrap={"wrap"} marginTop={7}>
          {open &&
            sortedEvents.map((event) => {
              return (
                <BacklogCard
                  openCopyModal={openCopyModal}
                  key={event.name}
                  event={event}
                />
              );
            })}
        </Box>
      </Box>
    </Box>
  );
}
