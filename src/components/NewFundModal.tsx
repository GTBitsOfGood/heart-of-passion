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
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RadioDropdown } from "./RadioDropdown";
import { Fund } from "~/common/types";
import { FloatingAlert } from "./FloatingAlert";
import { trpc } from "~/utils/api";

type NewFundProps = {
  isOpen: boolean;
  onClose: () => void;
  fund: Fund | null;
  create: boolean;
  retreatId: string;
};

// Validate and parse date
function isValidDate(dateString: string): boolean {
  const datePattern = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  return datePattern.test(dateString);
}

// Parse amount as a number (dollars with two decimal places)
function parseAmount(amountString: string): number {
  const amount = parseFloat(amountString.replace(/[$,]/g, ""));
  return isNaN(amount) ? 0 : amount;
}

enum FundError {
  None, // No error
  Empty, // Empty user
}

const eventOptions = [
  "Select Source",
  "Donation",
  "Event 1",
  "Event 2",
  "Event 3",
];

export const NewFundModal = ({
  isOpen,
  onClose,
  fund,
  create,
  retreatId,
}: NewFundProps) => {
  // Form Data
  const [name, setName] = useState(fund?fund.name:"");
  const [date, setDate] = useState(fund?fund.date:"");
  const [amount, setAmount] = useState(fund?fund.amount:0);
  const [source, setSource] = useState(fund?fund.source:"Select Source");

  useEffect(() => {
    // clear funds so it doesn't add every time the page is re-rendered
    setName(fund?fund.name:"");
    setDate(fund?fund.date:"");
    setAmount(fund?fund.amount:0);
    setSource(fund?fund.source:"Select Source");
  }, [fund]);

  // Error
  const [amountError, setAmountError] = useState<FundError>(FundError.None);

  const {
    isOpen: isError,
    onClose: onCloseError,
    onOpen: onOpenError,
  } = useDisclosure({ defaultIsOpen: false });

  const trpcUtils = trpc.useContext();
  const updateFund = trpc.fund.updateFund.useMutation({
    onSuccess: () => {
      trpcUtils.fund.invalidate();
    },
  });
  const createFund = trpc.fund.createFund.useMutation({
    onSuccess: () => {
      trpcUtils.fund.invalidate();
    },
  });
  const deleteFund = trpc.fund.deleteFund.useMutation({
    onSuccess: () => {
      trpcUtils.fund.invalidate();
    },
  });


  const onCloseModal = () => {
    onClose();
  };

  const handleSave = () => {
    if (!amount) {
      setAmountError(FundError.Empty);
      return false; // Return false to prevent saving
    }
    // console.log(retreatId);
    // console.log(date);
    // console.log(name);
    console.log(fund?._id);
    console.log(fund);
    console.log(create);
    if (create) createFund.mutate({ retreatId: retreatId, fundDetails: { name: name, date: date, amount: amount, source: source} });
    else updateFund.mutate({fundId: fund?._id!, updates: { name: name, date: date, amount: amount, source: source} });
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
      setAmountError(FundError.Empty);
    } else {
      setAmountError(FundError.None);
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
              <FormControl>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Name*
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
              <FormControl>
                <FormLabel
                  fontFamily="body"
                  fontSize="16px"
                  fontWeight="600"
                  mb="4px"
                >
                  Source*
                </FormLabel>
                <RadioDropdown
                  options={eventOptions}
                  selectedOption={source}
                  setSelectedOption={handleSourceChange}
                />
                <FormErrorMessage minHeight="20px" />
              </FormControl>
            </HStack>
            <HStack align="start" spacing="55px">
              <FormControl>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Date*
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
                  <FormErrorMessage mt={0}></FormErrorMessage>
                </Box>
              </FormControl>
              <FormControl isInvalid={amountError !== FundError.None}>
                <FormLabel
                  fontFamily="body"
                  fontSize="16px"
                  fontWeight="600"
                  mb="4px"
                >
                  Amount*
                </FormLabel>
                <Input
                  placeholder="$150"
                  color="#black"
                  _placeholder={{ color: "#666666" }}
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  width="182px"
                  height="30px"
                  value={amount}
                  onChange={handleAmountChange}
                  type="text"
                  required
                />
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
        {isError && <FloatingAlert onClose={onCloseError} />}
      </ModalContent>
    </Modal>
  );
};
