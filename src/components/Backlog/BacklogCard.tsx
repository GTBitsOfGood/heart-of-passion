import { Box, Text } from "@chakra-ui/react";
import { DateObject, Event } from "~/common/types";

export default function BacklogCard({
  event,
  openCopyModal,
}: {
  event: Event;
  openCopyModal: (event: Event) => void;
}) {
  const totalCost = event.expenses.reduce((acc, { cost }) => acc + cost, 0);

  return (
    <Box
      onClick={() => openCopyModal(event)}
      border={"2px solid #D9D9D9"}
      paddingX={4}
      paddingY={6}
      width={286}
    >
      <Text
        fontFamily={"nunito"}
        fontWeight={700}
        fontSize={20}
        height={70}
        marginBottom={49}
      >
        {event.name}
      </Text>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Text fontFamily={"nunito"} fontWeight={500} fontSize={20}>
          Day {event.dates.map((date) => date.day).join(", ")}
        </Text>
        <Text fontFamily={"nunito"} fontWeight={500} fontSize={20}>
          ${totalCost}
        </Text>
      </Box>
    </Box>
  );
}
