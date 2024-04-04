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
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Expense, expenseSchema, expenseTypeSchema } from "~/common/types";
import { useState, useEffect, ChangeEvent } from "react";
import { trpc } from "~/utils/api";

import { useReducer } from "react";
import { z } from "zod";

type NewNotesFormProps = {
  notes: string;
  setNotes: (e: string) => void;
};

export const NewNotesForm = ({
  notes,
  setNotes,
  ...rest
}: NewNotesFormProps) => {

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  }
    // dispatch({ type: "UPDATE_EXPENSE", field: "notes", value: e.target.value });

  return (
    <VStack height="100%" justifyContent="space-between">
      <VStack alignItems="start" spacing="0px" w="100%">
        {/* <FormControl isRequired isInvalid={!valid}>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Notes
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
        </FormControl> */}
        
        <FormControl mt="18px">
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Notes
          </FormLabel>
          <Textarea
            color="black"
            border="1px solid #D9D9D9"
            borderRadius="0px"
            width="100%"
            value={notes}
            onChange={handleNotesChange}
            padding="10px"
            resize="none"
            height="150px"
          />
        </FormControl>
        
      </VStack>
    
    </VStack>
  );
};
