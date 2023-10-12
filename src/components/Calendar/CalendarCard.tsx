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
import CalendarCardModal from "./CalendarCardModal";
import { DateObject, Event } from "~/common/types";
import { useRef, useEffect, useState } from "react";

export default function CalendarCard({
  event,
  date,
  expenseTotal,
}: {
  event: Event;
  date: DateObject;
  expenseTotal: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const height = computeHeight(date.from, date.to);
  const parentRef: any = useRef();
  const [cardHt, setCardHeight] = useState(-1); // debugging only, can remove
  const [variant, setVariant] = useState(3);
  useEffect(() => {
    if (parentRef.current) {
      const htPx = parentRef.current.getBoundingClientRect().height;
      const findVariant = (function () {
        if (htPx < 45) {
          return -1;
        } else if (htPx < 70) {
          return 0;
        } else if (htPx < 90) {
          return 1;
        } else if (htPx < 120) {
          return 2;
        } else {
          return 3;
        }
      })();
      setVariant(findVariant);
      setCardHeight(htPx);
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
          <Text color={"#C32127"}>
            {date.from} + {variant}{" "}
          </Text>
          <Text color={"#C32127"} fontWeight={700}>
            {event?.name}
          </Text>
          <Text color={"#C32127"}>{event?.location}</Text>
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
      <Text
        width="158px"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        color={"#C32127"}
      >
        ${date.from} <b>{event?.name}</b> {event?.location}{" "}
        <b>${expenseTotal}</b>
      </Text>
    );
  }

  return (
    <>
      <Grid
        templateColumns="207px 27px"
        width={"207px"}
        height={`${height}px`}
        display={"flex"}
        border="1px solid #D9D9D9"
        marginBottom={10}
        onClick={onOpen}
        overflow="hidden"
        ref={parentRef}
      >
        <GridItem width={"100%"} padding={"7px"}>
          {variant >= 0 ? <PositiveVariant /> : <NegativeVariant />}
        </GridItem>
        <GridItem
          background={"rgba(38, 172, 226, 0.20)"}
          aria-orientation="vertical"
          color={"#26ACE2"}
          style={{ writingMode: "vertical-rl" }}
          transform="rotate(180deg)"
          fontWeight={700}
          as={Center}
        >
          {variant > 0
            ? event?.energyLevel?.toUpperCase()
            : event?.energyLevel?.[0]?.toUpperCase()}
        </GridItem>
      </Grid>
      <CalendarCardModal event={event} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
