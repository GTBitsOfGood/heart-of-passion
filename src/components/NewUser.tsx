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
import { User, Role, userSchema, roleSchema } from "~/common/types";
import { trpc } from "~/utils/api";

type NewUserProps = {
  focusRef: React.MutableRefObject<null>;
  isOpen: boolean;
  onClose: () => void;
};

enum EmailError {
  None, // No error
  Empty, // Empty email
  Invalid, // Invalid email
}

enum UserError {
  None, // No error
  Empty, // Empty user
}

export const NewUser = ({ focusRef, isOpen, onClose }: NewUserProps) => {
  // Form Data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [chapter, setChapter] = useState("");

  // Errors
  const [nameError, setNameError] = useState<UserError>(UserError.None);
  const [emailError, setEmailError] = useState<EmailError>(EmailError.None);

  // TRPC Queries and Mutations
  const trpcUtils = trpc.useContext();
  const chapters = trpc.chapter.getChapters.useQuery();
  const createUser = trpc.user.createUser.useMutation({
    onSuccess: () => {
      trpcUtils.user.invalidate();
    },
  });

  const onCloseModal = () => {
    setRole("student");
    if (chapters.data && chapters.data.length > 0) {
      setChapter(chapters.data[0]!.name);
    }
    setName("");
    setEmail("");
    setNameError(UserError.None);
    setEmailError(EmailError.None);
    onClose();
  };

  // Create the user in the backend and update the frontend with dummy data temporarily on success
  const handleSave = () => {
    if (!validateFields()) {
      return false;
    }

    const user: User = {
      name,
      email,
      role,
      chapter,
    };

    createUser.mutate(user);
    onCloseModal();
    return true;
  };

  const validateFields = () => {
    let user: User = {
      name,
      email,
      role,
      chapter,
    };

    return userSchema.safeParse(user).success;
  };

  const handleRoleChange = (role: string) => {
    setRole(roleSchema.parse(role));
  };
  const handleChapterChange = (chapter: string) => {
    setChapter(chapter);
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
              <FormControl isInvalid={nameError !== UserError.None}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Name
                </FormLabel>
                <Input
                  placeholder="Jane Doe"
                  color="black"
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
                  options={Object.keys(roleSchema)}
                  selectedOption={role}
                  setSelectedOption={handleRoleChange}
                />
                <FormErrorMessage minHeight="20px" />
              </FormControl>
            </HStack>
            <HStack align="start" spacing="55px">
              <FormControl isInvalid={emailError !== EmailError.None}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Email
                </FormLabel>
                <Input
                  placeholder="jdoe@gmail.com"
                  color="#black"
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
                    {emailError === EmailError.Empty && "Email is required"}
                    {emailError === 2 && "Invalid email"}
                  </FormErrorMessage>
                </Box>
              </FormControl>
              <FormControl isDisabled={role === "admin"}>
                <FormLabel
                  fontFamily="body"
                  fontSize="16px"
                  fontWeight="600"
                  mb="4px"
                >
                  Chapter
                </FormLabel>
                <RadioDropdown
                  options={chapters.data?.map((ch) => ch.name) ?? []}
                  selectedOption={chapter}
                  setSelectedOption={handleChapterChange}
                  isDisabled={role === "admin"}
                />
                <FormErrorMessage minHeight="20px" />
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter pr="14px" pb="30px" pt="0px">
          <Button
            colorScheme="twitter"
            bg="hop_blue.500"
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
            color="hop_red.500"
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
