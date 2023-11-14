import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { computeHeight } from "./helper";
import { DateObject, Event } from "~/common/types";
import { useRef, useEffect, useState } from "react";
import { NewEventModal } from "../NewEventModal";

export default function CalendarCard({
  event,
  date,
  expenseTotal,
  width,
  topY,
}: {
  event: Event;
  date: DateObject;
  expenseTotal: number;
  width: number;
  topY?: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const height = computeHeight(date.from, date.to, screen.height);
  const top = computeHeight("9:00 am", date.from, screen.height);
  const parentRef: any = useRef();
  const [variant, setVariant] = useState(3);
  useEffect(() => {
    if (parentRef.current) {
      const htPx = parentRef.current.getBoundingClientRect().height;
      const findVariant = (function () {
        if (htPx < 32) {
          return -2;
        }
        if (htPx < 46.5) {
          return -1;
        } else if (htPx < 66.5) {
          return 0;
        } else if (htPx < 70) {
          return 0.5;
        } else if (htPx < 85) {
          return 0.75;
        } else if (htPx < 98) {
          return 1;
        } else if (htPx < 126) {
          return 2;
        } else {
          return 3;
        }
      })();
      setVariant(findVariant);
    }
  }, [parentRef]);

  function PositiveVariant() {
    return (
      <Flex
        h="100%"
        direction="column"
        justify={variant > 2 ? "space-between" : "flex-start"}
      >
        <Box>
          <Text color={"#C32127"}>{date.from}</Text>
          <Text color={"#C32127"} fontWeight={700} textOverflow="ellipsis">
            {event?.name}
          </Text>
          {variant > 0 && <Text color={"#C32127"}>{event?.location}</Text>}
        </Box>
        {variant > 1 && (
          <Text fontWeight={700} color={"#C32127"}>
            ${expenseTotal}
          </Text>
        )}
      </Flex>
    );
  }
  function NegativeVariant() {
    return (
      <Flex
        direction="column"
        justify="center"
        h={variant < -1 ? "20px" : "100%"}
        overflow="visible"
        textOverflow="ellipsis"
      >
        {width <= 103 ? (
          <Text
            width={width - 40}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            color={"#C32127"}
          >
            <b>{event?.name}</b>
          </Text>
        ) : (
          <Text
            width={width - 40}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            color={"#C32127"}
          >
            {date.from} <b>{event?.name}</b> {event?.location}{" "}
            <b>${expenseTotal}</b>
          </Text>
        )}
      </Flex>
    );
  }
  function EnergyText() {
    if (variant >= 0) {
      if (event?.energyLevel === "medium" && variant < 1) {
        return "MED";
      } else {
        return event?.energyLevel?.toUpperCase();
      }
    } else {
      return event?.energyLevel?.[0]?.toUpperCase();
    }
  }

  return (
    <>
      <Grid
        templateColumns={`${width}px 7px`}
        width={width}
        minH={"15px"}
        height={`${height}px`}
        display={"flex"}
        border="1px solid #D9D9D9"
        marginBottom={"16px"}
        onClick={onOpen}
        overflow={variant < -1 ? "visible" : "hidden"}
        ref={parentRef}
        as={GridItem}
        area="stack"
        textOverflow="ellipsis"
        marginTop={!topY ? 0 : topY}
      >
        <GridItem
          fontSize="14px"
          width={"calc(100% - 25px)"}
          paddingY={variant >= 1 ? "7px" : "0px"}
          paddingX={"7px"}
        >
          {variant >= 0 ? <PositiveVariant /> : <NegativeVariant />}
        </GridItem>
        <GridItem
          width={"25px"}
          background={"rgba(38, 172, 226, 0.20)"}
          aria-orientation="vertical"
          color={"#26ACE2"}
          style={{ writingMode: "vertical-rl" }}
          transform="rotate(180deg)"
          fontWeight={700}
          as={Center}
          fontSize="20px"
        >
          {EnergyText()}
        </GridItem>
      </Grid>
      <NewEventModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
