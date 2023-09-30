import { Box, Text, useDisclosure } from "@chakra-ui/react";
import { computeTime } from "./helper";
import CalendarCardModal from "./CalendarCardModal";
import {DateObject, Event} from  "~/common/types/types";

export default function CalendarCard({ event, date, expenses }: {event: Event, date: DateObject, expenses: any}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Box
        width={"207px"}
        height={`${computeTime(date.from, date.to)}vh`}
        display={"flex"}
        border="1px solid #D9D9D9"
        marginBottom={10}
        onClick={onOpen}
      >
        <Box width={"100%"} padding={"7px"}>
          <Text color={"#C32127"}>{date.from}</Text>
          <Text color={"#C32127"} fontWeight={700}>
            {event.name}
          </Text>
          <Text color={"#C32127"}>{event?.location}</Text>
          <Text color={"#C32127"}>${expenses.name}</Text>
        </Box>
        <Box
          width={"27px"}
          background={"rgba(38, 172, 226, 0.20)"}
          aria-orientation="vertical"
          color={"#26ACE2"}
          style={{ writingMode: "vertical-rl" }}
          fontWeight={700}
        >
          {event.energyLevel?.toUpperCase()}
        </Box>
      </Box>
      <CalendarCardModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
