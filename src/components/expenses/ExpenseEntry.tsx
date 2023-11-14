import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Expense } from "~/common/types";
import fonts from "~/common/theme/fonts";

export default function Expense({
  name,
  event,
  type,
  cost,
  numUnits,
}: Expense) {
  return (
    <>
      <Grid templateColumns="repeat(9, 1fr)" gap={4}>
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
          <Box fontFamily={fonts.nunito}>x{numUnits}</Box>
        </GridItem>
        <GridItem colSpan={1} display="flex" justifyContent="end">
          <Box fontFamily={fonts.nunito}>${cost * (numUnits || 1)}</Box>
        </GridItem>
      </Grid>
    </>
  );
}
