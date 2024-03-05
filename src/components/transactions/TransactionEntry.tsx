import {
    Flex,
    Image,
    Box,
    Button,
    Grid,
    GridItem,
    IconButton,
    useDisclosure,
    HStack,
  } from "@chakra-ui/react";
  import { Transaction, Chapter } from "~/common/types";
  import fonts from "~/common/theme/fonts";
  import { NewTransactionModal } from "../NewTransactionModal";
  import { useRef } from "react";
  import { RadioDropdown } from "../RadioDropdown";
  import { trpc } from "../../utils/api";
  
  export default function Transactions({
    transactionId,
    transactionDate,
    amount,
    payerEmail,
    message,
    payerName,
    chapter
  }: Transaction) {
    const {
      isOpen: isOpenAddTransactionModal,
      onOpen: onOpenAddTransactionModal,
      onClose: onCloseAddTransactionModal,
    } = useDisclosure();
    const finalRef = useRef(null);
    
    const trpcUtils = trpc.useContext();

    const chapters = trpc.chapter.getChapters.useQuery();
  
    const updateTransactionChapter = trpc.transaction.updateTransactionChapter.useMutation({
      onSuccess: () => {
        trpcUtils.transaction.invalidate();
      },
    });

    const handleChapterChange = (chapter: string) =>
    updateTransactionChapter.mutate({
      transactionId: transactionId,
      chapter: chapter,
      amount: amount,
    });

    const formattedDate = new Date(transactionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    return (
      <>
        <Grid
          onClick={onOpenAddTransactionModal}
          templateColumns="repeat(9, 1fr)"
          gap={4}
          _hover={{
            backgroundColor: "LightGray",
            cursor: "pointer",
          }}
        >
          <GridItem colSpan={1}>
            <Box fontFamily={fonts.nunito} minW="10%">
              {payerName}
            </Box>
          </GridItem>
          <GridItem colSpan={1}>
            <Box fontFamily={fonts.nunito} minW="20%">
                ${amount}
            </Box>
          </GridItem>
          <GridItem colSpan={2}>
            {formattedDate}
          </GridItem>
          <GridItem colSpan={2} display="flex" justifyContent="flex-start">
            <RadioDropdown
                    options={[...(chapters.data?.map((ch: Chapter) => ch.name) ?? []), "Unclassified"]}
                    selectedOption={chapter}
                    setSelectedOption={handleChapterChange}
            />
          </GridItem>
          <GridItem colSpan={3}>
            <Box fontFamily={fonts.nunito} minW="10%">
              {message}
            </Box>
          </GridItem>
        </Grid>
        <NewTransactionModal
          isOpen={isOpenAddTransactionModal}
          onClose={onCloseAddTransactionModal}
          transactionData={{
            transactionId : transactionId,
            transactionDate : transactionDate,
            amount : amount,
            payerEmail : payerEmail,
            message : message,
            payerName : payerName,
            chapter : chapter,
          }}
          create={false}
        />
      </>
    );
  }
  