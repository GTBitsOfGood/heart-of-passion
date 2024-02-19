import { Box, Text } from "@chakra-ui/react";
import { DateObject, Event, Fundraiser } from "~/common/types";

export default function PlanningCard({
  event,
  fundraiser,
  openCopyModal,
}: {
  event: Event;
  fundraiser: Fundraiser;
  openCopyModal: (event: Event) => void;
}) {

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
        {fundraiser.name}
      </Text>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Text fontFamily={"nunito"} fontWeight={500} fontSize={20}>
          Date {fundraiser.date}
        </Text>
        <Text fontFamily={"nunito"} fontWeight={500} fontSize={20}>
          ${fundraiser.profit}
        </Text>
      </Box>
    </Box>
  );
}
