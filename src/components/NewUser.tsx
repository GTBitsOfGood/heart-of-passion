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
import { useEffect, useState } from "react";
import { RadioDropdown } from "./RadioDropdown";
import { z } from "zod";
import { User, Chapter } from "~/common/types/types";
import { api } from "~/utils/api";

type NewUserProps = {
  focusRef: React.MutableRefObject<null>;
  isOpen: boolean;
  onClose: () => void;
  updateUsers: (user: any) => void;
};

export const NewUser = ({
  focusRef,
  isOpen,
  onClose,
  updateUsers,
}: NewUserProps) => {
  const permissionOptions = ["Student", "Mentor", "Admin"];
  const [selectedPermission, setSelectedPermission] = useState(
    permissionOptions[0],
  );

  // Get the possible chapter to select for the chapter dropdown
  let chapter: any = api.chapter.getChapters.useQuery().data?.message;

  const [chapterOptions, setChapterOptions] = useState([] as string[]);

  const [selectedChapter, setSelectedChapter] = useState("");

  useEffect(() => {
    if (chapter) {
      console.log(chapter);
      setChapterOptions(chapter?.map((chap: Chapter) => chap.name));
      setSelectedChapter(chapter?.at(0).name);
    }
  }, [chapter]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const emailSchema = z.string().email();

  const [nameError, setNameError] = useState(false);
  // 0 - no error
  // 1 - empty field
  // 2 - invalid email
  const [emailError, setEmailError] = useState(0);

  const createUser = api.user.createUser.useMutation();

  const onCloseModal = () => {
    setSelectedPermission(permissionOptions[0]);
    if (chapter) {
      setSelectedChapter(chapter.at(0).name);
    }
    setName("");
    setEmail("");
    setNameError(false);
    setEmailError(0);
    onClose();
  };

  // Create the user in the backend and update the frontend with dummy data temporarily on success
  const handleSave = () => {
    if (!validateFields()) {
      return false;
    }
    const userObj: User = {
      name: name,
      email: email,
      role: selectedPermission?.toLowerCase() ?? "student",
      ...(selectedPermission !== "Admin" && { chapter: selectedChapter }),
    };
    const temp = {
      name: name,
      email: email,
      role: selectedPermission?.toLowerCase() ?? "student",
      ...(selectedPermission !== "Admin" && {
        chapter: { name: selectedChapter },
      }),
    };
    createUser.mutate(userObj, {
      onSuccess: () => {
        updateUsers(temp);
      },
    });
    onCloseModal();
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
                  selectedOption={selectedChapter}
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
