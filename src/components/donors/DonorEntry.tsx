import { Flex, Image, Box, Button, Grid, GridItem, IconButton, useDisclosure, HStack } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { Donor } from "~/common/types";
import fonts from "~/common/theme/fonts";
import { NewDonorModal } from "../NewDonorModal";
import { useRef } from "react";

export default function Donors({ donorName, studentName, donorEmail, status, source, sponsorLevel }: Donor) {
  const {
    isOpen: isOpenAddDonorModal,
    onOpen: onOpenAddDonorModal,
    onClose: onCloseAddDonorModal,
  } = useDisclosure();
  const finalRef = useRef(null);

  return (
    <>
      <Grid
        onClick={onOpenAddDonorModal}
        templateColumns="repeat(9, 1fr)"
        gap={4}
        _hover={{
          backgroundColor: "LightGray",
          cursor: "pointer",
        }}
      >
        <GridItem colSpan={2}>
          <Box fontFamily={fonts.nunito} minW="10%">
            {donorName}
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box fontFamily={fonts.nunito} minW="20%">
          <HStack>
            <Image
              src="/student.png"
              alt="Student"
              height="30px"
            />
            <Box fontFamily={fonts.nunito} minW="10%">
            {studentName}
            </Box>
          </HStack>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box
            backgroundColor="#DEEBFF"
            borderRadius=".2em"
            fontFamily={fonts.nunito}
            justifySelf="center"
            py=".1em"
            px=".5em"
            textTransform="capitalize"
          >
            {status}
          </Box>
        </GridItem>
        <GridItem colSpan={2} display="flex" justifyContent="end">
          <Button
                colorScheme="twitter"
                fontWeight="400"
                color="white"
                bg="hop_blue.500"
                fontFamily="oswald"
                height="40px"
                fontSize="20px"
                marginBottom="10px"
              >
                EMAIL
          </Button>
        </GridItem>
      </Grid>
        <NewDonorModal
          isOpen={isOpenAddDonorModal}
          onClose={onCloseAddDonorModal}
          donorData={{ donorName: donorName, studentName: studentName, donorEmail: donorEmail, sponsorLevel: sponsorLevel, source: source, status: status }}
          create={false}
        />
    </>
  );
}
