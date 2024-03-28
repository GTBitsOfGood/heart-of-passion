import { Box, Text, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import "@fontsource/oswald/700.css";

import PlanningCard from "~/components/FundraisingPlanning/PlanningCard";
import { Fundraiser } from "~/common/types";
import { PlanningSort } from "~/pages/planning/[id]";
import { FundraisingPlanningModal } from "../FundraisingPlanningModal";
import { IFundraiser } from "~/server/models/Fundraiser";

export default function PlanningHandler({
  sortMethod,
  fundraisers,
}: {
  sortMethod: PlanningSort;
  fundraisers: IFundraiser[];
}) {
  // Combine all events into a single array
  //const allFundraisers = Object.values(eventsByYear).flat();

  return (
    <Box>
      <PlanningYearContainer
        fundraisers={fundraisers}
        sortMethod={sortMethod}
      />
    </Box>
  );
}

function PlanningYearContainer({
  fundraisers,
  sortMethod,
}: {
  fundraisers: IFundraiser[];
  sortMethod: PlanningSort;
}) {
  const [open, setOpen] = useState(true);

  const sortedEvents = useMemo(() => {
    const fundraisersWithCost = fundraisers.map((event) => {
      const totalCost = event.expenses.reduce((acc, { cost }) => acc + cost, 0);

      return { ...event, totalCost };
    });

    switch (sortMethod) {
      case "View by Date":
        return fundraisersWithCost;
      case "Lowest Cost":
        return fundraisersWithCost.sort((event1, event2) => {
          return event1.totalCost - event2.totalCost;
        });
      case "Highest Cost":
        return fundraisersWithCost.sort((event1, event2) => {
          return event2.totalCost - event1.totalCost;
        });
      default:
        return fundraisersWithCost;
    }
  }, [fundraisers, sortMethod]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [editingFundraiser, setEditingFundraiser] = useState<
    IFundraiser | undefined
  >(undefined);

  const editFundraiser = (fundraiser: IFundraiser) => {
    setEditingFundraiser(fundraiser);
    onOpen();
  };

  return (
    <Box display={"flex"} gap={10} flexWrap={"wrap"} marginTop={7}>
      {open &&
        sortedEvents.map((f) => {
          return (
            <PlanningCard
              key={f.name + f.date + f.location}
              fundraiser={f}
              onClick={() => {
                editFundraiser(f);
              }}
            />
          );
        })}
      <FundraisingPlanningModal
        isOpen={isOpen}
        retreatId={""}
        fundraiser={editingFundraiser}
        onClose={onClose}
      />
    </Box>
  );
}
