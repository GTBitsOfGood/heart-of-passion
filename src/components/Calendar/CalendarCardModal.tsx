import {
  Modal,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Select,
  Flex,
  Box,
} from "@chakra-ui/react";
import TimesList from "./TimesList";
import ExpensesList from "./ExpensesList";

function ButtonLabelRow({ labelText, buttonText }: any) {
  return <Flex direction="row" justify="space-between" align="center">
    <Box>{labelText}</Box>
    <Button>{buttonText}</Button>
  </Flex>
}

export default function CalendarCardModal({ isOpen, onClose }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Input />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Energy Level
          <Select>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          Location
          <Input />
          
          <ButtonLabelRow buttonText="ADD TIME" labelText="Dates"/>
          <TimesList />

          <ButtonLabelRow buttonText="ADD EXPENSE" labelText="Expenses"/>
          <ExpensesList />

        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
