import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  useDisclosure,
  Input,
  RadioGroup,
  Radio,
  Textarea,
  useToast,
  Select,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { ZodError, ZodIssue } from "zod";
import { DropdownIcon } from "~/common/theme/icons";
import { Expense, expenseSchema, expenseTypeSchema } from "~/common/types";

type NewExpenseProps = {
  expenses: Expense[];
  setExpenses: (e: Expense[]) => void;
  onOpenError: () => void;
  onCloseError: () => void;
  selectedExpense: Expense | undefined;
};

type State = Expense;

type Action<T extends keyof Expense = keyof Expense> =
  | { type: "UPDATE_EXPENSE"; field: T; value: Expense[T] }
  | { type: "RESET"; expense: Expense | undefined };

const initialState: State = {
  name: "Expense Name",
  type: "Entertainment",
  cost: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "UPDATE_EXPENSE":
      return { ...state, [action.field]: action.value };
    case "RESET":
      if (action.expense) return { ...action.expense };
      return initialState;

    default:
      throw new Error();
  }
}

export const NewExpense = ({
  expenses,
  setExpenses,
  onOpenError,
  onCloseError,
  selectedExpense, // setSelectedExpense,
}: NewExpenseProps) => {
  let [state, dispatch] = useReducer(reducer, initialState);

  const editing = selectedExpense !== undefined;

  const handleExpenseNameChange = (event: React.FormEvent<HTMLInputElement>) =>
    dispatch({
      type: "UPDATE_EXPENSE",
      field: "name",
      value: event.currentTarget.value,
    });
  const handleCostChange = (event: React.FormEvent<HTMLInputElement>) =>
    dispatch({
      type: "UPDATE_EXPENSE",
      field: "cost",
      value: parseFloat(event.currentTarget.value),
    });
  const handleUnitsChange = (event: React.FormEvent<HTMLInputElement>) =>
    dispatch({
      type: "UPDATE_EXPENSE",
      field: "numUnits",
      value: parseInt(event.currentTarget.value),
    });

  useEffect(() => {
    dispatch({ type: "RESET", expense: selectedExpense });
  }, [selectedExpense]);

  const toast = useToast();

  const validate = () => {
    try {
      let parsed = expenseSchema.parse(state);
      return [true, []];
    } catch (err) {
      let issues: ZodIssue[] = [];
      let errorDesc = "Unknown Error";
      if (err instanceof ZodError) {
        errorDesc = err.issues.join("\n");
        issues = err.issues;
      }

      toast({
        title: "Error",
        description: errorDesc,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return [false, issues];
    }
  };

  const handleApply = () => {
    if (!validate()[0]) {
      onOpenError();
      return;
    }
    onCloseError();

    if (editing) {
      const updatedExpenses = expenses.map((e) =>
        e === selectedExpense ? state : e,
      );
      setExpenses(updatedExpenses);
      // setSelectedExpense(undefined);
      return;
    }
    setExpenses([...expenses, state]);
    return;
  };

  const [valid, issues] = validate();
  let expenseTypeOptions = Object.values(expenseTypeSchema.enum);

  return (
    <VStack height="100%" justifyContent="space-between">
      <VStack alignItems="start" spacing="0px">
        <FormControl isRequired isInvalid={!valid}>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Name of Expense
          </FormLabel>
          <Input
            color="black"
            border="1px solid #D9D9D9"
            borderRadius="0px"
            width="220px"
            // height="30px"
            value={state.name}
            onChange={handleExpenseNameChange}
            padding="10px"
            // textColor={expenseNameError ? "#C63636" : "black"}
            borderColor={!valid ? "#C63636" : "#D9D9D9"}
            // required
          />
        </FormControl>
        <FormControl mt="23px" isRequired isInvalid={!valid}>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Expense Type
          </FormLabel>
          <Select
            width="220px"
            textAlign="left"
            borderRadius="none"
            bg="white"
            border="1px solid #D9D9D9"
            fontSize="18px"
            fontWeight="400"
            lineHeight="24px"
            padding="0px"
            paddingLeft="10px"
            textColor={!valid ? "#C63636" : "black"}
            borderColor={!valid ? "#C63636" : "#D9D9D9"}
            value={state.type}
            onChange={(e) => {
              dispatch({
                type: "UPDATE_EXPENSE",
                field: "type",
                value: e.target.value as Expense["type"],
              });
            }}
          >
            {expenseTypeOptions.map((type) => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              );
            })}
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
            width="220px"
            value={state.cost}
            onChange={handleCostChange}
            padding="10px"
          />
        </FormControl>
        <FormControl mt="18px" isRequired>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Per Unit or Flat Cost?
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
            defaultValue="1"
            defaultChecked
          >
            <VStack paddingLeft="24px" alignItems="start" spacing="14px">
              <Radio value="unit">Per Unit</Radio>
              <Radio value="flat">Flat Cost</Radio>
            </VStack>
          </RadioGroup>
        </FormControl>
        <FormControl mt="23px">
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Number of Units
          </FormLabel>
          <Input
            color="black"
            border="1px solid #D9D9D9"
            borderRadius="0px"
            width="220px"
            isDisabled={state.numUnits === undefined}
            value={state.numUnits}
            onChange={handleUnitsChange}
            padding="10px"
            type="number"
          />
        </FormControl>
        {/* <FormControl mt="23px">
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Notes
          </FormLabel>
          <Textarea
            color="black"
            border="1px solid #D9D9D9"
            borderRadius="0px"
            width="220px"
            height="120px"
            maxHeight="120px"
            value={}
            onChange={handleNotesChange}
            padding="10px"
          />
        </FormControl> */}
      </VStack>
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
    </VStack>
  );
};
function setExpenseName(value: string) {
  throw new Error("Function not implemented.");
}
