import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useReducer, useState } from "react";
import { Expense, Fundraiser, fundraiserSchema } from "~/common/types";
import { NewExpenseForm } from "./NewExpenseForm";
import { trpc } from "~/utils/api";
import { IFundraiser } from "~/server/models/Fundraiser";

type FundraisingPlanningModalProps = {
  isOpen: boolean;
  retreatId: string;
  onClose: () => void;
  fundraiser?: IFundraiser;
};

type State = {
  fundraiser: Fundraiser;
  fundraiserId: string | undefined;
  expenseFormOpen: boolean;
};
type Action<T extends keyof Fundraiser = keyof Fundraiser> =
  | { type: "OPEN_EXPENSE_SIDEBAR" }
  | { type: "TOGGLE_EXPENSE_SIDEBAR" }
  | { type: "CLOSE_SIDEBAR" }
  | {
      type: "RESET_FORM";
      fundraiser: Fundraiser | undefined;
      fundraiserId?: string;
    }
  | {
      type: "UPDATE_FUNDRAISER";
      field: T;
      value: Fundraiser[T];
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_FUNDRAISER":
      return {
        ...state,
        fundraiser: { ...state.fundraiser, [action.field]: action.value },
      };
    case "RESET_FORM":
      if (action.fundraiser && action.fundraiserId)
        return {
          ...initialState,
          fundraiser: action.fundraiser,
          fundraiserId: action.fundraiserId,
        };
      return { ...initialState };
    case "OPEN_EXPENSE_SIDEBAR":
      return { ...state, expenseFormOpen: true };
    case "CLOSE_SIDEBAR":
      return { ...state, expenseFormOpen: false };
    case "TOGGLE_EXPENSE_SIDEBAR":
      return { ...state, expenseFormOpen: !state.expenseFormOpen };
    default:
      return state;
  }
};

const initialState: State = {
  fundraiser: {
    name: "Laser Tag",
    location: "",
    date: new Date(),
    contactName: "",
    email: "",
    profit: 0,
    expenses: [],
  },
  fundraiserId: undefined,
  expenseFormOpen: false,
};

export const FundraisingPlanningModal = ({
  isOpen,
  retreatId,
  onClose,
  fundraiser,
}: FundraisingPlanningModalProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedExpense, setSelectedExpense] = useState<Expense>();

  const toast = useToast();

  const onCloseModal = () => {
    onClose();
    dispatch({ type: "RESET_FORM", fundraiser, fundraiserId: fundraiser?._id });
  };
  const sidebarOpen = state.expenseFormOpen;

  const validateFields = () => {
    let parsed = fundraiserSchema.safeParse(state.fundraiser);

    if (parsed.success) return true;

    let description = parsed.error.errors.map((e) => e.message).join("\n");

    toast({
      title: "Error",
      description,
      status: "error",
      isClosable: true,
    });
    return false;
  };

  useEffect(() => {
    if (fundraiser) {
      dispatch({
        type: "RESET_FORM",
        fundraiser,
        fundraiserId: fundraiser._id,
      });
    }
  }, [fundraiser]);

  const trpcUtils = trpc.useUtils();

  const createFundraiser = trpc.fundraiser.createFundraiser.useMutation({
    onSuccess: () => {
      trpcUtils.fundraiser.invalidate();
    },
  });

  const updateFundraiser = trpc.fundraiser.updateFundraiser.useMutation({
    onSuccess: () => {
      trpcUtils.fundraiser.invalidate();
    },
  });

  const deleteFundraiser = trpc.fundraiser.deleteFundraiser.useMutation({
    onSuccess: () => {
      trpcUtils.fundraiser.invalidate();
    },
  });

  const handleDelete = async () => {
    if (fundraiser) await deleteFundraiser.mutate(fundraiser._id);

    onCloseModal();
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    if (fundraiser) {
      await updateFundraiser.mutate({
        fundraiserId: fundraiser._id,
        fundraiser: state.fundraiser,
      });
    } else {
      await createFundraiser.mutate({
        retreatId,
        fundraiserDetails: state.fundraiser,
      });
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
            <VStack height="100%" spacing="0px">
              <FormControl isRequired mt="23px">
                <Input
                  //Enter Fundraiser Name
                  height="53px"
                  minHeight="53px"
                  color="black"
                  border="none"
                  fontSize="36px"
                  fontWeight="700"
                  lineHeight="53px"
                  fontFamily="heading"
                  placeholder="Enter Fundraiser Name"
                  _placeholder={{
                    color: "#9F9F9F",
                  }}
                  outline="none"
                  _focusVisible={{
                    outline: "none",
                  }}
                  value={state.fundraiser.name}
                  onChange={(e) => {
                    dispatch({
                      type: "UPDATE_FUNDRAISER",
                      field: "name",
                      value: e.target.value,
                    });
                  }}
                />
              </FormControl>
              <Divider borderColor="black" />

              <FormControl
                //Location
                marginTop="23px"
              >
                <FormLabel
                  mb="10px"
                  fontWeight="500"
                  fontSize="20px"
                  lineHeight="27px"
                  pointerEvents="none"
                >
                  Location
                </FormLabel>
                <Input
                  color="black"
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  value={state.fundraiser.location}
                  onChange={(e) => {
                    dispatch({
                      type: "UPDATE_FUNDRAISER",
                      field: "location",
                      value: e.target.value,
                    });
                  }}
                ></Input>
              </FormControl>

              <HStack
                //Date - Name of Contact
                mt="23px"
                width="100%"
                justifyContent="space-between"
              >
                <FormControl
                  isRequired
                  //Date
                  width="182px"
                  maxWidth="182px"
                >
                  <FormLabel
                    mb="10px"
                    fontWeight="500"
                    fontSize="20px"
                    lineHeight="27px"
                    pointerEvents="none"
                  >
                    Date
                  </FormLabel>
                  <Input
                    type="date"
                    border="1px solid #D9D9D9"
                    borderRadius="0px"
                    value={state.fundraiser.date.toISOString().split("T")[0]}
                    onChange={(e) => {
                      dispatch({
                        type: "UPDATE_FUNDRAISER",
                        field: "date",
                        value: new Date(e.target.value),
                      });
                    }}
                  />
                </FormControl>
                <FormControl
                  //Name of Contact
                  isRequired
                  width="182px"
                  maxWidth="182px"
                >
                  <FormLabel
                    mb="10px"
                    fontWeight="500"
                    fontSize="20px"
                    lineHeight="27px"
                    pointerEvents="none"
                  >
                    Name of Contact
                  </FormLabel>
                  <Input
                    color="black"
                    border="1px solid #D9D9D9"
                    borderRadius="0px"
                    value={state.fundraiser.contactName}
                    onChange={(e) => {
                      dispatch({
                        type: "UPDATE_FUNDRAISER",
                        field: "contactName",
                        value: e.target.value,
                      });
                    }}
                  ></Input>
                </FormControl>
              </HStack>

              <FormControl isRequired mt="23px">
                <FormLabel
                  mb="10px"
                  fontWeight="500"
                  fontSize="20px"
                  lineHeight="27px"
                  pointerEvents="none"
                >
                  Email
                </FormLabel>
                <Input
                  color="black"
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  value={state.fundraiser.email}
                  onChange={(e) => {
                    dispatch({
                      type: "UPDATE_FUNDRAISER",
                      field: "email",
                      value: e.target.value,
                    });
                  }}
                />
              </FormControl>

              <FormControl isRequired marginTop="22px">
                <FormLabel
                  mb="10px"
                  fontWeight="500"
                  fontSize="20px"
                  lineHeight="27px"
                  pointerEvents="none"
                >
                  Expected Net Profit
                </FormLabel>
                <InputGroup
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  color="black"
                  fontSize="18px"
                  fontWeight="400"
                  lineHeight="25px"
                >
                  <Input
                    value="$"
                    _focusVisible={{ outline: "none" }}
                    paddingInlineEnd="none"
                    border="none"
                    width="auto"
                    paddingInlineStart="none"
                    ml="10px"
                    maxWidth="10px"
                    isReadOnly={true}
                  />
                  <Input
                    type="number"
                    border="none"
                    paddingInlineStart="none"
                    paddingInlineEnd="none"
                    _focusVisible={{ outline: "none" }}
                    value={state.fundraiser.profit}
                    onChange={(e) => {
                      dispatch({
                        type: "UPDATE_FUNDRAISER",
                        field: "profit",
                        value: parseInt(e.target.value),
                      });
                    }}
                  />
                </InputGroup>
              </FormControl>

              <HStack mt="26px" width="100%" justifyContent="space-between">
                <Text
                  //Expenses text
                  fontFamily="body"
                  fontSize="20px"
                  fontWeight="500"
                  lineHeight="27px"
                >
                  Expenses
                </Text>
                <Button
                  //ADD EXPENSE
                  colorScheme="twitter"
                  bg="hop_blue.500"
                  borderRadius="6px"
                  fontFamily="heading"
                  fontWeight="400"
                  fontSize="16px"
                  lineHeight="23px"
                  minWidth="auto"
                  // maxWidth="auto"
                  width="89px"
                  height="28px"
                  onClick={(e) => {
                    if (selectedExpense === undefined) {
                      dispatch({ type: "TOGGLE_EXPENSE_SIDEBAR" });
                      return;
                    }
                    setSelectedExpense(undefined);
                    dispatch({ type: "OPEN_EXPENSE_SIDEBAR" });
                  }}
                >
                  ADD EXPENSE
                </Button>
              </HStack>
              <VStack
                mt="7px"
                alignItems="end"
                alignSelf="end"
                spacing="0px"
                maxHeight="117px"
                overflowY="scroll"
                css={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {state.fundraiser.expenses.map((e, i) => {
                  const isSelected = e === selectedExpense;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedExpense(undefined);
                          dispatch({ type: "CLOSE_SIDEBAR" });
                          return;
                        }
                        setSelectedExpense(e);
                        dispatch({ type: "OPEN_EXPENSE_SIDEBAR" });
                      }}
                    >
                      <HStack
                        width="389px"
                        height="39px"
                        justifyContent="space-between"
                        textColor={isSelected ? "white" : "black"}
                        bg={isSelected ? "hop_blue.500" : "white"}
                        paddingLeft="10px"
                        paddingRight="10px"
                      >
                        <Text
                          fontSize="18px"
                          fontWeight="400"
                          lineHeight="24px"
                        >
                          {e.name}
                        </Text>
                        <Text
                          fontSize="18px"
                          fontWeight="400"
                          lineHeight="24px"
                        >{`$${e.cost * (e.numUnits ? e.numUnits : 1)}`}</Text>
                      </HStack>
                    </button>
                  );
                })}
              </VStack>
              <Divider mt="10px" borderColor="black" />
              <HStack
                mt="7px"
                width="380px"
                justifyContent="space-between"
                alignSelf="end"
              >
                <Text
                  fontFamily="heading"
                  fontSize="18px"
                  fontWeight="700"
                  lineHeight="26px"
                >
                  TOTAL
                </Text>
                <Text
                  fontSize="18px"
                  fontWeight="400"
                  lineHeight="24px"
                  pr="10px"
                >
                  {`$${state.fundraiser.expenses.reduce(
                    (acc, cv) =>
                      acc + cv.cost * (cv.numUnits ? cv.numUnits : 1),
                    0,
                  )}`}
                </Text>
              </HStack>
              <HStack mt="22px" justifyContent="space-between" width="100%">
                <Text
                  fontFamily="heading"
                  fontSize="18px"
                  fontWeight="700"
                  lineHeight="26px"
                >
                  FUNDRAISER EXPECTED
                </Text>
                <Text
                  fontSize="18px"
                  fontWeight="400"
                  lineHeight="24px"
                  pr="10px"
                >
                  {`$${
                    state.fundraiser.expenses.reduce(
                      (acc, cv) =>
                        acc + cv.cost * (cv.numUnits ? cv.numUnits : 1),
                      0,
                    ) + state.fundraiser.profit
                  }`}
                </Text>
              </HStack>
              <HStack alignSelf="end" mt="24px">
                {fundraiser && (
                  <Button
                    fontFamily="heading"
                    fontSize="20px"
                    fontWeight="400"
                    colorScheme="red"
                    color="hop_red.500"
                    variant="outline"
                    onClick={handleDelete}
                    borderRadius="6px"
                    mr="13px"
                  >
                    DELETE
                  </Button>
                )}
                <Button
                  colorScheme="twitter"
                  bg="hop_blue.500"
                  borderRadius="6px"
                  fontFamily="heading"
                  fontSize="20px"
                  fontWeight="400"
                  onClick={handleSubmit}
                >
                  {fundraiser ? "UPDATE" : "CREATE"}
                </Button>
              </HStack>
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
              <NewExpenseForm
                expenses={state.fundraiser.expenses}
                setExpenses={(expenses) => {
                  dispatch({
                    type: "UPDATE_FUNDRAISER",
                    field: "expenses",
                    value: expenses,
                  });
                }}
                onOpenError={() => {}}
                onCloseError={() => {}}
                onCloseSide={() => dispatch({ type: "CLOSE_SIDEBAR" })}
                selectedExpense={selectedExpense}
                setSelectedExpense={(e: Expense | undefined) =>
                  setSelectedExpense(e)
                }
              />
            </ModalBody>
          )}
        </HStack>
      </ModalContent>
    </Modal>
  );
};
