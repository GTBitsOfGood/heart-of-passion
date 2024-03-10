import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import CalendarCard from "src/components/Calendar/CalendarCard";

import "@fontsource/oswald/700.css";
import { useRouter } from "next/router";
import { trpc } from "~/utils/api";
import Sidebar from "~/components/Sidebar";
import { DateObject } from "~/common/types";
import { Event } from "~/common/types";
import { useState, useEffect, useRef } from "react";
import { computeHeight } from "~/components/Calendar/computeHeight";
import { IEvent } from "~/server/models/Event";
import { NewEventModal } from "~/components/NewEventModal";
import CalendarContent from "../../components/Calendar/CalendarContent";

type EventWithStamp = {
  event: IEvent;
  from: string;
  to: string;
};
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
  const zoomMin = 0.25;
  const zoomMax = 5;
  const zoomSens = 0.25;
  const zoomDefault = 1;

  const calendarArea = useRef<any>();
  const [zoomLevel, setZoomLevel] = useState<number>(zoomDefault);
  const [showToolTip, setShowToolTip] = useState<boolean>(false);
  const zoom = zoomLevel;
  const slider = useRef<any>();
  useEffect(() => {
    const e = calendarArea.current;
    const handler = (event: any) => {
      if (event.ctrlKey) {
        setZoomLevel((prev) => {
          const delta = event.deltaY > 0 ? zoomSens : -zoomSens;
          return Math.max(zoomMin, Math.min(prev + delta, zoomMax));
        });
        event.preventDefault();
      }
    };
    e.addEventListener("wheel", handler, { passive: false });
    return () => {
      e.removeEventListener("wheel", handler);
    };
  }, []);
  return (
    <Grid gridTemplateColumns="436px 1fr" h="100vh">
      <GridItem zIndex={1000}>
        {chapter && retreat && (
          <Sidebar
            chapter={chapter}
            year={retreat.year}
            retreatId={retreat._id}
          />
        )}
      </GridItem>
      <GridItem overflow="scroll" className="no-scroll-bar" ref={calendarArea}>
        {events && (
          <CalendarContent
            retreatId={retreat?._id ?? ""}
            events={events}
            counter={counter}
            zoom={zoom}
          />
        )}
        <Box
          position="fixed"
          bottom="40px"
          right="20px"
          display="flex"
          flexDirection="row"
          gap="10px"
          alignItems="flex-end" // Add this line
        >
          <Box
            display="flex"
            flexDirection="column"
            // justifyContent="space-between"
          >
            {/* <Button onClick={() => setZoomLevel(zoomLevel < 2 ? 2 : 1)}>
              {zoomLevel > 1 ? "Zoom 1x" : "Zoom 2x"}
            </Button>
            Current zoom: {zoomLevel} */}
            {/* <br /> */}
            <Text>Ctrl+Scroll enabled</Text>
            {/* Ctrl+Scroll enabled */}
            <Button
              colorScheme="twitter"
              fontWeight="400"
              color="white"
              bg="hop_blue.500"
              fontFamily="oswald"
              height="50px"
              fontSize="20px"
              onClick={openAddEventModal}
            >
              ADD EVENT
            </Button>
          </Box>
          <Slider
            min={zoomMin}
            max={zoomMax}
            ref={slider}
            value={zoomLevel}
            step={0.001}
            onChange={(v) => setZoomLevel(v)}
            orientation="vertical"
            minH="32"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="teal.500"
              color="teal.100"
              placement="top"
              isOpen={showToolTip}
              label={`${zoomLevel}x`}
            >
              <SliderThumb
                onMouseEnter={() => setShowToolTip(true)}
                onMouseLeave={() => setShowToolTip(false)}
              />
            </Tooltip>
          </Slider>
        </Box>
        <NewEventModal
          retreatId={retreat?._id ?? ""}
          isOpen={isAddEventOpen}
          onClose={onAddEventClose}
          isCopy={false}
        />
      </GridItem>
    </Grid>
  );
}
