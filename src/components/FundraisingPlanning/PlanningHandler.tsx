import { Box, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import "@fontsource/oswald/700.css";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import PlanningCard from "~/components/FundraisingPlanning/PlanningCard";
import { Event, EventsByYear, Fundraiser } from "~/common/types";
import { BacklogSort } from "~/pages/backlog/[id]";

export default function PlanningHandler({
  sortMethod,
  eventsByYear,
  fundraiser,
  openCopyModal,
}: {
  sortMethod: BacklogSort;
  eventsByYear: EventsByYear;
  fundraiser: Fundraiser;
  openCopyModal: (event: Event) => void;
}) {
  // Combine all events into a single array
  const allEvents = Object.values(eventsByYear).flat();

  return (
    <Box>
      <BacklogYearContainer
        openCopyModal={openCopyModal}
        events={allEvents}
        sortMethod={sortMethod}
        fundraiser={fundraiser}
      />
    </Box>
  );
}


function BacklogYearContainer({
  events: unsortedEvents,
  sortMethod,
  openCopyModal,
  fundraiser,
}: {
  events: Event[];
  sortMethod: BacklogSort;
  openCopyModal: (event: Event) => void;
  fundraiser: Fundraiser;
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
        <Box display={"flex"} gap={10} flexWrap={"wrap"} marginTop={7}>
          {open &&
            sortedEvents.map((event) => {
              return (
                <PlanningCard
                  key={event.name}
                  fundraiser={fundraiser}
                />
              );
            })}
        </Box>
  );
}
