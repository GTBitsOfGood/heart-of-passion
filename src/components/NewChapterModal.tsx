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
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { trpc } from "~/utils/api";
import { FloatingAlert } from "./FloatingAlert";

type NewChapterProps = {
  focusRef: React.MutableRefObject<null>;
  isOpen: boolean;
  onClose: () => void;
};

export const NewChapterModal = ({ focusRef, isOpen, onClose }: NewChapterProps) => {
  const [chapter, setChapter] = useState("");
  const [chapterError, setChapterError] = useState(false);
  const {
    isOpen: isError,
    onClose: onCloseError,
    onOpen: onOpenError,
  } = useDisclosure({ defaultIsOpen: false });

  const trpcUtils = trpc.useContext();
  const createChapter = trpc.chapter.createChapter.useMutation({
    onSuccess: () => {
      trpcUtils.chapter.invalidate();
    },
  });

  const onCloseModal = () => {
    setChapter("");
    setChapterError(false);
    onClose();
  };

  const handleChapterChange = (event: React.FormEvent<HTMLInputElement>) =>
    setChapter(event.currentTarget.value);

  // Create the new chapter in the backend and update the frontend afterwards
  const handleSave = async () => {
    if (!validateFields()) {
      return false;
    }
    await createChapter.mutate(chapter);
    onCloseModal();
    return true;
  };

  const validateFields = () => {
    let valid = true;

    if (chapter === "") {
      setChapterError(true);
      onOpenError();
      valid = false;
    } else {
      setChapterError(false);
      onCloseError();
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
        height="195px"
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
          </VStack>
        </ModalBody>

        <ModalFooter pr="54px" pb="26px" pt="0px">
          <Button
            colorScheme="twitter"
            bg="hop_blue.500"
            onClick={handleSave}
            fontFamily="oswald"
            fontSize="20px"
            fontWeight="400"
          >
            APPLY
          </Button>
        </ModalFooter>
        {isError && <FloatingAlert onClose={onCloseError} />}
      </ModalContent>
    </Modal>
  );
};
