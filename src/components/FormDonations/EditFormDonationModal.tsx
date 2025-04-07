import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";

function EditFormDonationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Form Donation</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input placeholder="Date" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Name" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Chapter</FormLabel>
            <Input placeholder="Chapter" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Amount</FormLabel>
            <NumberInput>
              <NumberInputField placeholder="Amount" />
            </NumberInput>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Notes</FormLabel>
            <Textarea placeholder="Notes" />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" mr={3}>
            Delete
          </Button>
          <Button colorScheme="blue" mr={3}>
            Copy to Chapter Funds and Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditFormDonationModal;
