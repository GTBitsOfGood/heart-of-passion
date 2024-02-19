import { Heading, Stack, Flex } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useState } from "react";
import ExpenseEntry from "./ExpenseEntry";
import { Expense } from "src/common/types";
import { ExpenseGroup } from "~/pages/retreat-expenses/[id]";

export default function ExpenseGroup({ title, expenses }: ExpenseGroup) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Stack w="95%" py="0.5em" px="1em">
        <Flex
          justifyContent="space-between"
          onClick={() => setOpen(!open)}
          borderBottom="1px #AEAEAE solid"
          p=".5em"
          marginBottom="1em"
        >
          <Heading size="md" textTransform="capitalize">
            {title}
          </Heading>
          {open ? <TriangleUpIcon /> : <TriangleDownIcon />}
        </Flex>
        <Stack pl="3em" gap="1em">
          {open ? (
            expenses.map((expense: Expense) => (
              <ExpenseEntry
                key={
                  expense._id +
                  expense.name +
                  expense.type +
                  expense.cost +
                  expense.event +
                  expense.eventId
                }
                {...expense}
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
