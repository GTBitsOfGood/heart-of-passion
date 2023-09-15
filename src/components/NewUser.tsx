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
import { RadioDropdown } from "./RadioDropdown";
import { z } from "zod";
import { User } from "~/common/types/types";

type NewUserProps = {
  focusRef: React.MutableRefObject<null>;
  isOpen: boolean;
  onClose: () => void;
};

export const NewUser = ({ focusRef, isOpen, onClose }: NewUserProps) => {
  const permissionOptions = ["Student", "Mentor", "Admin"];
  const [selectedPermission, setSelectedPermission] = useState(
    permissionOptions[0],
  );

  const chapterOptions = ["Atlanta", "Charlotte"];
  const [selectedChapter, setSelectedChapter] = useState(chapterOptions[0]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const emailSchema = z.string().email();

  const [nameError, setNameError] = useState(false);
  // 0 - no error
  // 1 - empty field
  // 2 - invalid email
  const [emailError, setEmailError] = useState(0);

  const onCloseModal = () => {
    setSelectedPermission(permissionOptions[0]);
    setSelectedChapter(chapterOptions[0]);
    setName("");
    setEmail("");
    setNameError(false);
    setEmailError(0);
    onClose();
  };

  const handleSave = () => {
    if (!validateFields()) {
      return false;
    }
    onCloseModal();
    const userObj: User = {
      name: name,
      email: email,
      role: selectedPermission?.toLowerCase() ?? "student",
      ...(selectedPermission!=="Admin" && {chapter: selectedChapter})
    };
    console.log(userObj);
    return true;
  };

  const validateFields = () => {
    let valid = true;

    if (name === "") {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }
    if (email === "") {
      setEmailError(1);
      valid = false;
    } else {
      try {
        emailSchema.parse(email);
        setEmailError(0);
      } catch (e) {
        setEmailError(2);
        valid = false;
      }
    }

    return valid;
  };

  const handlePermissionChange = (permission: string) => {
    setSelectedPermission(permission);
  };

  const handleChapterChange = (chapter: string) => {
    setSelectedChapter(chapter);
  };

  const handleNameChange = (event: React.FormEvent<HTMLInputElement>) =>
    setName(event.currentTarget.value);

  const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) =>
    setEmail(event.currentTarget.value);

  return (
    <Modal
      finalFocusRef={focusRef}
      isOpen={isOpen}
      onClose={onCloseModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width="515px"
        height="332px"
        maxWidth="515px"
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
            <HStack align="start" spacing="55px">
              <FormControl isInvalid={nameError}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Name
                </FormLabel>
                <Input
                  placeholder="Jane Doe"
                  color="#666666"
                  _placeholder={{ color: "#666666" }}
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  width="240px"
                  height="30px"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage mt={0}>Name is required</FormErrorMessage>
                </Box>
              </FormControl>
              <FormControl>
                <FormLabel
                  fontFamily="body"
                  fontSize="16px"
                  fontWeight="600"
                  mb="4px"
                >
                  Permission
                </FormLabel>
                <RadioDropdown
                  options={permissionOptions}
                  selectedOption={
                    selectedPermission ?? (permissionOptions[0] as string)
                  }
                  setSelectedOption={handlePermissionChange}
                />
                <FormErrorMessage minHeight="20px" />
              </FormControl>
            </HStack>
            <HStack align="start" spacing="55px">
              <FormControl isInvalid={emailError !== 0}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Email
                </FormLabel>
                <Input
                  placeholder="jdoe@gmail.com"
                  color="#666666"
                  _placeholder={{ color: "#666666" }}
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  width="240px"
                  height="30px"
                  value={email}
                  onChange={handleEmailChange}
                  type="email"
                  required
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage mt={0}>
                    {emailError === 1 && "Email is required"}
                    {emailError === 2 && "Invalid email"}
                  </FormErrorMessage>
                </Box>
              </FormControl>
              <FormControl isDisabled={selectedPermission === "Admin"}>
                <FormLabel
                  fontFamily="body"
                  fontSize="16px"
                  fontWeight="600"
                  mb="4px"
                >
                  Chapter
                </FormLabel>
                <RadioDropdown
                  options={chapterOptions}
                  selectedOption={
                    selectedChapter ?? (chapterOptions[0] as string)
                  }
                  setSelectedOption={handleChapterChange}
                  isDisabled={selectedPermission === "Admin"}
                />
                <FormErrorMessage minHeight="20px" />
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter pr="14px" pb="30px" pt="0px">
          <Button
            colorScheme="twitter"
            mr="30px"
            onClick={handleSave}
            borderRadius="none"
            fontFamily="heading"
            fontSize="20px"
            fontWeight="400"
          >
            APPLY
          </Button>
          <Button
            fontFamily="heading"
            fontSize="20px"
            fontWeight="400"
            colorScheme="red"
            variant="outline"
            borderRadius="none"
          >
            DELETE
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
