import {
  Heading,
  Stack,
  Flex,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  Box,
  useDisclosure,
  Text,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { TriangleDownIcon } from "@chakra-ui/icons";
import fonts from "src/common/theme/fonts";
import Sidebar from "~/components/Sidebar";
import { useEffect, useState } from "react";
import ExpenseGroup from "~/components/expenses/ExpenseGroup";
import { trpc } from "~/utils/api";
import { DateObject, Expense } from "~/common/types";
import { useRouter } from "next/router";

function getTotalCost(expense: Expense) {
  const numUnits = expense.numUnits || 1;

  return expense.cost * numUnits;
}

type ExpenseWithDateAndEvent = Expense & {
  date: string;
  event: string;
  eventId?: string;
};

type ExpenseGroup = {
  title: string;
  expenses: ExpenseWithDateAndEvent[];
};

export default function FundraiserExpenses() {
  const [filter, setFilter] = useState("category");

  const {
    isOpen: isOpenFilterPopover,
    onOpen: onOpenFilterPopover,
    onClose: onCloseFilterPopeover,
  } = useDisclosure();

  const {
    isOpen: isOpenAddExpenseModal,
    onOpen: onOpenAddExpenseModal,
    onClose: onCloseAddExpenseModal,
  } = useDisclosure();

  function handleFilterClick(filter: string) {
    setFilter(filter);
    onCloseFilterPopeover();
  }

  const router = useRouter();
  const { id: retreatId, id: fundraiserId }: { id?: string } = router.query;
  const eventData = trpc.fundraiser.getFundraisers.useQuery(fundraiserId!).data;

  const chapter = trpc.chapter.getChapterByRetreatId.useQuery(retreatId!).data;
  const expenses: ExpenseWithDateAndEvent[] = [];

  if (eventData) {
    eventData.forEach((event) => {
      event.expenses.forEach((expense) => {
        expenses.push({
          ...expense,
          date: event.date,
          event: event.name,
          eventId: event._id,
        });
      });
    });
  }

  const totalCost = expenses.reduce(
    (total, expense) => total + expense.cost * (expense.numUnits || 1),
    0,
  );

  const groups: ExpenseGroup[] = (function () {
    if (expenses && expenses.length > 0) {
      if (filter === "category") {
        const uniques = [...new Set(expenses?.map((u) => u.type))]; // array of unique vals
        const emap: Map<string, ExpenseWithDateAndEvent[]> = new Map(
          uniques.map((e) => [e, new Array()]),
        ); // map of val to empty array
        expenses?.forEach((e) => emap.get(e.type)?.push(e));
        return uniques?.map((e) => ({
          title: e,
          expenses: emap.get(e) || [],
        }));
      } else if (filter === "highest cost") {
        expenses.sort((a, b) => getTotalCost(b) - getTotalCost(a));
        return [{ title: "Highest to Lowest", expenses: expenses }];
      } else if (filter === "lowest cost") {
        expenses.sort((a, b) => getTotalCost(a) - getTotalCost(b));
        return [{ title: "Lowest to Highest", expenses: expenses }];
      } else {
        // filter === "date"
        const uniques = [...new Set(expenses.map((u) => u.date))];
        uniques.push("Other Expenses"); // for expenses with multiple dates
        const emap: Map<string, ExpenseWithDateAndEvent[]> = new Map(
          uniques.map((e) => [e, new Array()]),
        ); // map of val to empty array
        expenses?.forEach((e) => {
          emap.get(e.date)?.push(e);
        });
        const categories = uniques?.map((e) => ({
          title: e,
          expenses: emap.get(e) || [],
        }));
        // sort by date
        categories.sort((a, b) => {
          if (a.title === "Other Expenses") {
            return 1;
          } else if (b.title === "Other Expenses") {
            return -1;
          } else {
            return new Date(a.title).getTime() - new Date(b.title).getTime();
          }
        });
        // convert from date format to Day 1/2/3/4 format
        const firstDate = new Date(categories?.[0]?.title || "");
        if (categories && categories.length > 0) {
          categories.forEach((category) => {
            if (category.title === "Other Expenses") {
              return;
            }
            const currentDate = new Date(category.title);
            const dayDifference = Math.ceil(
              (currentDate.getTime() - firstDate.getTime()) /
                (1000 * 3600 * 24) +
                1,
            );
            category.title = `Day ${dayDifference}`;
          });
        }
        return categories;
      }
    }

    return [];
  })();

  const groupsRendered = groups.map((gr) => (
    <ExpenseGroup key={gr.title} {...gr} />
  ));

  return (
    <Box>
      {chapter ? (
        <Sidebar chapter={chapter!} retreatId={retreatId} pageClicked={5} />
      ) : (
        <Spinner />
      )}
      <Stack
        spacing={4}
        alignItems={"right"}
        paddingTop="10px"
        paddingRight="5%"
        paddingLeft="2%"
        marginLeft="400px" // size of sidebar
      >
        <Flex
          justifyContent={"space-between"}
          borderBottom="solid 1px black"
          paddingTop={{ base: "7%", "2xl": "4%" }}
        >
          <Heading size="lg" fontFamily={fonts.oswald} fontWeight="extrabold">
            FUNDRAISING EXPENSES
          </Heading>
          <Box>
            <Popover
              placement="bottom-end"
              isOpen={isOpenFilterPopover}
              onClose={onCloseFilterPopeover}
            >
              <PopoverTrigger>
                <Button
                  onClick={onOpenFilterPopover}
                  variant="ghost"
                  gap="0.5em"
                >
                  <Text align="right" fontFamily={fonts.nunito} fontSize="sm">
                    {filter == "date"
                      ? "View by Date"
                      : filter == "category"
                      ? "View by Category"
                      : filter == "lowest cost"
                      ? "View by Lowest Cost"
                      : "View by Highest Cost"}
                  </Text>
                  <TriangleDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent w="11.7em">
                <PopoverBody w="10em">
                  <Stack>
                    <Box onClick={() => handleFilterClick("date")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Date
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("category")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Category
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("lowest cost")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Lowest Cost
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("highest cost")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Highest Cost
                      </Text>
                    </Box>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        </Flex>
        {groupsRendered}
        <Flex borderBottom="1px #AEAEAE solid"></Flex>
        <Flex paddingBottom="30px" justifyContent="end" alignItems="flex-end">
          <Text paddingBottom="0.5em" paddingRight="0.5em">
            Total Cost:
          </Text>
          <Text fontFamily={fonts.oswald} fontSize="64px" fontWeight="700">
            ${totalCost}
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
}
