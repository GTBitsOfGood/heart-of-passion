import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { DownArrowIcon, DropdownIcon } from "~/common/icons/icons";
import { NewTimeForm } from "./NewTimeForm";
import { FloatingAlert } from "./FloatingAlert";
import { Expense, Time, Times } from "~/common/types/types";
import { NewExpenseForm } from "./NewExpenseForm";

type NewEventProps = {
  focusRef: React.MutableRefObject<null>;
  isOpen: boolean;
  onClose: () => void;
};

export const NewEventModal = ({ focusRef, isOpen, onClose }: NewEventProps) => {
  const energyLevelOptions = ["High", "Medium", "Low"];
  const [energyLevel, setEnergyLevel] = useState("Select");
  const [location, setLocation] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const [isTimeFormOpen, setIsTimeFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const isSideOpen = isTimeFormOpen || isExpenseFormOpen;

  const [times, setTimes] = useState<Times>({
    "Day 1": [],
    "Day 2": [],
    "Day 3": [],
    "Day 4": [],
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [selectedTime, setSelectedTime] = useState<Time>();
  const [selectedExpense, setSelectedExpense] = useState<Expense>();

  const [energyError, setEnergyError] = useState(false);

  const {
    isOpen: isError,
    onClose: onCloseError,
    onOpen: onOpenError,
  } = useDisclosure({ defaultIsOpen: false });

  const onCloseModal = () => {
    setEnergyLevel("Select");
    setEnergyError(false);
    setLocation("");
    setSelectedTime(undefined);
    setSelectedExpense(undefined);
    setIsTimeFormOpen(false);
    setIsExpenseFormOpen(false);
    setTotalPrice(0);
    setTimes({
      "Day 1": [],
      "Day 2": [],
      "Day 3": [],
      "Day 4": [],
    });
    setExpenses([]);
    onClose();
  };

  const onCloseTimeForm = () => {
    setIsTimeFormOpen(false);
  };
  const onCloseExpenseForm = () => {
    setIsExpenseFormOpen(false);
  };

  const handleLocationChange = (event: React.FormEvent<HTMLInputElement>) =>
    setLocation(event.currentTarget.value);

  const handleApply = () => {
    if (!validateFields()) {
      onOpenError();
      return;
    }
    onCloseError();
    onCloseModal();
  };

  const validateFields = () => {
    if (energyLevel === "Select") {
      setEnergyError(true);
      return false;
    }
    setEnergyError(false);
    return true;
  };

  return (
    <Modal
      finalFocusRef={focusRef}
      isOpen={isOpen}
      onClose={onCloseModal}
      isCentered
      closeOnOverlayClick={true}
    >
      <ModalOverlay />

      <ModalContent
        // width="494px"
        width={isSideOpen ? "831px" : "494px"}
        maxWidth={isSideOpen ? "831px" : "494px"}
        height="879px"
        borderRadius="none"
        boxShadow={"0px 4px 29px 0px #00000040"}
        position="relative"
      >
        {/* <ModalHeader
          fontFamily="heading"
          fontWeight="700"
          alignSelf="center"
          width="389px"
          maxWidth="389px"
          color="#9F9F9F"
          fontSize="36px"
          lineHeight="53px"
          letterSpacing="0em"
          paddingInlineStart="none"
          paddingInlineEnd="none"
          paddingTop="34px"
          paddingBottom="none"
        >
          Enter Event Name
          <Divider borderColor="black" />
        </ModalHeader> */}
        <ModalCloseButton
          borderRadius="50%"
          outline="solid"
          width="28px"
          height="28px"
          // top="20px"
          // left="442px"
        />
        <HStack width="100%" height="100%" spacing="none">
          <ModalBody
            width="494px"
            maxWidth="494px"
            height="100%"
            // alignSelf="center"
            fontFamily="body"
            paddingInlineEnd="none"
            paddingInlineStart="none"
            paddingTop="34px"
            paddingBottom="none"
            paddingLeft="52px"
            paddingRight="52px"
            boxShadow={"0px 4px 29px 0px #00000040"}
          >
            <VStack height="100%" justifyContent="space-between">
              <VStack spacing="0px">
                <Text
                  fontFamily="heading"
                  fontWeight="700"
                  color="#9F9F9F"
                  fontSize="36px"
                  lineHeight="53px"
                  letterSpacing="0em"
                  alignSelf="start"
                >
                  Enter Event Name
                </Text>
                <Divider borderColor="black" />
                <FormControl
                  marginTop="29px"
                  isInvalid={energyError}
                  isRequired
                >
                  <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
                    Energy Level
                  </FormLabel>
                  <Menu>
                    <MenuButton
                      as={Button}
                      width="389px"
                      textAlign="left"
                      borderRadius="none"
                      bg="white"
                      border="1px solid"
                      rightIcon={
                        <DropdownIcon
                          color={energyError ? "#C63636" : "black"}
                          width="31px"
                          height="31px"
                        />
                      }
                      fontSize="18px"
                      fontWeight="400"
                      lineHeight="25px"
                      padding="0px"
                      paddingLeft="10px"
                      textColor={energyError ? "#C63636" : "black"}
                      borderColor={energyError ? "#C63636" : "#D9D9D9"}
                    >
                      {energyLevel}
                    </MenuButton>
                    <MenuList
                      boxShadow={"0px 4px 15px 0px #00000040"}
                      borderRadius="none"
                      width="389px"
                    >
                      <MenuItem
                        onClick={() => {
                          setEnergyLevel("High");
                          setEnergyError(false);
                        }}
                      >
                        High
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setEnergyLevel("Medium");
                          setEnergyError(false);
                        }}
                      >
                        Medium
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setEnergyLevel("Low");
                          setEnergyError(false);
                        }}
                      >
                        Low
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </FormControl>
                <FormControl mt="21px">
                  <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
                    Location
                  </FormLabel>
                  <Input
                    color="black"
                    border="1px solid #D9D9D9"
                    borderRadius="0px"
                    width="389px"
                    // height="30px"
                    value={location}
                    onChange={handleLocationChange}
                    padding="10px"
                    // required
                  />
                </FormControl>
                <HStack width="389px" mt="21px" justifyContent="space-between">
                  <Text
                    fontFamily="body"
                    fontSize="20px"
                    fontWeight="500"
                    lineHeight="27px"
                  >
                    Dates
                  </Text>
                  <Button
                    colorScheme="twitter"
                    bg="hop_blue.500"
                    borderRadius="6px"
                    onClick={() => {
                      setSelectedExpense(undefined);
                      setSelectedTime(undefined);
                      setIsExpenseFormOpen(false);
                      setIsTimeFormOpen(true);
                    }}
                    fontFamily="heading"
                    fontWeight="400"
                    fontSize="16px"
                    lineHeight="23px"
                    minWidth="auto"
                    // maxWidth="auto"
                    width="66px"
                    height="28px"
                  >
                    ADD TIME
                  </Button>
                </HStack>
                <VStack
                  mt="8px"
                  // minHeight="19px"
                  spacing="0px"
                  width="372px"
                  alignItems="end"
                  mb="8px"
                  alignSelf="end"
                  maxHeight="167px"
                  overflowY="scroll"
                  sx={{
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {Object.keys(times).map((k) => {
                    return times[k]?.map((t, i) => {
                      // const isSelected =
                      //   selectedTime?.day === t.day &&
                      //   selectedTime?.start === t.start &&
                      //   selectedTime?.end === t.end;
                      const isSelected = selectedTime === t;

                      return (
                        <button
                          onClick={() => {
                            setSelectedExpense(undefined);
                            setSelectedTime(t);

                            setIsExpenseFormOpen(false);
                            setIsTimeFormOpen(true);
                          }}
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
                            {i === 0 ? <Text>{k}</Text> : <Text />}
                            <Text>{`${t.start} - ${t.end}`}</Text>
                          </HStack>
                        </button>
                      );
                    });
                  })}
                </VStack>

                <HStack width="389px" mt="14px" justifyContent="space-between">
                  <Text
                    fontFamily="body"
                    fontSize="20px"
                    fontWeight="500"
                    lineHeight="27px"
                  >
                    Expenses
                  </Text>
                  <Button
                    colorScheme="twitter"
                    bg="hop_blue.500"
                    borderRadius="6px"
                    onClick={() => {
                      setSelectedTime(undefined);
                      setSelectedExpense(undefined);
                      setIsTimeFormOpen(false);
                      setIsExpenseFormOpen(true);
                    }}
                    fontFamily="heading"
                    fontWeight="400"
                    fontSize="16px"
                    lineHeight="23px"
                    minWidth="auto"
                    // maxWidth="auto"
                    width="89px"
                    height="28px"
                  >
                    ADD EXPENSE
                  </Button>
                </HStack>
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
                  {expenses.map((e) => {
                    const isSelected = e === selectedExpense;
                    return (
                      <button
                        onClick={() => {
                          setSelectedTime(undefined);
                          setSelectedExpense(e);
                          setIsTimeFormOpen(false);
                          setIsExpenseFormOpen(true);
                        }}
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
                <Divider mt="16px" borderColor="black" width="389px" />
                <HStack width="389px" mt="7px" justifyContent="space-between">
                  <Text
                    fontFamily="heading"
                    fontSize="18px"
                    fontWeight="700"
                    lineHeight="27px"
                  >
                    TOTAL
                  </Text>
                  <Text
                    fontSize="18px"
                    fontWeight="400"
                    lineHeight="25px"
                  >{`$${expenses.reduce((acc, cv)=>acc+cv.cost,0)}`}</Text>
                </HStack>
              </VStack>
              {!isSideOpen && (
                <HStack width="100%" justifyContent="end" mb="34px">
                  <Button
                    fontFamily="heading"
                    fontSize="20px"
                    fontWeight="400"
                    colorScheme="red"
                    color="hop_red.500"
                    variant="outline"
                    borderRadius="6px"
                    mr="13px"
                  >
                    DELETE
                  </Button>
                  <Button
                    colorScheme="twitter"
                    bg="hop_blue.500"
                    onClick={handleApply}
                    borderRadius="6px"
                    fontFamily="heading"
                    fontSize="20px"
                    fontWeight="400"
                  >
                    APPLY
                  </Button>
                </HStack>
              )}
            </VStack>
          </ModalBody>
          {isSideOpen && (
            <ModalBody
              padding="none"
              paddingInlineEnd="none"
              paddingInlineStart="none"
              width="337px"
              maxWidth="337px"
              height="100%"
              paddingLeft="61px"
              paddingRight="57px"
              paddingTop="73px"
            >
              {isTimeFormOpen && (
                <NewTimeForm
                  times={times}
                  setTimes={setTimes}
                  onOpenError={onOpenError}
                  onCloseError={onCloseError}
                  onCloseSide={onCloseTimeForm}
                  selectedTime={selectedTime}
                  setSelectedTime={(t: Time | undefined) => setSelectedTime(t)}
                ></NewTimeForm>
              )}
              {isExpenseFormOpen && (
                <NewExpenseForm
                  expenses={expenses}
                  setExpenses={(e: Expense[]) => setExpenses(e)}
                  onOpenError={onOpenError}
                  onCloseError={onCloseError}
                  onCloseSide={onCloseExpenseForm}
                  selectedExpense={selectedExpense}
                  setSelectedExpense={(e: Expense | undefined) =>
                    setSelectedExpense(e)
                  }
                ></NewExpenseForm>
              )}
            </ModalBody>
          )}
        </HStack>
        {isError && <FloatingAlert onClose={onCloseError} />}
      </ModalContent>
    </Modal>
  );
};
