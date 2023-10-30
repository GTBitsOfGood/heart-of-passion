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
  useDisclosure
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RadioDropdown } from "./RadioDropdown";
import { User, Role, userSchema, roleSchema, Chapter } from "~/common/types";
import { trpc } from "~/utils/api";
import { FloatingAlert } from "./FloatingAlert";

type NewUserProps = {
  focusRef: React.MutableRefObject<null>;
  isOpen: boolean;
  onClose: () => void;
  userData: User;
  create: boolean;
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

const roleOptions = Object.values(roleSchema.enum);

export const NewUserModal = ({
  focusRef,
  isOpen,
  onClose,
  userData,
  create,
}: NewUserProps) => {
  // Form Data
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [role, setRole] = useState<Role>(userData.role);
  const [chapter, setChapter] = useState(userData.chapter);

  // Errors
  const [nameError, setNameError] = useState<UserError>(UserError.None);
  const [emailError, setEmailError] = useState<EmailError>(EmailError.None);
  const {
    isOpen: isError,
    onClose: onCloseError,
    onOpen: onOpenError,
  } = useDisclosure({ defaultIsOpen: false });

  // TRPC Queries and Mutations
  const trpcUtils = trpc.useContext();
  const chapters = trpc.chapter.getChapters.useQuery();
  const createUser = trpc.user.createUser.useMutation({
    onSuccess: () => {
      trpcUtils.user.invalidate();
    },
  });

  const updateUser = trpc.user.updateUser.useMutation({
    onSuccess: () => {
      trpcUtils.user.invalidate();
    },
  });

  const deleteUser = trpc.user.deleteUser.useMutation({
    onSuccess: () => {
      trpcUtils.user.invalidate();
    },
  });

  useEffect(() => {
    if (
      chapter === "" &&
      role !== "admin" &&
      chapters.data &&
      chapters.data.length > 0
    ) {
      setChapter(chapters.data[0]!.name);
    }
  }, [chapter, chapters, role]);

  const onCloseModal = () => {
    if (create) {
      setRole("student");
      if (chapters.data && chapters.data.length > 0) {
        setChapter(chapters.data[0]!.name);
      }
      setName("");
      setEmail("");
    }
    setNameError(UserError.None);
    setEmailError(EmailError.None);
    onClose();
  };

  // Create the user in the backend and update the frontend with dummy data temporarily on success
  const handleSave = () => {
    if (!validateFields()) {
      if (emailError !== EmailError.Empty) {
        setEmailError(EmailError.Invalid);
      }
      onOpenError();
      return false;
    }
    const user: User = {
      name,
      email,
      role,
      chapter,
    };
    if (create) {
      createUser.mutate(user);
    } else {
      updateUser.mutate({ email: userData.email, updateData: user });
    }
    onCloseModal();
    return true;
  };

  const handleDelete = () => {
    deleteUser.mutate(userData.email);
    onCloseModal();
    onCloseError();
    return true;
  };

  const validateFields = () => {
    let user: User = {
      name,
      email,
      role,
      chapter,
    };
    setNameError(name === "" ? UserError.Empty : UserError.None)
    setEmailError(email === "" ? EmailError.Empty : EmailError.None)
    return userSchema.safeParse(user).success;
  };

  const handleRoleChange = (role: string) => {
    if (role === "admin") {
      setChapter("");
    }
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
                  options={roleOptions}
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
                  options={chapters.data?.map((ch: Chapter) => ch.name) ?? []}
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
            fontSize="20px"
            fontWeight="400"
            colorScheme="red"
            color="hop_red.500"
            variant="outline"
            mr="15px"
            fontFamily="oswald"
            onClick={handleDelete}
            isDisabled={create}
          >
            DELETE
          </Button>
          <Button
            colorScheme="twitter"
            bg="hop_blue.500"
            onClick={handleSave}
            fontSize="20px"
            fontWeight="400"
            fontFamily="oswald"
            mr="15px"
          >
            APPLY
          </Button>
        </ModalFooter>
        {isError && <FloatingAlert onClose={onCloseError} />}
      </ModalContent>
    </Modal>
  );
};
