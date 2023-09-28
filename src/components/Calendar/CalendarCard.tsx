import { Box, Text, useDisclosure } from "@chakra-ui/react";
import { computeTime } from "./helper";
import CalendarCardModal from "./CalendarCardModal";

type Event = {
  startTime: string;
  endTime: string;
  task: string;
  address: string;
  price: number;
  priority: string;
};

export default function CalendarCard({ event }: { event: Event }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      width={"207px"}
      height={`${computeTime(event.startTime, event.endTime)}vh`}
      display={"flex"}
      border="1px solid #D9D9D9"
      marginBottom={10}
      onClick={onOpen}
      cursor="pointer"
    >
      <Box width={"100%"} padding={"7px"}>
        <Text color={"#C32127"}>{event.startTime}</Text>
        <Text color={"#C32127"} fontWeight={700}>
          {event.task}
        </Text>
        <Text color={"#C32127"}>{event.address}</Text>
        <Text color={"#C32127"}>${event.price}</Text>
      </Box>
      <Box
        width={"27px"}
        background={"rgba(38, 172, 226, 0.20)"}
        aria-orientation="vertical"
        color={"#26ACE2"}
        style={{ writingMode: "vertical-rl" }}
        fontWeight={700}
      >
        {event.priority}
      </Box>
      <CalendarCardModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
