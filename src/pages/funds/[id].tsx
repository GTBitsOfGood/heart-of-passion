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
import FundList from "~/components/funds/FundList";
import { trpc } from "~/utils/api";
import { Fund } from "~/common/types";
import { useRouter } from "next/router";
import { NewFundModal } from "~/components/NewFundModal";

const dummyFunds = [
  {
    name: "Nikola Tesla",
    date: "11/01/2023",
    amount: 500,
    source: "Donation",
  },
  {
    name: "Rosalind Franklin",
    date: "10/15/2023",
    amount: 120,
    source: "Event 1",
  },
  {
    name: "Stephen Hawking",
    date: "09/20/2023",
    amount: 200,
    source: "Event 1",
  },
  {
    name: "Ada Lovelace",
    date: "08/05/2023",
    amount: 750,
    source: "Event 2",
  },
  {
    name: "Albert Einstein",
    date: "11/01/2023",
    amount: 500,
    source: "Donation",
  },
  {
    name: "Galileo Galilei",
    date: "10/15/2023",
    amount: 120,
    source: "Event 1",
  },
  {
    name: "Grace Hopper",
    date: "09/20/2023",
    amount: 200,
    source: "Event 1",
  },
  {
    name: "Carl Sagan",
    date: "08/05/2023",
    amount: 750,
    source: "Event 2",
  },
  {
    name: "Marie Curie",
    date: "11/01/2023",
    amount: 500,
    source: "Donation",
  },
  {
    name: "Gregor Mendel",
    date: "10/15/2023",
    amount: 120,
    source: "Event 1",
  },
  {
    name: "Leonardo da Vinci",
    date: "08/05/2023",
    amount: 750,
    source: "Event 2",
  },
];

export default function RaisedFunds() {
  const [filter, setFilter] = useState("category");

  const {
    isOpen: isOpenFilterPopover,
    onOpen: onOpenFilterPopover,
    onClose: onCloseFilterPopover,
  } = useDisclosure();
  const {
    isOpen: isOpenAddFundModal,
    onOpen: onOpenAddFundModal,
    onClose: onCloseAddFundModal,
  } = useDisclosure();

  function handleFilterClick(filter: string) {
    setFilter(filter);
    onCloseFilterPopover();
  }

  let dummyChapter = {
    id: "1",
    name: "Atlanta",
    totalCost: 5100,
    fundExpected: 5180,
    fundActual: 2600,
  };

  let dummyYear = 2023;

  const dummy_funds = [
    {
      name: "Nikola Tesla",
      date: "11/01/2023",
      amount: 500,
      source: "Donation",
    },
    {
      name: "Rosalind Franklin",
      date: "10/15/2023",
      amount: 120,
      source: "Event 1",
    },
    {
      name: "Stephen Hawking",
      date: "09/20/2023",
      amount: 200,
      source: "Event 1",
    },
    {
      name: "Ada Lovelace",
      date: "08/05/2023",
      amount: 750,
      source: "Event 2",
    },
    {
      name: "Albert Einstein",
      date: "11/01/2023",
      amount: 500,
      source: "Donation",
    },
    {
      name: "Galileo Galilei",
      date: "10/15/2023",
      amount: 120,
      source: "Event 1",
    },
    {
      name: "Grace Hopper",
      date: "09/20/2023",
      amount: 200,
      source: "Event 1",
    },
    {
      name: "Carl Sagan",
      date: "08/05/2023",
      amount: 750,
      source: "Event 2",
    },
    {
      name: "Marie Curie",
      date: "11/01/2023",
      amount: 500,
      source: "Donation",
    },
    {
      name: "Gregor Mendel",
      date: "10/15/2023",
      amount: 120,
      source: "Event 1",
    },
    {
      name: "Leonardo da Vinci",
      date: "08/05/2023",
      amount: 750,
      source: "Event 2",
    },
  ];

  const [funds, setFunds] = useState([] as Fund[]);

  useEffect(() => {
    // clear funds so it doesn't add every time the page is re-rendered
    setFunds([]);
    dummy_funds?.forEach((fund: any) => {
      setFunds((funds) => [
        ...funds,
        {
          name: fund.name,
          date: fund.date,
          amount: fund.amount,
          source: fund.source,
        },
      ]);
    });
  }, [dummy_funds]);

  const totalAmount = funds.reduce((total, fund) => total + fund.amount, 0);

  const groups = (function () {
    if (funds && funds.length > 0) {
      if (filter === "source") {
        const uniques = [...new Set(funds?.map((u: any) => u["source"]))]; // array of unique vals
        const emap = new Map(uniques.map((e: any) => [e, new Array()])); // map of val to empty array
        funds?.forEach(
          (e: any) =>
            emap.get(e["source"])?.push({
              name: e["name"],
              date: e["date"],
              amount: e["amount"],
              source: e["source"],
            }),
        );
        return uniques
          ?.map((e: string) => ({
            title: e,
            funds: emap.get(e),
          }))
          .sort((a, b) => a.title.localeCompare(b.title));
      } else if (filter === "highest amount") {
        // Sort by amount descending (highest to lowest)
        funds.sort((a, b) => b.amount - a.amount);
        return [{ title: "Highest to Lowest", funds: funds }];
      } else if (filter === "lowest amount") {
        // Sort by amount ascending (lowest to highest)
        funds.sort((a, b) => a.amount - b.amount);
        return [{ title: "Lowest to Highest", funds: funds }];
      } else {
        // Sort by date ascending (earliest to latest)
        funds.sort((a, b) => {
          // Convert dates to timestamps explicitly
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        return [{ title: "Date", funds: funds }];
      }
    } else {
      return [];
    }
  })();

  const groupsRendered = groups.map((gr: any) => (
    <FundList key={gr.title} {...gr} />
  ));

  return (
    <Box>
      <Sidebar chapter={dummyChapter} year={dummyYear} retreatId={"dummy"} />
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
            RAISED FUNDS
          </Heading>
          <Box>
            <Popover
              placement="bottom-end"
              isOpen={isOpenFilterPopover}
              onClose={onCloseFilterPopover}
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
                      : filter == "source"
                      ? "View by Source"
                      : filter == "highest amount"
                      ? "View by Highest Amount"
                      : "View by Lowest Amount"}
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
                    <Box onClick={() => handleFilterClick("source")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Source
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("lowest amount")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Lowest Amount
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("highest amount")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Highest Amount
                      </Text>
                    </Box>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Button
              colorScheme="twitter"
              onClick={onOpenAddFundModal}
              fontWeight="400"
              color="white"
              bg="hop_blue.500"
              fontFamily="oswald"
              height="50px"
              fontSize="20px"
              marginBottom="10px"
            >
              ADD FUND
            </Button>
            <NewFundModal
              isOpen={isOpenAddFundModal}
              onClose={onCloseAddFundModal}
              fundData={{
                name: "",
                date: "",
                amount: 0,
                source: "Select Source",
              }}
              create={true}
            />
          </Box>
        </Flex>
        {groupsRendered}
        <Flex borderBottom="1px #AEAEAE solid"></Flex>
        <Flex paddingBottom="30px" justifyContent="end" alignItems="flex-end">
          <Text paddingBottom="0.5em" paddingRight="0.5em">
            Total Raised Funds:
          </Text>
          <Text fontFamily={fonts.oswald} fontSize="64px" fontWeight="700">
            ${totalAmount}
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
}
