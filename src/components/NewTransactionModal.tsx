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
  import {
    Transaction,
    transactionSchema,
    Chapter,
  } from "~/common/types";
  import { trpc } from "~/utils/api";
  import { FloatingAlert } from "./FloatingAlert";
  
  type NewTransactionProps = {
    isOpen: boolean;
    onClose: () => void;
    transactionData: Transaction;
    create: boolean;
  };
  
  enum PayerError {
    None, // No error
    Empty, // Empty payer
  }
  
  export const NewTransactionModal = ({
    isOpen,
    onClose,
    transactionData,
    create,
  }: NewTransactionProps) => {
    // Form Data
    const [transactionId, setTransactionId] = useState(transactionData.transactionId);
    const [transactionDate, setTransactionDate] = useState(transactionData.transactionDate);
    const [amount, setAmount] = useState(transactionData.amount);
    const [payerEmail, setPayerEmail] = useState(transactionData.payerEmail);
    const [message, setMessage] = useState(transactionData.message);
    const [payerName, setPayerName] = useState(transactionData.payerName);
    const [chapter, setChapter] = useState(transactionData.chapter);
  
    // Errors
    const [nameError, setNameError] = useState<PayerError>(PayerError.None);

    const {
      isOpen: isError,
      onClose: onCloseError,
      onOpen: onOpenError,
    } = useDisclosure({ defaultIsOpen: false });
  
    // TRPC Queries and Mutations
    const trpcUtils = trpc.useContext();
    
    const chapters = trpc.chapter.getChapters.useQuery();

    const updateTransaction = trpc.transaction.updateTransaction.useMutation({
      onSuccess: () => {
        trpcUtils.transaction.invalidate();
      },
    });

    const deleteTransaction = trpc.transaction.deleteTransaction.useMutation({
        onSuccess: () => {
          trpcUtils.transaction.invalidate();
        },
    });

    useEffect(() => {
      if (isOpen) {
        setTransactionId(transactionData.transactionId);
        setTransactionDate(transactionData.transactionDate);
        setAmount(transactionData.amount);
        setPayerEmail(transactionData.payerEmail);
        setMessage(transactionData.message);
        setPayerName(transactionData.payerName);
        setChapter(transactionData.chapter);
      }
    }, [isOpen, create, transactionData]);
  
    const onCloseModal = () => {
      setNameError(PayerError.None);
      onClose();
    };
  
    // Create the transaction in the backend and update the frontend with dummy data temporarily on success
    const handleSave = () => {
      if (!validateFields()) {
        onOpenError();
        return false;
      }
      const transaction: Transaction = {
        transactionId,
        transactionDate,
        amount,
        payerEmail,
        message,
        payerName,
        chapter,
      };
      updateTransaction.mutate({
        transactionId: transactionData.transactionId,
        updatedTransaction: transaction,
      });
      onCloseModal();
      onCloseError();
      return true;
    };
  
    const validateFields = () => {
      let transaction: Transaction = {
        transactionId,
        transactionDate,
        amount,
        payerEmail,
        message,
        payerName,
        chapter,
      };
      setNameError(payerName === "" ? PayerError.Empty : PayerError.None);
      console.log(transactionSchema.safeParse(transaction))
      return transactionSchema.safeParse(transaction).success;
    };

    const handleDelete = () => {
        deleteTransaction.mutate(transactionData.transactionId);
        onCloseModal();
        onCloseError();
        return true;
      };
  
    const handlePayerNameChange = (event: React.FormEvent<HTMLInputElement>) =>
      setPayerName(event.currentTarget.value);
    const handleAmountChange = (event: React.FormEvent<HTMLInputElement>) =>
      setAmount(Number(event.currentTarget.value));
    const handleTransactionDateChange = (event: React.FormEvent<HTMLInputElement>) =>
      setTransactionDate(event.currentTarget.value);
      const handleChapterChange = (chapter: string) =>
      setChapter(chapter);
    
    return (
      <Modal isOpen={isOpen} onClose={onCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent
          width="600px"
          height="400px"
          maxWidth="500px"
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
                <FormControl isInvalid={nameError !== PayerError.None}>
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
                    value={payerName}
                    onChange={handlePayerNameChange}
                    required
                  />
                  <Box minHeight="20px" mt={2}>
                    <FormErrorMessage mt={0}>
                      Name is required
                    </FormErrorMessage>
                  </Box>
                </FormControl>
                <FormControl>
                  <FormLabel
                    fontFamily="body"
                    fontSize="16px"
                    fontWeight="600"
                    mb="4px"
                  >
                    Chapter
                  </FormLabel>
                  <RadioDropdown
                    options={[...(chapters.data?.map((ch: Chapter) => ch.name) ?? []), "Unclassified"]}
                    selectedOption={chapter}
                    setSelectedOption={handleChapterChange}
                  />
              </FormControl>
              </HStack>
              <HStack align="start" spacing="55px">
              <FormControl>
                  <FormLabel textColor="black" fontWeight="600" mb="4px">
                    Amount
                  </FormLabel>
                  <Input
                    placeholder="jdoe@gmail.com"
                    color="#black"
                    _placeholder={{ color: "#666666" }}
                    border="1px solid #D9D9D9"
                    borderRadius="0px"
                    width="240px"
                    height="30px"
                    mb="25px"
                    value={amount}
                    onChange={handleAmountChange}
                    type="email"
                    required
                  />
              </FormControl>
              </HStack>
              <HStack align="start" spacing="55px">
              <FormControl>
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
                    value={transactionDate}
                    onChange={handleTransactionDateChange}
                    type="date"
                    required
                  />
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
  