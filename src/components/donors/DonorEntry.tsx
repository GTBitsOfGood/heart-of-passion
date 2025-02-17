import {
  Image,
  Box,
  Button,
  Grid,
  GridItem,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { Donor } from "~/common/types";
import fonts from "~/common/theme/fonts";
import { NewDonorModal } from "../NewDonorModal";
import { useRef } from "react";
import { useRouter } from "next/router";

interface DonorsProps {
  donor: Donor;
  retreatId: string;
}

export default function DonorEntry({ donor, retreatId }: DonorsProps) {
  const {
    isOpen: isOpenAddDonorModal,
    onOpen: onOpenAddDonorModal,
    onClose: onCloseAddDonorModal,
  } = useDisclosure();

  const { donorName, donorEmail, studentName } = donor;

  return (
    <>
      <HStack
        minHeight="50px"
        height="50px"
        width="100%"
        justifyContent="right"
        alignContent="center"
      >
        <Grid
          alignContent="center"
          height="100%"
          flex={1}
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
                <Image src="/student.png" alt="Student" height="30px" />
                <Box fontFamily={fonts.nunito} minW="10%">
                  {studentName}
                </Box>
              </HStack>
            </Box>
          </GridItem>
          <GridItem colSpan={3}>
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
        </Grid>
        <Button
          colorScheme="twitter"
          fontWeight="400"
          color="white"
          bg="hop_blue.500"
          fontFamily="oswald"
          height="40px"
          fontSize="20px"
          marginBottom="0px"
        >
          {donorEmail ? (
            <a href={`mailto:${donorEmail}`}>EMAIL</a>
          ) : (
            <p>NO EMAIL</p>
          )}
        </Button>
      </HStack>

      <NewDonorModal
        isOpen={isOpenAddDonorModal}
        onClose={onCloseAddDonorModal}
        donorData={donor}
        retreatId={retreatId}
      />
    </>
  );
}
