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
import { EditIcon } from "@chakra-ui/icons";
import { Donor } from "~/common/types";
import fonts from "~/common/theme/fonts";
import { NewDonorModal } from "../NewDonorModal";
import { useRef } from "react";
import { useRouter } from "next/router";

interface DonorsProps extends Donor {
  retreatId: string;
}

export default function Donors({
  donorName,
  studentName,
  donorEmail,
  status,
  source,
  sponsorLevel,
  retreatId,
  notes,
}: DonorsProps) {
  const {
    isOpen: isOpenAddDonorModal,
    onOpen: onOpenAddDonorModal,
    onClose: onCloseAddDonorModal,
  } = useDisclosure();
  const finalRef = useRef(null);
  const router = useRouter();

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
          {/* <GridItem colSpan={2} display="flex" justifyContent="end">
          
        </GridItem> */}
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
          <a href={`mailto:${donorEmail}`}>EMAIL</a>
        </Button>
      </HStack>

      <NewDonorModal
        isOpen={isOpenAddDonorModal}
        onClose={onCloseAddDonorModal}
        donorData={{
          donorName: donorName,
          studentName: studentName,
          donorEmail: donorEmail,
          sponsorLevel: sponsorLevel,
          source: source,
          status: status,
          notes: notes,
        }}
        create={false}
        retreatId={retreatId}
      />
    </>
  );
}
