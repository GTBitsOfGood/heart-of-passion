import { Box, Text } from "@chakra-ui/react";
import { Fundraiser } from "~/common/types";

export default function PlanningCard({
  fundraiser,
}: {
  fundraiser: Fundraiser;
}) {
  return (
    <Box border={"2px solid #D9D9D9"} paddingX={4} paddingY={6} width={286}>
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
          {new Date(fundraiser.date).toLocaleDateString("en-US")}
        </Text>
        <Text fontFamily={"nunito"} fontWeight={500} fontSize={20}>
          ${fundraiser.profit}
        </Text>
      </Box>
    </Box>
  );
}
