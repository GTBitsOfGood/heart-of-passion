import { Box, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import "@fontsource/oswald/700.css";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import PlanningCard from "~/components/FundraisingPlanning/PlanningCard";
import { Event, EventsByYear, Fundraiser } from "~/common/types";
import { PlanningSort } from "~/pages/planning/[id]";

export default function PlanningHandler({
  sortMethod,
  eventsByYear,
}: {
  sortMethod: PlanningSort;
  eventsByYear: EventsByYear;
}) {
  // Combine all events into a single array
  //const allFundraisers = Object.values(eventsByYear).flat();

  return (
    <Box>
      <PlanningYearContainer
        events={eventsByYear}
        sortMethod={sortMethod}
      />
    </Box>
  );
}

function PlanningYearContainer({
  events: unsortedEvents,
  sortMethod,
}: {
  events: Fundraiser[];
  sortMethod: PlanningSort;
}) {
  const [open, setOpen] = useState(true);

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
            sortedEvents.map((f) => {
              return (
                <PlanningCard
                  fundraiser={f}
                />
              );
            })}
        </Box>
  );
}
