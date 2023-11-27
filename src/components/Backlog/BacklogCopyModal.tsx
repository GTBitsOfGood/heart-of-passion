import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DateObject, Event } from "~/common/types";

type BacklogCopyModalProps = {
  event: Event | null;
  copyToCurrentRetreat: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export default function BacklogCopyModal({
  copyToCurrentRetreat,
  isOpen,
  onOpen,
  onClose,
}: BacklogCopyModalProps) {
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Copy to Current Retreat?</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button colorScheme="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={copyToCurrentRetreat}>
              Copy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
