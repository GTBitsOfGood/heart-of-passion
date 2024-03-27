import { Box, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { Expense } from "~/common/types";
import fonts from "~/common/theme/fonts";
import { NewExpenseModal } from "../NewExpenseModal";

export default function Expense({
  _id,
  name,
  event,
  eventId,
  type,
  cost,
  numUnits,
}: Expense) {
  const expense: Expense = {
    _id: _id,
    name: name,
    event: event,
    eventId: eventId,
    type: type,
    cost: cost,
    numUnits: numUnits,
  };
  const {
    isOpen: isOpenAddExpenseModal,
    onOpen: onOpenAddExpenseModal,
    onClose: onCloseAddExpenseModal,
  } = useDisclosure();

  return (
    <>
      <Grid
        onClick={onOpenAddExpenseModal}
        templateColumns="repeat(9, 1fr)"
        gap={4}
        _hover={{
          backgroundColor: "LightGray",
          cursor: "pointer",
        }}
      >
        <GridItem colSpan={2}>
          <Box fontFamily={fonts.nunito}>{name}</Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box fontFamily={fonts.nunito}>{event}</Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box
            backgroundColor="#DEEBFF"
            borderRadius=".2em"
            fontFamily={fonts.nunito}
            justifySelf="left"
            py=".1em"
            px=".5em"
            textTransform="capitalize"
            mr="3em"
          >
            {type}
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Box fontFamily={fonts.nunito}>${cost}</Box>
        </GridItem>
        <GridItem colSpan={1}>
        <Box fontFamily={fonts.nunito}>{numUnits ? `x${numUnits}` : null}</Box>
        </GridItem>
        <GridItem colSpan={1} display="flex" justifyContent="end">
          <Box fontFamily={fonts.nunito}>
            ${numUnits ? cost * numUnits : cost}
          </Box>
        </GridItem>
      </Grid>
      <NewExpenseModal
        isOpen={isOpenAddExpenseModal}
        onClose={onCloseAddExpenseModal}
        thisEvent={eventId}
        thisExpense={expense}
      />
    </>
  );
}
