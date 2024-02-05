import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FloatingAlert } from "./FloatingAlert";
import { NewExpenseForm } from "./NewExpenseForm";
import { Expense } from "~/common/types";

type NewExpenseProps = {
  isOpen: boolean;
  onClose: () => void;
  retreatId?: string;
  thisExpense: Expense | undefined;
  thisEvent?: string;
};

export const NewExpenseModal = ({
  isOpen,
  onClose,
  thisExpense,
  retreatId,
  thisEvent
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
              onOpenError={onOpenError}
              onCloseError={onCloseError}
              selectedExpense={thisExpense}
              onCloseSide={onClose}
              retreatId={retreatId}
              thisEvent={thisEvent}
            />
          </ModalBody>
        </HStack>
        {isError && <FloatingAlert onClose={onCloseError} />}
      </ModalContent>
    </Modal>
  );
};
