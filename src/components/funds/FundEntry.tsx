import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Fund } from "~/common/types";
import fonts from "~/common/theme/fonts";

export default function Fund({
  name,
  date,
  amount,
  source,
}: Fund) {
  return (
    <>
      <Grid templateColumns="repeat(9, 1fr)" gap={4}>
      <GridItem colSpan={2}>
          <Box fontFamily={fonts.nunito}>{date}</Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box fontFamily={fonts.nunito}>{name}</Box>
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
            {source}
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Box fontFamily={fonts.nunito}>${amount}</Box>
        </GridItem>
      </Grid>
    </>
  );
}
