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
  Select,
  Text,
  VStack,
  useDisclosure,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useReducer, useState } from "react";
import { DropdownIcon } from "~/common/theme/icons";
import { NewTimeForm } from "./NewTimeForm";
import { FloatingAlert } from "./FloatingAlert";
import { NewExpenseForm } from "./NewExpenseForm";
import { NewExpenseModal } from "./NewExpenseModal";
import { DateObject, Event, Expense, eventSchema } from "~/common/types";
import { IEvent } from "~/server/models/Event";
import { z } from "zod";
import { trpc } from "~/utils/api";

type NewEventProps = {
  isOpen: boolean;
  onClose: () => void;
  event?: IEvent;
  retreatId: string;
};

type Action<T extends keyof Event = keyof Event> =
  | { type: "OPEN_TIME_SIDEBAR" }
  | { type: "OPEN_EXPENSE_SIDEBAR" }
  | { type: "CLOSE_SIDEBAR" }
  | { type: "RESET_FORM"; event: Event | undefined }
  | { type: "UPDATE_EVENT"; field: T; value: Event[T] };

type State = {
  event: Event;
  timeFormOpen: boolean;
  expenseFormOpen: boolean;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_EVENT":
      return {
        ...state,
        event: { ...state.event, [action.field]: action.value },
      };
    case "RESET_FORM":
      if (action.event) return { ...initialState, event: action.event };
      return { ...initialState };
    case "OPEN_TIME_SIDEBAR":
      return { ...state, timeFormOpen: true, expenseFormOpen: false };
    case "OPEN_EXPENSE_SIDEBAR":
      return { ...state, timeFormOpen: false, expenseFormOpen: true };
    case "CLOSE_SIDEBAR":
      return { ...state, timeFormOpen: false, expenseFormOpen: false };
    default:
      return state;
  }
};

const initialState: State = {
  event: {
    name: "",
    energyLevel: undefined,
    location: "",
    dates: [{ day: 1, from: "09:00 am", to: "10:00 am" }],
    expenses: [],
  },

  timeFormOpen: false,
  expenseFormOpen: false,
};

export const NewEventModal = ({
  event: eventToEdit,
  retreatId,
  isOpen,
  onClose,
}: NewEventProps) => {
  let [state, dispatch] = useReducer(
    reducer,
    eventToEdit ? { ...initialState, event: eventToEdit } : initialState,
  );
  const [selectedTime, setSelectedTime] = useState<DateObject>();
  const [selectedExpense, setSelectedExpense] = useState<Expense>();

  const {
    isOpen: isError,
    onClose: onCloseError,
    onOpen: onOpenError,
  } = useDisclosure({ defaultIsOpen: false });

  useEffect(() => {
    if (eventToEdit) {
      dispatch({ type: "RESET_FORM", event: eventToEdit });
    }
  }, [eventToEdit]);

  const sidebarOpen = state.timeFormOpen || state.expenseFormOpen;

  const onCloseModal = () => {
    dispatch({ type: "RESET_FORM", event: eventToEdit });
    onClose();
  };

  const validate = () => {
    try {
      eventSchema.parse(state.event);
      return true;
    } catch (e) {
      let errorDesc = "Unknown Error";
      if (e instanceof z.ZodError) {
        errorDesc = e.issues.map((issue) => issue.message).join("\n");
      }
      toast({
        title: "Error",
        description: errorDesc,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const trpcUtils = trpc.useContext();
  const updateEvent = trpc.event.updateEvent.useMutation({
    onSuccess: () => {
      trpcUtils.event.invalidate();
    },
  });
  const createEvent = trpc.event.createEvent.useMutation({
    onSuccess: () => {
      trpcUtils.event.invalidate();
    },
  });

  const deleteEvent = trpc.event.deleteEvent.useMutation({
    onSuccess: () => {
      trpcUtils.event.invalidate();
    },
  });

  const deleteEventHandler = () => {
    if (eventToEdit) {
      deleteEvent.mutate(eventToEdit._id);
    }
    onCloseModal();
  };

  const toast = useToast();
  const submit = () => {
    if (!validate()) {
      return;
    }

    if (eventToEdit) {
      updateEvent.mutate({ event: state.event, eventId: eventToEdit._id });
    } else {
      console.log(state.event);
      createEvent.mutate({ eventDetails: state.event, retreatId });
    }
    onCloseModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      isCentered
      closeOnOverlayClick={true}
    >
      <ModalOverlay />

      <ModalContent
        // width="494px"
        width={sidebarOpen ? "831px" : "494px"}
        maxWidth={sidebarOpen ? "831px" : "494px"}
        height="879px"
        borderRadius="none"
        boxShadow={"0px 4px 29px 0px #00000040"}
        position="relative"
      >
        <ModalCloseButton
          borderRadius="50%"
          outline="solid"
          width="28px"
          height="28px"
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
                <FormControl marginTop="29px" isRequired>
                  <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
                    Event Name
                  </FormLabel>
                  <Input
                    color="black"
                    border="1px solid #D9D9D9"
                    borderRadius="0px"
                    width="389px"
                    value={state.event.name}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_EVENT",
                        field: "name",
                        value: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <Divider borderColor="black" />
                <FormControl marginTop="29px" isRequired>
                  <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
                    Energy Level
                  </FormLabel>
                  <Select
                    textAlign="left"
                    borderRadius="none"
                    bg="white"
                    border="1px solid"
                    fontSize="18px"
                    fontWeight="400"
                    lineHeight="25px"
                    padding="0px"
                    textColor={"black"}
                    borderColor={"#D9D9D9"}
                    value={state.event.energyLevel}
                    onChange={(e) => {
                      dispatch({
                        type: "UPDATE_EVENT",
                        field: "energyLevel",
                        value: e.target.value,
                      });
                    }}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
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
                    value={state.event.location}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_EVENT",
                        field: "location",
                        value: e.target.value,
                      })
                    }
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
                      dispatch({ type: "OPEN_TIME_SIDEBAR" });
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
                  {state.event.dates.map((t) => {
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

                          dispatch({ type: "OPEN_TIME_SIDEBAR" });
                        }}
                        key={`${t.day}-${t.from}-${t.to}`}
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
                          {<Text>Day {t.day}</Text>}
                          <Text>{`${t.from} - ${t.to}`}</Text>
                        </HStack>
                      </button>
                    );
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
                      dispatch({ type: "OPEN_EXPENSE_SIDEBAR" });
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
                  {state.event.expenses.map((e, i) => {
                    const isSelected = e === selectedExpense;
                    return (
                      <button
                        onClick={() => {
                          setSelectedTime(undefined);
                          setSelectedExpense(e);
                          dispatch({ type: "OPEN_EXPENSE_SIDEBAR" });
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
                  >{`$${state.event.expenses.reduce(
                    (acc, cv) => acc + cv.cost,
                    0,
                  )}`}</Text>
                </HStack>
                <FormControl marginTop="29px">
                  <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
                    Notes
                  </FormLabel>
                  <Textarea
                    color="black"
                    border="1px solid #D9D9D9"
                    borderRadius="0px"
                    height="150px"
                    width="389px"
                    value={state.event.notes}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_EVENT",
                        field: "notes",
                        value: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </VStack>
              {!sidebarOpen && (
                <HStack width="100%" justifyContent="end" mb="34px">
                  <Button
                    fontFamily="heading"
                    fontSize="20px"
                    fontWeight="400"
                    colorScheme="red"
                    color="hop_red.500"
                    variant="outline"
                    onClick={deleteEventHandler}
                    borderRadius="6px"
                    mr="13px"
                  >
                    DELETE
                  </Button>
                  <Button
                    colorScheme="twitter"
                    bg="hop_blue.500"
                    onClick={submit}
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
          {sidebarOpen && (
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
              {state.timeFormOpen && (
                <NewTimeForm
                  times={state.event.dates}
                  setTimes={(updateFn) => {
                    let prevTimes = state.event.dates;
                    let newTimes = updateFn(prevTimes);

                    dispatch({
                      type: "UPDATE_EVENT",
                      field: "dates",
                      value: newTimes,
                    });
                  }}
                  onOpenError={onOpenError}
                  onCloseError={onCloseError}
                  onCloseSide={() => dispatch({ type: "CLOSE_SIDEBAR" })}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                ></NewTimeForm>
              )}
              <NewExpenseForm
                expenses={state.event.expenses}
                setExpenses={(expenses) => {
                  dispatch({
                    type: "UPDATE_EVENT",
                    field: "expenses",
                    value: expenses,
                  });
                }}
                onOpenError={onOpenError}
                onCloseError={onCloseError}
                onCloseSide={() => dispatch({ type: "CLOSE_SIDEBAR" })}
                selectedExpense={selectedExpense}
                setSelectedExpense={(e: Expense | undefined) =>
                  setSelectedExpense(e)
                }
              />
            </ModalBody>
          )}
        </HStack>
        {isError && <FloatingAlert onClose={onCloseError} />}
      </ModalContent>
    </Modal>
  );
};
