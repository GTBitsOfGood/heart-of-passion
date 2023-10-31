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
import { DropdownIcon } from "~/common/theme/icons";
import { NewTimeForm } from "./NewTimeForm";
import { FloatingAlert } from "./FloatingAlert";
import { Expense, Time, Times } from "~/common/types/types";
import { NewExpenseForm } from "./NewExpenseForm";
import { NewExpense } from "./NewExpense";

type NewExpenseProps = {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  setExpenses: (e: Expense[]) => void;
  thisExpense: Expense | undefined;
};

export const NewExpenseModal = ({
  isOpen,
  onClose,
  expenses,
  setExpenses,
  thisExpense,
}: NewExpenseProps) => {
  const {
    isOpen: isError,
    onClose: onCloseError,
    onOpen: onOpenError,
  } = useDisclosure({ defaultIsOpen: false });

  const onCloseModal = () => {
    onClose();
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
        width={"494px"}
        maxWidth={"494px"}
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
            paddingLeft="28px"
            paddingRight="28px"
            boxShadow={"0px 4px 29px 0px #00000040"}
          >
            <NewExpenseForm
              expenses={expenses}
              setExpenses={(e: Expense[]) => setExpenses(e)}
              onOpenError={onOpenError}
              onCloseError={onCloseError}
              selectedExpense={thisExpense}
              onCloseSide={onClose}
            />
          </ModalBody>
        </HStack>
        {isError && <FloatingAlert onClose={onCloseError} />}
      </ModalContent>
    </Modal>
  );
};
