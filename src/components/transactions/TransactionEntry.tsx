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
  import { Transaction } from "~/common/types";
  import fonts from "~/common/theme/fonts";
  import { NewTransactionModal } from "../NewTransactionModal";
  import { useRef } from "react";
  
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
                {amount}
            </Box>
          </GridItem>
          <GridItem colSpan={2}>
            {transactionDate}
          </GridItem>
          <GridItem colSpan={1}>
            <Box
            backgroundColor="#DEEBFF"
            borderRadius=".2em"
            fontFamily={fonts.nunito}
            justifySelf="center"
            py=".1em"
            px=".5em"
            >
            {chapter}
            </Box>
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
  