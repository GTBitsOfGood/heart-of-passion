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
  } from "@chakra-ui/react";
  import { ChangeEvent, useEffect, useState } from "react";
  import { DropdownIcon } from "~/common/theme/icons";
  import { Expense, Time, Times } from "~/common/types/types";
  
  type NewExpenseProps = {
    expenses: Expense[];
    setExpenses: (e: Expense[]) => void;
    onOpenError: () => void;
    onCloseError: () => void;
    selectedExpense: Expense | undefined;
    // setSelectedExpense: (t: Expense | undefined) => void;
  };
  
  export const NewExpense = ({
    expenses,
    setExpenses,
    onOpenError,
    onCloseError,
    selectedExpense,
    // setSelectedExpense,
  }: NewExpenseProps) => {
    const [expenseName, setExpenseName] = useState(selectedExpense?.name ?? "");
    const [expenseType, setExpenseType] = useState(
      selectedExpense?.type ?? "Select",
    );
    const [cost, setCost] = useState(
      selectedExpense === undefined ? "" : selectedExpense.cost+"",
    );
    const [costType, setCostType] = useState(selectedExpense?.costType ?? "1");
    const [units, setUnits] = useState(selectedExpense?.units ?? 0);
    const [notes, setNotes] = useState(selectedExpense?.notes ?? "");
  
    const [expenseNameError, setExpenseNameError] = useState(false);
    const [expenseTypeError, setExpenseTypeError] = useState(false);
    const [costError, setCostError] = useState(false);
  
    const expenseTypeOptions = [
      "Entertainment",
      "Food",
      "Transportation",
      "Hotel",
      "Decorations",
      "Miscellaenous",
    ];
    const editing = selectedExpense !== undefined;
  
    const handleExpenseNameChange = (event: React.FormEvent<HTMLInputElement>) =>
      setExpenseName(event.currentTarget.value);
    const handleCostChange = (event: React.FormEvent<HTMLInputElement>) =>
      setCost(event.currentTarget.value);
    const handleUnitsChange = (event: React.FormEvent<HTMLInputElement>) =>
      setUnits(parseInt(event.currentTarget.value));
    const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
      setNotes(e.target.value);
  
    useEffect(() => {
      setExpenseName(selectedExpense?.name ?? "");
      setExpenseType(selectedExpense?.type ?? "Select");
      setCost(selectedExpense === undefined ? "" : selectedExpense.cost+"");
      setCostType(selectedExpense?.costType ?? "1");
      setUnits(selectedExpense?.units ?? 0);
      setNotes(selectedExpense?.notes ?? "");
    }, [selectedExpense]);
  
    const handleApply = () => {
      if (!validateFields()) {
        onOpenError();
        return;
      }
      onCloseError();
      const newExpense: Expense = {
        name: expenseName,
        type: expenseType,
        cost: parseFloat(cost),
        costType: costType,
        units: units,
        notes: notes,
      };
      if (editing) {
        const updatedExpenses = expenses.map((e) =>
          e === selectedExpense ? newExpense : e,
        );
        setExpenses(updatedExpenses);
        // setSelectedExpense(undefined);
        return;
      }
      setExpenses([...expenses, newExpense]);
      return;
    };
  
    const validateFields = () => {
      let valid = true;
      if (expenseName === "") {
        setExpenseNameError(true);
        valid = false;
      } else {
        setExpenseNameError(false);
      }
      if (expenseType === "Select") {
        setExpenseTypeError(true);
        valid = false;
      } else {
        setExpenseTypeError(false);
      }
      // setNameError(expenseName==="");
      // setExpenseTypeError(expenseType === "Select");
  
      let parseCost = cost;
      if (cost[0] === "$") {
        parseCost = cost.substring(1);
      }
      if (parseCost === "" || !/^[0-9]*(\.[0-9]{0,2})?$/.test(parseCost)) {
        setCostError(true);
        valid = false;
      } else {
        setCostError(false);
      }
      return valid;
    };
  
    return (
      <VStack height="100%" justifyContent="space-between">
        <VStack alignItems="start" spacing="0px">
          <FormControl isRequired isInvalid={expenseNameError}>
            <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
              Name of Expense
            </FormLabel>
            <Input
              color="black"
              border="1px solid #D9D9D9"
              borderRadius="0px"
              width="220px"
              // height="30px"
              value={expenseName}
              onChange={handleExpenseNameChange}
              padding="10px"
              // textColor={expenseNameError ? "#C63636" : "black"}
              borderColor={expenseNameError ? "#C63636" : "#D9D9D9"}
              // required
            />
          </FormControl>
          <FormControl mt="23px" isRequired isInvalid={expenseTypeError}>
            <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
              Expense Type
            </FormLabel>
            <Menu>
              <MenuButton
                as={Button}
                width="220px"
                textAlign="left"
                borderRadius="none"
                bg="white"
                border="1px solid #D9D9D9"
                rightIcon={
                  <DropdownIcon
                    color={expenseTypeError ? "#C63636" : "black"}
                    width="31px"
                    height="31px"
                  />
                }
                fontSize="18px"
                fontWeight="400"
                lineHeight="24px"
                padding="0px"
                paddingLeft="10px"
                textColor={expenseTypeError ? "#C63636" : "black"}
                borderColor={expenseTypeError ? "#C63636" : "#D9D9D9"}
              >
                {expenseType}
              </MenuButton>
              <MenuList
                boxShadow={"0px 4px 15px 0px #00000040"}
                borderRadius="none"
                width="220px"
              >
                {expenseTypeOptions.map((type) => {
                  return (
                    <MenuItem
                      key={type}
                      onClick={() => {
                        setExpenseType(type);
                        setExpenseTypeError(false);
                      }}
                    >
                      {type}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          </FormControl>
          <FormControl mt="18px" isRequired isInvalid={costError}>
            <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
              Cost in USD
            </FormLabel>
            <Input
              color="black"
              border="1px solid #D9D9D9"
              borderRadius="0px"
              width="220px"
              // height="30px"
              value={cost}
              onChange={handleCostChange}
              padding="10px"
              // type="number"
              // pattern="^\d*(\.\d{0,2})?$"
              // type="text"
              // required
              textColor={expenseTypeError ? "#C63636" : "black"}
              borderColor={expenseTypeError ? "#C63636" : "#D9D9D9"}
            />
          </FormControl>
          <FormControl mt="18px" isRequired>
            <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
              Per Unit or Flat Cost?
            </FormLabel>
            <RadioGroup
              onChange={setCostType}
              value={costType}
              defaultValue="1"
              defaultChecked
            >
              <VStack paddingLeft="24px" alignItems="start" spacing="14px">
                <Radio value="1">Per Unit</Radio>
                <Radio value="2">Flat Cost</Radio>
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
              // height="30px"
              value={units}
              onChange={handleUnitsChange}
              padding="10px"
              type="number"
              // pattern="^\d*(\.\d{0,2})?$"
              // type="text"
              // required
            />
          </FormControl>
          <FormControl mt="23px">
            <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
              Notes
            </FormLabel>
            <Textarea
              // textAlign="start"
              color="black"
              border="1px solid #D9D9D9"
              borderRadius="0px"
              width="220px"
              height="120px"
              maxHeight="120px"
              // height="30px"
              value={notes}
              onChange={handleNotesChange}
              padding="10px"
              // type="number"
              // pattern="^\d*(\.\d{0,2})?$"
              // type="text"
              // required
            />
          </FormControl>
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
  