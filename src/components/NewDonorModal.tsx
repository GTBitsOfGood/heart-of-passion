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
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { RadioDropdown } from "./RadioDropdown";
import {
  Donor,
  donorSchema,
  SponsorLevel,
  statusDonorSchema,
  sponsorLevelSchema,
} from "~/common/types";
import { trpc } from "~/utils/api";
import { FloatingAlert } from "./FloatingAlert";
import { TRPCError } from "@trpc/server";

type NewDonorProps = {
  isOpen: boolean;
  onClose: () => void;
  donorData: Donor;
  create: boolean;
  retreatId: string;
};

enum EmailError {
  None, // No error
  Empty, // Empty email
  Invalid, // Invalid email
  Exists, // Email already exists
}

enum DonorError {
  None, // No error
  Empty, // Empty donor
}

enum StudentError {
  None, // No error
  Empty, // Empty donor
}

enum SourceError {
  None, // No error
  Empty, // Empty donor
}

export const NewDonorModal = ({
  isOpen,
  onClose,
  donorData,
  retreatId,
  create,
}: NewDonorProps) => {
  // Form Data
  const [donorName, setDonorName] = useState(donorData.donorName);
  const [studentName, setStudentName] = useState(donorData.studentName);
  const [donorEmail, setDonorEmail] = useState(donorData.donorEmail);
  const [status, setStatus] = useState(donorData.status);
  const [source, setSource] = useState(donorData.source);
  const [sponsorLevel, setSponsorLevel] = useState<SponsorLevel>(
    donorData.sponsorLevel,
  );
  const [notes, setNotes] = useState(donorData.notes ?? "");

  // Options
  const SponsorLevelOptions = Object.values(sponsorLevelSchema.enum);
  const StatusOptions = Object.values(statusDonorSchema.enum);

  // Errors
  const [nameError, setNameError] = useState<DonorError>(DonorError.None);
  const [studentError, setStudentError] = useState<StudentError>(
    StudentError.None,
  );
  const [emailError, setEmailError] = useState<EmailError>(EmailError.None);
  const [sourceError, setSourceError] = useState<SourceError>(SourceError.None);
  const {
    isOpen: isError,
    onClose: onCloseError,
    onOpen: onOpenError,
  } = useDisclosure({ defaultIsOpen: false });

  // TRPC Queries and Mutations
  const trpcUtils = trpc.useUtils();
  const createDonor = trpc.donor.createDonor.useMutation({
    onSuccess: () => {
      trpcUtils.donor.invalidate();
    },
    onError: (error) => {
      
    },
  });

  const updateDonor = trpc.donor.updateDonor.useMutation({
    onSuccess: () => {
      trpcUtils.donor.invalidate();
    },
  });

  const deleteDonor = trpc.donor.deleteDonor.useMutation({
    onSuccess: () => {
      trpcUtils.donor.invalidate();
    },
  });

  useEffect(() => {
    if (isOpen) {
      // Set default values when the modal opens
      if (create) {
        setSponsorLevel("Platinum");
        setStatus("Waiting for Reply");
        setSource("Select Source");
        setDonorName("");
        setStudentName("");
        setDonorEmail("");
        setNotes("");
      } else {
        // Set existing values when editing
        setDonorName(donorData.donorName);
        setStudentName(donorData.studentName);
        setDonorEmail(donorData.donorEmail);
        setStatus(donorData.status);
        setSource(donorData.source);
        setSponsorLevel(donorData.sponsorLevel);
        setNotes(donorData.notes ?? "");
      }
    }
  }, [isOpen, create, donorData]);

  const onCloseModal = () => {
    if (create) {
      setSponsorLevel("Platinum");
      setStatus("Waiting for Reply");
      setSource("Select Source");
      setDonorName("");
      setStudentName("");
      setDonorEmail("");
      setNotes("");
    }
    setNameError(DonorError.None);
    setStudentError(StudentError.None);
    setSourceError(SourceError.None);
    setEmailError(EmailError.None);
    onCloseError();
    onClose();
  };

  // Create the donor in the backend and update the frontend with dummy data temporarily on success
  const handleSave = async () => {
    if (!validateFields()) {
      onOpenError();
      return false;
    }
    const donor: Donor = {
      donorName,
      studentName,
      donorEmail,
      source,
      sponsorLevel,
      status,
      notes,
    };
    if (create) {
      try {
        await createDonor.mutateAsync(donor);
      } catch (e) {
        setEmailError(EmailError.Exists);
        onOpenError();
        return;
      }
    } else {
      updateDonor.mutate({
        donorEmail: donorData.donorEmail,
        updatedDonor: donor,
      });
    }
    onCloseModal();
    return true;
  };

  const handleDelete = () => {
    deleteDonor.mutate(donorData.donorEmail);
    onCloseModal();
    onCloseError();
    return true;
  };

  const validateFields = () => {
    let donor: Donor = {
      donorName,
      studentName,
      donorEmail,
      status,
      source,
      sponsorLevel,
      notes,
    };
    setSourceError(
      source === "Select Source" ? SourceError.Empty : SourceError.None,
    );
    setNameError(donorName === "" ? DonorError.Empty : DonorError.None);
    setStudentError(
      studentName === "" ? StudentError.Empty : StudentError.None,
    );
    setEmailError(donorEmail === "" ? EmailError.Empty : EmailError.None);
    // console.log(donor);
    return donorSchema.safeParse(donor).success;
  };

  const handleSponsorLevelChange = (sponsorLevel: string) => {
    setSponsorLevel(sponsorLevelSchema.parse(sponsorLevel));
  };
  const handleStatusChange = (status: string) => {
    setStatus(statusDonorSchema.parse(status));
  };
  const handleDonorNameChange = (event: React.FormEvent<HTMLInputElement>) =>
    setDonorName(event.currentTarget.value);
  const handleStudentNameChange = (event: React.FormEvent<HTMLInputElement>) =>
    setStudentName(event.currentTarget.value);
  const handleDonorEmailChange = (event: React.FormEvent<HTMLInputElement>) =>
    setDonorEmail(event.currentTarget.value);

  const handleSourceChange = (newSource: string) => setSource(newSource);

  const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setNotes(event.currentTarget.value);

  const sourceOptions = ["Other"].concat(
    trpc.event.getEvents
      .useQuery(retreatId, { enabled: !!retreatId })
      .data?.map((e) => e.name) ?? [],
  );

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} isCentered>
      <ModalOverlay />
      <ModalContent
        width="600px"
        height="550px"
        maxWidth="600px"
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
              <FormControl isInvalid={nameError !== DonorError.None}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Donor Name
                </FormLabel>
                <Input
                  placeholder="Jane Doe"
                  color="black"
                  _placeholder={{ color: "#666666" }}
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  width="240px"
                  height="30px"
                  value={donorName}
                  onChange={handleDonorNameChange}
                  required
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage mt={0}>
                    Donor Name is required
                  </FormErrorMessage>
                </Box>
              </FormControl>
              <FormControl isInvalid={emailError !== EmailError.None}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Donor Email
                </FormLabel>
                <Input
                  placeholder="jdoe@gmail.com"
                  color="#black"
                  _placeholder={{ color: "#666666" }}
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  width="240px"
                  height="30px"
                  value={donorEmail}
                  onChange={handleDonorEmailChange}
                  type="email"
                  required
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage mt={0}>
                    {emailError === EmailError.Empty && "Email is required"}
                    {emailError === EmailError.Invalid && "Invalid email"}
                    {emailError === EmailError.Exists && "Email already exists"}
                  </FormErrorMessage>
                </Box>
              </FormControl>
            </HStack>
            <HStack align="start" spacing="55px">
              <FormControl isInvalid={studentError !== StudentError.None}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Student Name
                </FormLabel>
                <Input
                  placeholder="Jane Doe"
                  color="black"
                  _placeholder={{ color: "#666666" }}
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  width="240px"
                  height="30px"
                  value={studentName}
                  onChange={handleStudentNameChange}
                  required
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage mt={0}>
                    Student Name is required
                  </FormErrorMessage>
                </Box>
              </FormControl>
              <FormControl isInvalid={sourceError !== SourceError.None}>
                <FormLabel
                  fontFamily="body"
                  fontSize="16px"
                  fontWeight="600"
                  mb="4px"
                >
                  Source
                </FormLabel>
                <RadioDropdown
                  options={sourceOptions}
                  selectedOption={source}
                  setSelectedOption={handleSourceChange}
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage mt={0}>Source is required</FormErrorMessage>
                </Box>
              </FormControl>
            </HStack>
            <HStack align="start" spacing="150px">
              <FormControl>
                <FormLabel
                  fontFamily="body"
                  fontSize="16px"
                  fontWeight="600"
                  mb="4px"
                >
                  Sponsorship Level
                </FormLabel>
                <RadioDropdown
                  options={SponsorLevelOptions}
                  selectedOption={sponsorLevel}
                  setSelectedOption={handleSponsorLevelChange}
                />
                <FormErrorMessage minHeight="20px" />
              </FormControl>
              <FormControl>
                <FormLabel
                  fontFamily="body"
                  fontSize="16px"
                  fontWeight="600"
                  mb="4px"
                  minWidth="150px"
                >
                  Status
                </FormLabel>
                <RadioDropdown
                  options={StatusOptions}
                  selectedOption={status}
                  setSelectedOption={handleStatusChange}
                />
                <FormErrorMessage minHeight="20px" />
              </FormControl>
            </HStack>
            <FormControl mt="18px">
              <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
                Notes
              </FormLabel>
              <Textarea
                color="black"
                border="1px solid #D9D9D9"
                borderRadius="0px"
                width="100%"
                value={notes}
                onChange={handleNotesChange}
                padding="10px"
                resize="none"
                height="50px"
              />
            </FormControl>
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
