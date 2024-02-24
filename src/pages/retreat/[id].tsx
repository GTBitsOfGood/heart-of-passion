import {
  Box,
  Button,
  Flex,
  HStack,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CalendarCard from "src/components/Calendar/CalendarCard";

import "@fontsource/oswald/700.css";
import { useRouter } from "next/router";
import { trpc } from "~/utils/api";
import Sidebar from "~/components/Sidebar";
import { DateObject } from "~/common/types";
import { Event } from "~/common/types";
import { useState } from "react";
import { computeHeight } from "~/components/Calendar/computeHeight";
import { IEvent } from "~/server/models/Event";
import { NewEventModal } from "~/components/NewEventModal";
import CalendarContent from "./CalendarContent";

export default function Calendar() {
  const router = useRouter();
  const { id }: { id?: string } = router.query;

  const {
    isOpen: isAddEventOpen,
    onClose: onAddEventClose,
    onOpen: onAddEventOpen,
  } = useDisclosure();

  const openAddEventModal = () => {
    onAddEventOpen();
  };

  const chapter = trpc.chapter.getChapterByRetreatId.useQuery(id!, {
    enabled: !!id,
  })?.data;
  const retreat = trpc.retreat.getRetreatById.useQuery(id!, {
    enabled: !!id,
  })?.data;
  const events = trpc.event.getEvents.useQuery(id!, {
    enabled: !!id,
  }).data;

  const counter = 0; // used to check if next element was within the "from" and "to" time range, if it is then preents duplicate entries
  return (
    <Box>
      <Box display="flex">
        <Box zIndex={1000}>
          {chapter && retreat && (
            <Sidebar
              chapter={chapter}
              year={retreat.year}
              retreatId={retreat._id}
            />
          )}
        </Box>
        <Box position="relative" left="436px" overflowX={"visible"}>
          {events && (
            <CalendarContent
              retreatId={retreat?._id ?? ""}
              events={events}
              counter={counter}
            />
          )}
          <Flex alignItems={"right"}>
            <Spacer />
            <Button
              colorScheme="twitter"
              marginLeft="auto"
              fontWeight="400"
              color="white"
              bg="hop_blue.500"
              fontFamily="oswald"
              height="50px"
              fontSize="20px"
              marginBottom="10px"
              onClick={openAddEventModal}
            >
              ADD EVENT
            </Button>
            <NewEventModal
              retreatId={retreat?._id ?? ""}
              isOpen={isAddEventOpen}
              onClose={onAddEventClose}
              isCopy={false}
            />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
