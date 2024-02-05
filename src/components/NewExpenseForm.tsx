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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Expense, expenseTypeSchema } from "~/common/types";
import { trpc } from '~/utils/api';

import { useReducer } from "react";

type NewExpenseFormProps = {
  expenses?: Expense[];
  setExpenses?: (e: Expense[]) => void;
  onOpenError: () => void;
  onCloseError: () => void;
  onCloseSide?: () => void;
  selectedExpense: Expense | undefined;
  setSelectedExpense?: (t: Expense | undefined) => void;
  retreatId?: string;
};

type Action<T extends keyof Expense = keyof Expense> =
  | { type: "UPDATE_EXPENSE"; field: T; value: Expense[T] }
  | { type: "RESET"; expense?: Expense };

type State = Expense;

const initialState: State = {
  name: "Expense Name",
  type: "Entertainment",
  cost: 0,
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
  ...rest
}: NewExpenseFormProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const create = selectedExpense === undefined;

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
      value: parseFloat(event.currentTarget.value || "0"),
    });
  const handleUnitsChange = (event: React.FormEvent<HTMLInputElement>) =>
    dispatch({
      type: "UPDATE_EXPENSE",
      field: "numUnits",
      value: parseInt(event.currentTarget.value || "1"),
    });
  // const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
  //   dispatch({ type: "UPDATE_EXPENSE", field: "notes", value: e.target.value });

  const validateFields = () => {
    let valid = true;

    if (state === undefined) {
      onOpenError();
      valid = false;
    } else {
      onCloseError();
    }
    return valid;
  };

  const trpcUtils = trpc.useContext();
  const updateExpense = trpc.event.updateExpense.useMutation({
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
      onOpenError();
      return;
    }
    onCloseError();
    // if (onCloseSide) {
    //   onCloseSide();
    // }
    if (create) {
      if (retreatId) {
        await createExpense.mutate({ expenseDetails: state, retreatId });
      } else {
        await createExpense.mutate({ expenseDetails: state });
      }
    } else {
      if (expenses && setExpenses) {
        const updatedExpenses = expenses.map((e) =>
        e === selectedExpense ? state : e,
        );
        setExpenses(updatedExpenses);
        if (setSelectedExpense) {
          setSelectedExpense(undefined);
        }
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
            value={state.cost}
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
        <Button
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
        </Button>
      </VStack>
    </VStack>
  );
};
