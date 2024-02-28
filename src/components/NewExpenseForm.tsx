import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  HStack,
  VStack,
  Input,
  RadioGroup,
  Select,
  Radio,
  useToast,
} from "@chakra-ui/react";
import { Expense, expenseSchema, expenseTypeSchema } from "~/common/types";
import { useState, useEffect } from "react";
import { trpc } from "~/utils/api";

import { useReducer } from "react";
import { z } from "zod";

type NewExpenseFormProps = {
  expenses?: Expense[];
  setExpenses?: (e: Expense[]) => void;
  onOpenError: () => void;
  onCloseError: () => void;
  onCloseSide?: () => void;
  selectedExpense: Expense | undefined;
  setSelectedExpense?: (t: Expense | undefined) => void;
  retreatId?: string;
  thisEvent?: string;
};

type Action<T extends keyof Expense = keyof Expense> =
  | { type: "UPDATE_EXPENSE"; field: T; value: Expense[T] }
  | { type: "RESET"; expense?: Expense };

type State = Expense;

const initialState: State = {
  name: "Expense Name",
  type: "Entertainment",
  cost: -1000,
};

// const [expense, setExpense] = useState(selectedExpense)

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_EXPENSE":
      return { ...state, [action.field]: action.value };
    case "RESET":
      if (action.expense) return { ...action.expense };
      return initialState;
    default:
      return state;
  }
};

export const NewExpenseForm = ({
  expenses,
  setExpenses,
  onOpenError,
  onCloseError,
  onCloseSide,
  selectedExpense,
  setSelectedExpense,
  retreatId,
  thisEvent,
  ...rest
}: NewExpenseFormProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toast = useToast();
  const editing = selectedExpense !== undefined;
  const create = selectedExpense === undefined;

  const handleExpenseNameChange = (event: React.FormEvent<HTMLInputElement>) =>
    dispatch({
      type: "UPDATE_EXPENSE",
      field: "name",
      value: event.currentTarget.value,
    });
  const handleCostChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value !== "") {
      dispatch({
        type: "UPDATE_EXPENSE",
        field: "cost",
        value: parseFloat(event.currentTarget.value),
      });
    } else {
      dispatch({
        type: "UPDATE_EXPENSE",
        field: "cost",
        value: -1000,
      });
    }
  };

  const handleUnitsChange = (event: React.FormEvent<HTMLInputElement>) =>
    dispatch({
      type: "UPDATE_EXPENSE",
      field: "numUnits",
      value: parseInt(event.currentTarget.value || "1"),
    });
  // const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
  //   dispatch({ type: "UPDATE_EXPENSE", field: "notes", value: e.target.value });

  const validateFields = () => {
    //todo
    // if(state.name)
    try {
      expenseSchema.parse(state);
      // console.log('parse ');
      // console.log(state);
      return true;
    } catch (e) {
      let errorDesc = "Unknown Error";
      if (e instanceof z.ZodError) {
        // console.log(state.event);
        errorDesc = e.issues.map((issue) => issue.message).join("\n");
        // errorDesc = `Please fill all fields marked by asterisk`;
        // console.log(e.issues);
        // console.log(state);
      }
      // onOpenError();
      toast({
        title: "Error",
        description: errorDesc,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    return false;
  };
  const handleDelete = () => {
    if (onCloseSide) {
      onCloseSide();
    }
    // console.log('a');
    const updatedExpenses = (expenses ?? []).filter(
      (e) => e !== selectedExpense,
    );
    setExpenses && setExpenses(updatedExpenses);

    if (setSelectedExpense) {
      setSelectedExpense(undefined);
    }
    dispatch({ type: "RESET" });
    return;
  };

  const trpcUtils = trpc.useContext();
  const updateExpense = trpc.event.updateExpense.useMutation({
    onSuccess: () => {
      trpcUtils.event.invalidate();
    },
  });
  const updateExpenseByEvent = trpc.event.updateExpenseByEvent.useMutation({
    onSuccess: () => {
      trpcUtils.event.invalidate();
    },
  });
  const createExpense = trpc.event.createExpense.useMutation({
    onSuccess: () => {
      trpcUtils.event.invalidate();
    },
  });

  const handleApply = async () => {
    if (!validateFields()) {
      // onOpenError();
      return;
    }
    // onCloseError();
    if (onCloseSide) {
      onCloseSide();
    }
    if (create) {
      if (retreatId) {
        await createExpense.mutate({ expenseDetails: state, retreatId });
      } else {
        await createExpense.mutate({ expenseDetails: state });
      }
    } else {
      if (setExpenses && expenses) {
        const updatedExpenses = expenses.map((e) =>
          e === selectedExpense ? state : e,
        );
        setExpenses(updatedExpenses);
        if (setSelectedExpense) {
          setSelectedExpense(undefined);
        }
        dispatch({ type: "RESET" });
        return;
      } else if (selectedExpense && selectedExpense._id && thisEvent) {
        await updateExpenseByEvent.mutate({
          expense: state,
          expenseId: selectedExpense._id,
          eventId: thisEvent,
        });
      } else if (selectedExpense && selectedExpense._id) {
        await updateExpense.mutate({
          expense: state,
          expenseId: selectedExpense._id,
        });
      }
    }
    if (setExpenses && expenses) {
      setExpenses([...expenses, state]);
    }
    if (onCloseSide) {
      onCloseSide();
    }
    dispatch({ type: "RESET" });
    return;
  };

  useEffect(() => {
    dispatch({ type: "RESET", expense: selectedExpense });
  }, [selectedExpense]);

  const valid = true; // TODO
  let expenseTypeOptions = Object.values(expenseTypeSchema.enum);

  return (
    <VStack height="100%" justifyContent="space-between">
      <VStack alignItems="start" spacing="0px" w="100%">
        <FormControl isRequired isInvalid={!valid}>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Name of Expense
          </FormLabel>
          <Input
            color="black"
            border="1px solid #D9D9D9"
            borderRadius="0px"
            width="100%"
            value={state.name}
            onChange={handleExpenseNameChange}
            padding="10px"
            borderColor={!valid ? "#C63636" : "#D9D9D9"}
          />
        </FormControl>
        <FormControl mt="23px" isRequired isInvalid={!valid}>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Expense Type
          </FormLabel>
          <Select
            value={state.type}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_EXPENSE",
                field: "type",
                value: e.target.value,
              })
            }
            bg="white"
            border="1px solid #D9D9D9"
            fontSize="18px"
            fontWeight="400"
            lineHeight="24px"
            padding="0px"
            textColor={!valid ? "#C63636" : "black"}
            borderColor={!valid ? "#C63636" : "#D9D9D9"}
            borderRadius="none"
            width="100%"
          >
            {expenseTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mt="18px" isRequired isInvalid={!valid}>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Cost in USD
          </FormLabel>
          <Input
            color="black"
            border="1px solid #D9D9D9"
            borderRadius="0px"
            width="100%"
            type="number"
            placeholder="Enter Cost"
            value={state.cost === -1000 ? "" : state.cost.toString()}
            onChange={handleCostChange}
            padding="10px"
            borderColor={!valid ? "#C63636" : "#D9D9D9"}
          />
        </FormControl>
        <FormControl mt="18px">
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Cost Type
          </FormLabel>
          <RadioGroup
            onChange={(e) => {
              let numUnits;
              if (e == "unit") numUnits = state.numUnits ?? 1;
              else numUnits = undefined;

              dispatch({
                type: "UPDATE_EXPENSE",
                field: "numUnits",
                value: numUnits,
              });
            }}
            value={state.numUnits ? "unit" : "flat"}
          >
            <HStack spacing="24px">
              <Radio value="flat">Flat Cost</Radio>
              <Radio value="unit">Per Unit</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>
        <FormControl mt="18px">
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Units
          </FormLabel>
          <Input
            color="black"
            border="1px solid #D9D9D9"
            borderRadius="0px"
            value={state.numUnits ?? 1}
            isDisabled={state.numUnits === undefined}
            width="100%"
            type="number"
            required={state.numUnits !== undefined}
            onChange={handleUnitsChange}
            padding="10px"
          />
        </FormControl>
        {/* <FormControl mt="18px">
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Notes
          </FormLabel>
          <Textarea
            color="black"
            border="1px solid #D9D9D9"
            borderRadius="0px"
            width="100%"
            value={state.notes}
            onChange={handleNotesChange}
            padding="10px"
            resize="none"
            height="100px"
          />
        </FormControl> */}
        {/* <Button
          width="100%"
          height="50px"
          bg="#FF6B6B"
          color="white"
          fontSize="18px"
          fontWeight="500"
          lineHeight="24px"
          borderRadius="none"
          onClick={handleApply}
          marginTop="80px"
        >
          {create ? "Add Expense" : "Update Expense"}
        </Button> */}
      </VStack>
      <HStack width="100%" justifyContent="end" mb="34px">
        {editing && (
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
            {"Delete"}
          </Button>
        )}
        <Button
          colorScheme="twitter"
          bg="hop_blue.500"
          borderRadius="6px"
          fontFamily="heading"
          fontSize="20px"
          fontWeight="400"
          onClick={handleApply}
        >
          {editing ? "Update" : "Add"}
        </Button>
      </HStack>
    </VStack>
  );
};
