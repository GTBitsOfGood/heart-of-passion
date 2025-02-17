import { Box, Text } from "@chakra-ui/react";
import {
  DateObject,
  Event,
  Fundraiser,
  fundraiserSchema,
} from "~/common/types";

export default function BacklogCard({
  event,
  openCopyModal,
}: {
  event: Fundraiser;
  openCopyModal: (event: Fundraiser) => void;
}) {
  const totalCost = event.expenses.reduce((acc, { cost }) => acc + cost, 0);

  return (
    <Box
      onClick={() => openCopyModal(event)}
      border={"2px solid #D9D9D9"}
      paddingX={4}
      paddingY={6}
      width={286}
      cursor={"pointer"}
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
          {new Date(event.date).toLocaleDateString("en-US")}
        </Text>
        <Text fontFamily={"nunito"} fontWeight={500} fontSize={20}>
          {"Revenue: $" + totalCost}
        </Text>
      </Box>
    </Box>
  );
}
