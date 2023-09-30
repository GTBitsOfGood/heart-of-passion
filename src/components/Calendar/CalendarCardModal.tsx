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
import { useState } from "react";
import ExpenseEditor from "./ExpenseEditor";
import { Event as EventT } from "~/common/types/types";
import TimesEditor from "./TimesEditor";

function ButtonLabelRow({ labelText, buttonText }: any) {
  return <Flex direction="row" justify="space-between" align="center">
    <Box>{labelText}</Box>
    <Button>{buttonText}</Button>
  </Flex>
}

type PropT = {
  event: EventT;
  isOpen: boolean;
  onClose: any;
}

export default function CalendarCardModal({ event, isOpen, onClose }: PropT) {
  const [showSide, setShowSide] = useState(true);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Flex>
            <Box flex="1">
              <ModalHeader>
                <Input />
              </ModalHeader>
              <ModalCloseButton />
              Energy Level
              <Select>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
              Location
              <Input />

              <ButtonLabelRow buttonText="ADD TIME" labelText="Dates" />
              <TimesList />

              <ButtonLabelRow buttonText="ADD EXPENSE" labelText="Expenses" />
              <ExpensesList expenses={event.expenses}/>

            </Box>
            {showSide && <Box flexBasis="300px">
              {/* <ExpenseEditor expense={event.expenses?.[0]} /> */}
              <TimesEditor date={event.dates?.[0]}/>
            </Box>}
          </Flex>
              <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
          Add
          </Button>
          <Button variant="ghost">Delete</Button>
        </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
