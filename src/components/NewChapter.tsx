import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { Dispatch, useState } from "react";
import { Chapter } from "~/common/types/types";
import { api } from "~/utils/api";

type NewChapterProps = {
  focusRef: React.MutableRefObject<null>;
  isOpen: boolean;
  onClose: () => void;
  updateChapters: (data: Chapter) => void;
};

export const NewChapter = ({
  focusRef,
  isOpen,
  onClose,
  updateChapters,
}: NewChapterProps) => {
  const [chapter, setChapter] = useState("");

  const [chapterError, setChapterError] = useState(false);

  const createChapter = api.chapter.createChapter.useMutation();

  const onCloseModal = () => {
    setChapter("");
    setChapterError(false);
    onClose();
  };

  const handleChapterChange = (event: React.FormEvent<HTMLInputElement>) =>
    setChapter(event.currentTarget.value);

  const handleSave = async () => {
    if (!validateFields()) {
      return false;
    }
    await createChapter.mutate(chapter, {
      onSuccess: (newData) => {
        updateChapters(newData.message as Chapter);
      },
    });
    onCloseModal();
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
              <FormErrorMessage>Chapter is required</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter pr="54px" pb="26px" pt="0px">
          <Button
            colorScheme="twitter"
            bg="hop_blue.500"
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
