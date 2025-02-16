import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { RadioDropdown } from "./RadioDropdown";
import { Fund } from "~/common/types";
import { trpc } from "~/utils/api";

type NewFundProps = {
  isOpen: boolean;
  onClose: () => void;
  fund: Fund | null;
  create: boolean;
  retreatId: string;
};

enum Error {
  None, // No error
  Empty, // Empty user
}

export const NewFundModal = ({
  isOpen,
  onClose,
  fund,
  create,
  retreatId,
}: NewFundProps) => {
  // form data
  const [name, setName] = useState(fund ? fund.name : "");
  const [date, setDate] = useState(fund ? fund.date : "");
  const [amount, setAmount] = useState(fund ? fund.amount : 0);
  const [source, setSource] = useState(fund ? fund.source : "Select Source");

  useEffect(() => {
    // clear funds so it doesn't add every time the page is re-rendered
    setName(fund ? fund.name : "");
    setDate(fund ? fund.date : "");
    setAmount(fund ? fund.amount : 0);
    setSource(fund ? fund.source : "Select Source");
  }, [fund]);

  // Error
  const [nameError, setNameError] = useState<Error>(Error.None);
  const [dateError, setDateError] = useState<Error>(Error.None);
  const [amountError, setAmountError] = useState<Error>(Error.None);
  const [sourceError, setSourceError] = useState<Error>(Error.None);

  const {
    isOpen: isError,
    onClose: onCloseError,
    onOpen: onOpenError,
  } = useDisclosure({ defaultIsOpen: false });

  const trpcUtils = trpc.useUtils();
  const toast = useToast();
  const updateFund = trpc.fund.updateFund.useMutation({
    onSuccess: () => {
      trpcUtils.fund.invalidate();
      trpcUtils.chapter.invalidate();
    },
  });
  const createFund = trpc.fund.createFund.useMutation({
    onSuccess: () => {
      trpcUtils.fund.invalidate();
      trpcUtils.chapter.invalidate();
    },
  });
  const deleteFund = trpc.fund.deleteFund.useMutation({
    onSuccess: () => {
      trpcUtils.fund.invalidate();
      trpcUtils.chapter.invalidate();
    },
  });

  const fundraiserData = trpc.fundraiser.getFundraisers.useQuery(retreatId, {
    enabled: !!retreatId,
  }).data;

  const sourceOptions = useMemo(
    () => ["Other"].concat(fundraiserData?.map((f) => f.name) ?? []),
    [fundraiserData],
  );

  const onCloseModal = () => {
    setNameError(Error.None);
    setDateError(Error.None);
    setAmountError(Error.None);
    setSourceError(Error.None);
    onClose();
  };

  const validateFields = () => {
    setNameError(name === "" ? Error.Empty : Error.None);
    setDateError(date === "" ? Error.Empty : Error.None);
    setAmountError(amount === 0 ? Error.Empty : Error.None);
    setSourceError(source === "Select Source" ? Error.Empty : Error.None);
    return (
      name !== "" && date !== "" && amount !== 0 && source !== "Select Source"
    );
  };

  const handleSave = () => {
    if (!validateFields()) {
      toast({
        title: "ERROR INCOMPLETE FIELDS",
        description: "Fill in the incomplete fields that are outlined in red!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false; // Return false to prevent saving
    }

    if (create)
      createFund.mutate({
        retreatId: retreatId,
        fundDetails: { name: name, date: date, amount: amount, source: source },
      });
    else
      updateFund.mutate({
        fundId: fund?._id!,
        updates: { name: name, date: date, amount: amount, source: source },
      });

    onCloseModal();
    onCloseModal();
    return true;
  };

  const handleDelete = () => {
    deleteFund.mutate(fund?._id!);
    onCloseModal();
    onCloseError();
    return true;
  };

  const handleNameChange = (event: React.FormEvent<HTMLInputElement>) =>
    setName(event.currentTarget.value);
  const handleDateChange = (event: React.FormEvent<HTMLInputElement>) =>
    setDate(event.currentTarget.value);
  const handleSourceChange = (selectedOption: string) =>
    setSource(selectedOption);
  const handleAmountChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    setAmount(Number(inputValue));

    // Validate the input and update the error state
    if (!inputValue) {
      setAmountError(Error.Empty);
    } else {
      setAmountError(Error.None);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} isCentered>
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
              <FormControl isRequired isInvalid={nameError !== Error.None}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Name
                </FormLabel>
                <Input
                  placeholder="Jane Doe"
                  color="black"
                  _placeholder={{ color: "#666666" }}
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  width="182px"
                  height="30px"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage mt={0}>Name is required</FormErrorMessage>
                </Box>
              </FormControl>
              <FormControl isRequired isInvalid={sourceError !== Error.None}>
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
            <HStack align="start" spacing="55px">
              <FormControl isRequired isInvalid={dateError !== Error.None}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Date
                </FormLabel>
                <Input
                  placeholder="2/24/2022"
                  color="#black"
                  _placeholder={{ color: "#666666" }}
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  width="182px"
                  height="30px"
                  value={date}
                  onChange={handleDateChange}
                  type="date"
                  required
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage mt={0}>Date is required</FormErrorMessage>
                </Box>
              </FormControl>
              <FormControl isRequired isInvalid={amountError !== Error.None}>
                <FormLabel
                  fontFamily="body"
                  fontSize="16px"
                  fontWeight="600"
                  mb="4px"
                >
                  Amount
                </FormLabel>
                <InputGroup width="182px" height="30px">
                  <InputLeftAddon height="30px">$</InputLeftAddon>
                  <Input
                    width="182px"
                    height="30px"
                    placeholder="$150"
                    color="#black"
                    _placeholder={{ color: "#666666" }}
                    border="1px solid #D9D9D9"
                    borderRadius="0px"
                    value={amount}
                    onChange={handleAmountChange}
                    type="text"
                    required
                  />
                </InputGroup>
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage mt={0}>Amount is required</FormErrorMessage>
                </Box>
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
      </ModalContent>
    </Modal>
  );
};
