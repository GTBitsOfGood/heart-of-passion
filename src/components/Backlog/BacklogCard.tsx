import { Box, Text } from "@chakra-ui/react";
import { DateObject } from "~/common/types";

export default function BacklogCard({
  name,
  date,
  totalCost,
}: {
  name: string;
  date: string;
  totalCost: number;
}) {
  return (
    <Box border={"2px solid #D9D9D9"} paddingX={4} paddingY={6} marginY={6}>
      <Text fontFamily={"nunito"} fontWeight={700} fontSize={20}>
        {name}
      </Text>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Text fontFamily={"nunito"} fontWeight={500} fontSize={20}>
          {date}
        </Text>
        <Text fontFamily={"nunito"} fontWeight={500} fontSize={20}>
          {totalCost}
        </Text>
      </Box>
    </Box>
  );
}
