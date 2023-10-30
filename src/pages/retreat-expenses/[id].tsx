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
} from "@chakra-ui/react";
import React from "react";
import { TriangleDownIcon } from "@chakra-ui/icons";
import fonts from "src/common/theme/fonts";
import Sidebar from "~/components/Sidebar";
import { useEffect, useState } from "react";
import ExpenseList from "~/components/expenses/ExpenseList";
import { trpc } from "~/utils/api";
import { Expense } from "~/common/types";
import { useRouter } from "next/router";

export default function RetreatExpenses() {
  const [filter, setFilter] = useState("category");

  const {
    isOpen: isOpenFilterPopover,
    onOpen: onOpenFilterPopover,
    onClose: onCloseFilterPopeover,
  } = useDisclosure();

  function handleFilterClick(filter: string) {
    setFilter(filter);
    onCloseFilterPopeover();
  }

  let dummyChapter = {
    id: "1",
    name: "Atlanta",
    totalCost: 5100,
    fundExpected: 5180,
    fundActual: 2600,
  };

  let dummyYear = 2023;

  const router = useRouter();
  const { id }: { id?: string } = router.query;
  const eventData = trpc.event.getEvents.useQuery(id || "123").data;
  const [expenses, setExpenses] = useState([] as Expense[]);
  useEffect(() => {
    // clear expenses so it doesn't add every time the page is re-rendered
    setExpenses([]);
    eventData?.forEach((event: any) => {
      event.expenses?.forEach((expense: any) => {
        setExpenses((expenses) => [
          ...expenses,
          {
            name: expense.name,
            event: event.name,
            dates: event.dates,
            type: expense.type === "other" ? "Miscellaneous" : expense.type,
            cost: expense.cost,
            numUnits:
              expense.costType === "flat cost" ? 1 : expense.numberOfUnits,
          },
        ]);
      });
    });
  }, [eventData]);

  const totalCost = expenses.reduce(
    (total, expense) => total + expense.cost * (expense.numUnits || 1),
    0,
  );

  const groups = (function () {
    if (expenses && expenses.length > 0) {
      if (filter === "category") {
        const uniques = [...new Set(expenses?.map((u: any) => u["type"]))]; // array of unique vals
        const emap = new Map(uniques.map((e: any) => [e, new Array()])); // map of val to empty array
        expenses?.forEach(
          (e: any) =>
            emap.get(e["type"])?.push({
              name: e["name"],
              event: e["event"],
              type: e["type"],
              cost: e["cost"],
              numUnits: e["numUnits"],
            }),
        );
        return uniques?.map((e: string) => ({
          title: e,
          expenses: emap.get(e),
        }));
      } else if (filter === "highest cost") {
        expenses.sort((a, b) => b.cost - a.cost);
        return [{ title: "Highest to Lowest", expenses: expenses }];
      } else if (filter === "lowest cost") {
        expenses.sort((a, b) => a.cost - b.cost);
        return [{ title: "Lowest to Highest", expenses: expenses }];
      } else {
        // filter === "date"
        const uniques = [
          ...new Set(
            expenses
              .filter((u: any) => u["dates"].length === 1)
              .map((u: any) => u["dates"][0]["date"]),
          ),
        ];
        uniques.push("Other Expenses"); // for expenses with multiple dates
        const emap = new Map(uniques.map((e: any) => [e, new Array()])); // map of val to empty array
        expenses?.forEach((e: any) => {
          emap
            .get(
              e["dates"].length > 1 ? "Other Expenses" : e["dates"][0]["date"],
            )
            ?.push({
              name: e["name"],
              event: e["event"],
              type: e["type"],
              cost: e["cost"],
              numUnits: e["numUnits"],
            });
        });
        const categories = uniques?.map((e: string) => ({
          title: e,
          expenses: emap.get(e),
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
    } else {
      return [];
    }
  })();

  const groupsRendered = groups.map((gr: any) => (
    <ExpenseList key={gr.title} {...gr} />
  ));

  return (
    <Box>
      <Sidebar chapter={dummyChapter} year={dummyYear} />
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
            RETREAT EXPENSES
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
            <Button
              colorScheme="twitter"
              onClick={() => {}}
              fontWeight="400"
              color="white"
              bg="hop_blue.500"
              fontFamily="oswald"
              height="50px"
              fontSize="20px"
              marginBottom="10px"
            >
              ADD EXPENSE
            </Button>
          </Box>
        </Flex>
        {groupsRendered}
        <Flex borderBottom="1px #AEAEAE solid"></Flex>
        <Flex paddingBottom="30px" justifyContent="end" alignItems="flex-end">
          <Text paddingBottom="0.5em" paddingRight="0.5em">
            Total Travel Cost:
          </Text>
          <Text fontFamily={fonts.oswald} fontSize="64px" fontWeight="700">
            ${totalCost}
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
}
