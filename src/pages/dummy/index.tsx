import {
  Button,
  Stack,
  useDisclosure,
  Text,
  HStack,
  VStack,
  Box,
  Center,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { NewChapterModal } from "~/components/NewChapterModal";
import { NewEventModal } from "~/components/NewEventModal";
import { NewRetreatYearModal } from "~/components/NewRetreatYearModal";
import { NewExpenseModal } from "~/components/NewExpenseModal";
import { NewUserModal } from "~/components/NewUserModal";
import Sidebar from "~/components/Sidebar";
import { Expense } from "~/common/types";

export default function DummyPage() {
  const {
    isOpen: isOpenAddUserModal,
    onOpen: onOpenAddUserModal,
    onClose: onCloseAddUserModal,
  } = useDisclosure();
  const {
    isOpen: isOpenAddChapterModal,
    onOpen: onOpenAddChapterModal,
    onClose: onCloseAddChapterModal,
  } = useDisclosure();
  const {
    isOpen: isOpenAddEventModal,
    onOpen: onOpenAddEventModal,
    onClose: onCloseAddEventModal,
  } = useDisclosure();
  const {
    isOpen: isOpenAddYearModal,
    onOpen: onOpenAddYearModal,
    onClose: onCloseAddYearModal,
  } = useDisclosure();

  const {
    isOpen: isOpenAddExpenseModal,
    onOpen: onOpenAddExpenseModal,
    onClose: onCloseAddExpenseModal,
  } = useDisclosure();

  const finalRef = React.useRef(null);
  let dummyRetreat = {
    _id: "65170ad990ce3718cf5a35a9",
    year: 2023,
  };
  let dummyChapter = {
    name: "Atlanta",
    totalCost: 5100,
    fundExpected: 5180,
    fundActual: 2600,
    id: "64fb59fbf5a924e891395df6",
    retreat: dummyRetreat,
  };

  const dummyExpenses: Expense[] = [];
  const [expenses, setExpenses] = useState<Expense[]>(dummyExpenses);
  const [selectedExpense, setSelectedExpense] = useState<Expense>();

  let dummyYear = 2023;

  return (
    <>
      <Sidebar
        chapter={dummyChapter}
        year={dummyYear}
        retreatId={dummyRetreat._id}
      />
      <Stack
        direction="row"
        spacing={4}
        align={"center"}
        justify={"center"}
        paddingTop="10px"
      >
        <Button
          colorScheme="twitter"
          onClick={onOpenAddUserModal}
          fontWeight="400"
          color="white"
          bg="hop_blue.500"
          fontFamily="oswald"
          height="50px"
          fontSize="20px"
        >
          ADD USER
        </Button>
        <NewUserModal
          isOpen={isOpenAddUserModal}
          onClose={onCloseAddUserModal}
          userData={{ name: "", email: "", role: "student", chapter: "" }}
          create={true}
        />

        <Button
          colorScheme="twitter"
          onClick={onOpenAddChapterModal}
          fontWeight="400"
          color="white"
          bg="hop_blue.500"
          fontFamily="oswald"
          height="50px"
          fontSize="20px"
        >
          ADD CHAPTER
        </Button>
        <NewChapterModal
          isOpen={isOpenAddChapterModal}
          onClose={onCloseAddChapterModal}
          chapterName=""
          create={true}
        />
        <Button
          colorScheme="twitter"
          bg="hop_blue.500"
          borderRadius="none"
          onClick={onOpenAddEventModal}
          fontFamily="heading"
          fontWeight="400"
          fontSize="24px"
        >
          ADD EVENT
        </Button>
        <Button
          colorScheme="twitter"
          bg="hop_blue.500"
          borderRadius="none"
          onClick={() => {
            onOpenAddExpenseModal();
            setSelectedExpense(undefined);
          }}
          fontFamily="heading"
          fontWeight="400"
          fontSize="24px"
        >
          ADD EXPENSE
        </Button>
        {/* <NewEventModal

          isOpen={isOpenAddEventModal}
          onClose={onCloseAddEventModal}
        /> */}
        <NewExpenseModal
          isOpen={isOpenAddExpenseModal}
          onClose={onCloseAddExpenseModal}
          setExpenses={setExpenses}
          expenses={expenses}
          thisExpense={selectedExpense}
        />
      </Stack>
      {/* Remove Center element */}
      <Center w="100%">
        <VStack
          mt="8px"
          // minHeight="19px"
          spacing="0px"
          width="372px"
          alignItems="end"
          mb="8px"
          overflowY="scroll"
          sx={{
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
          // height="148px"
          maxHeight="148px"
        >
          {expenses.map((e, i) => {
            const isSelected = e === selectedExpense;
            return (
              <button
                onClick={() => {
                  setSelectedExpense(e);
                  onOpenAddExpenseModal();
                }}
                key={i}
              >
                <HStack
                  width="372px"
                  height="39px"
                  justifyContent="space-between"
                  textColor={isSelected ? "white" : "black"}
                  bg={isSelected ? "hop_blue.500" : "white"}
                  paddingLeft="10px"
                  paddingRight="10px"
                >
                  <Text>{e.name}</Text>
                  <Text>{`$${e.cost}`}</Text>
                </HStack>
              </button>
            );
          })}
        </VStack>
      </Center>
    </>
  );
}
