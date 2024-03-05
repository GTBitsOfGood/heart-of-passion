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
  import Image from "next/image";
  import { TriangleDownIcon, SettingsIcon } from "@chakra-ui/icons";
  import { useEffect, useRef, useState } from "react";
  import TransactionList from "~/components/transactions/TransactionList";
  import { Transaction } from "~/common/types";
  import fonts from "src/common/theme/fonts";
  import { useRouter } from "next/router";
  import { trpc } from "~/utils/api";
  import Sidebar from "~/components/Sidebar";
  
  //Adding
  import Link from "next/link";
  
  export default function Transactions() {
  
    const [filter, setFilter] = useState("date"); // value decides grouping behavior
  
    const {
      isOpen: isOpenFilterPopover,
      onOpen: onOpenFilterPopover,
      onClose: onCloseFilterPopover,
    } = useDisclosure();
  
    const {
      isOpen: isOpenAddTransactionModal,
      onOpen: onOpenAddTransactionModal,
      onClose: onCloseAddTransactionModal,
    } = useDisclosure();
  
    function handleFilterClick(filter: string) {
      setFilter(filter);
      onCloseFilterPopover();
    }
  
    const finalRef = useRef(null);
  
    // Get transaction data from the backend and populate the frontend afterwards
    const transactionData = trpc.transaction.getTransactions.useQuery().data;
    const [transactions, setTransactions] = useState([] as Transaction[]);
  
    // Wait for the data to get fetched and then update transactions list
    useEffect(() => {
      setTransactions(transactionData as Transaction[]);
    }, [transactionData]);
  
    // uses value of filter variable to group transactions by a text property in their class
    const groups = (function () {
      if (transactions && transactions.length > 0) {
        if (filter === "date") {
          // transactions.sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
          transactions.sort((a, b) => {
            const dateA = new Date(a.transactionDate);
            const dateB = new Date(b.transactionDate);
            return dateA.getTime() - dateB.getTime();
          });
          return [{ title: "Date", transactions: transactions }];
        } else if (filter === "chapter") {
          const uniques = [...new Set(transactions?.map((u) => u.chapter))];
          const emap = new Map(uniques.map((e) => [e, new Array()]));
          transactions?.forEach((e) => emap.get(e.chapter)?.push(e));
          return uniques?.map((e) => ({
            title: e,
            transactions: emap.get(e) || [],
          }));
        } else if (filter === "lowestamount") {
          transactions.sort((a, b) => a.amount - b.amount);
        return [{ title: "Lowest to Highest", transactions: transactions }];
        } else {
          transactions.sort((a, b) => b.amount - a.amount);
          return [{ title: "Highest to Lowest", transactions: transactions }];
        }
      } else {
        return [];
      }
    })();
    const groupsRendered = groups.map((gr: any) => (
      <TransactionList includeTitle={false} key={gr.title} {...gr} />
    ));
  
    return (
      <Box>
        <Stack
          spacing={4}
          alignItems={"right"}
          paddingTop="10px"
          paddingRight="5%"
          paddingLeft="5%"
        >
          <Flex
            justifyContent={"space-between"}
            borderBottom="solid 1px black"
            paddingTop={{ base: "7%", "2xl": "4%" }}
          >
            <Heading size="lg" fontFamily={fonts.oswald} fontWeight="extrabold">
              LIST OF DONATIONS
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
                        : filter == "chapter"
                        ? "View by Chapter"
                        : filter == "lowestamount"
                        ? "View by Lowest Amount"
                        : "View by Highest Amount"}
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
                      <Box onClick={() => handleFilterClick("chapter")}>
                        <Text
                          align="right"
                          cursor="pointer"
                          fontFamily={fonts.nunito}
                          fontSize="sm"
                        >
                          Chapter
                        </Text>
                      </Box>
                      <Box onClick={() => handleFilterClick("lowestamount")}>
                        <Text
                          align="right"
                          cursor="pointer"
                          fontFamily={fonts.nunito}
                          fontSize="sm"
                        >
                          Lowest Amount
                        </Text>
                      </Box>
                      <Box onClick={() => handleFilterClick("highestamount")}>
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
            </Box>
          </Flex>
          {groupsRendered}
          <Flex borderBottom="1px #AEAEAE solid"></Flex>
        </Stack>
      </Box>
    );
  }
  