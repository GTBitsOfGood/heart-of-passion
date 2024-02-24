import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Fund } from "~/common/types";
import fonts from "~/common/theme/fonts";

type FundEntryProps = {
  handleSelectFund: (arg0: Fund) => void;
  fund: Fund;
};
export default function Fund({ handleSelectFund, fund }:FundEntryProps) {
  return (
    <>
      <Grid templateColumns="repeat(9, 1fr)" gap={4} onClick={() => handleSelectFund(fund)}>
        <GridItem colSpan={2}>
          <Box fontFamily={fonts.nunito}>{fund.date}</Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box fontFamily={fonts.nunito}>{fund.name}</Box>
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
            {fund.source}
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Box fontFamily={fonts.nunito}>${fund.amount}</Box>
        </GridItem>
      </Grid>
    </>
  );
}
