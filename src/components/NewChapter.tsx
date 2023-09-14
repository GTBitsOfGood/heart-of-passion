import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Chapter } from "~/common/types/types";

type NewChapterProps = {
  focusRef: React.MutableRefObject<null>;
  isOpen: boolean;
  onClose: () => void;
};

export const NewChapter = ({ focusRef, isOpen, onClose }: NewChapterProps) => {
  const [chapter, setChapter] = useState("");
  const [year, setYear] = useState("");

  const [chapterError, setChapterError] = useState(false);
  const [yearError, setYearError] = useState(false);

  const onCloseModal = () => {
    setChapter("");
    setYear("")
    setChapterError(false);
    setYearError(false);
    onClose();
  };

  const handleChapterChange = (event: React.FormEvent<HTMLInputElement>) =>
    setChapter(event.currentTarget.value);

  const handleYearChange = (event: React.FormEvent<HTMLInputElement>) =>
    setYear(event.currentTarget.value);

  const handleSave = () => {
    if (!validateFields()) {
      return false;
    }
    onCloseModal();
    const chapterObj: Chapter = {name: chapter, year: year}
    console.log(chapterObj);
    return true;
  };

  const validateFields = () => {
    let valid = true;

    if (chapter === "") {
      setChapterError(true);
      valid = false;
    } else {
      setChapterError(false);
    }
    if (year === "") {
      setYearError(true);
      valid = false;
    } else {
      setYearError(false);
    }
    return valid;
  };

  return (
    <Modal
      finalFocusRef={focusRef}
      isOpen={isOpen}
      onClose={onCloseModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width="327px"
        maxWidth="327px"
        borderRadius="none"
        boxShadow={"0px 4px 29px 0px #00000040"}
      >
        <ModalHeader />
        <ModalCloseButton
          borderRadius="50%"
          outline="solid"
          width="28px"
          height="28px"
        />
        <ModalBody pl="33px" pr="33px" lineHeight="24px">
          <VStack
            fontFamily="body"
            fontSize="16px"
            fontWeight="light"
            alignItems="start"
            spacing="5px"
            mt="24px"
          >
            <FormControl isInvalid={chapterError}>
              <FormLabel textColor="black" fontWeight="600" mb="4px">
                Name of the Chapter
              </FormLabel>
              <Input
                placeholder="Atlanta"
                color="#666666"
                _placeholder={{ color: "#666666" }}
                border="1px solid #D9D9D9"
                borderRadius="0px"
                width="240px"
                height="30px"
                value={chapter}
                onChange={handleChapterChange}
              />
              <Box minHeight="20px" mt={2}>
                <FormErrorMessage mt={0}>Chapter is required</FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl isInvalid={yearError}>
              <FormLabel textColor="black" fontWeight="600" mb="4px">
                Year
              </FormLabel>
              <Input
                placeholder="2022"
                type="number"
                pattern="[0-9]*"
                color="#666666"
                _placeholder={{ color: "#666666" }}
                border="1px solid #D9D9D9"
                borderRadius="0px"
                width="240px"
                height="30px"
                value={year}
                onChange={handleYearChange}
              />
              <Box minHeight="20px" mt={2}>
                <FormErrorMessage mt={0}>Year is required</FormErrorMessage>
              </Box>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter pr="54px" pb="26px" pt="0px">
          <Button
            colorScheme="twitter"
            onClick={handleSave}
            borderRadius="none"
            fontFamily="heading"
            fontSize="20px"
            fontWeight="400"
          >
            APPLY
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
