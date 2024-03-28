import { Heading, Stack, Flex, Grid, GridItem, Box } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useState } from "react";
import TransactionEntry from "./TransactionEntry";
import { Transaction, TransactionList } from "src/common/types";
import fonts from "~/common/theme/fonts";

export default function TransactionList({
  includeTitle,
  title,
  transactions,
}: TransactionList) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Stack w="95%" py="0.5em" px="1em">
        <Grid templateColumns="repeat(9, 1fr)" gap={4} pl="3em">
          <GridItem colSpan={1}>
            <Box fontFamily={fonts.nunito}>Name</Box>
          </GridItem>
          <GridItem colSpan={1}>
            <Box fontFamily={fonts.nunito}>Amount</Box>
          </GridItem>
          <GridItem colSpan={2}>
            <Box fontFamily={fonts.nunito}>Date</Box>
          </GridItem>
          <GridItem colSpan={2}>
            <Box fontFamily={fonts.nunito}>Chapter</Box>
          </GridItem>
          <GridItem colSpan={3}>
            <Box fontFamily={fonts.nunito}>Notes</Box>
          </GridItem>
        </Grid>
        <Flex
          justifyContent="space-between"
          onClick={() => setOpen(!open)}
          borderBottom="1px solid #AEAEAE"
          marginBottom="1em"
        >
          {includeTitle && (
            <Heading size="md" textTransform="capitalize">
              {title}
            </Heading>
          )}
          {includeTitle && (open ? <TriangleUpIcon /> : <TriangleDownIcon />)}
        </Flex>
        <Stack pl="3em" gap="1em">
          {open ? (
            transactions?.map((transaction: Transaction) => (
              <TransactionEntry
                key={transaction.transactionId}
                {...transaction}
              />
            ))
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
    </>
  );
}
