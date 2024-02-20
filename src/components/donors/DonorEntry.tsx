import { Flex, Image, Box, Button, IconButton, useDisclosure, HStack } from "@chakra-ui/react";
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
      <Flex justifyContent="space-around" alignItems="center" py="0.2em">
        <Box fontFamily={fonts.nunito} minW="10%">
          {donorName}
        </Box>
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
        <Button
              colorScheme="twitter"
              fontWeight="400"
              color="white"
              bg="hop_blue.500"
              fontFamily="oswald"
              height="50px"
              fontSize="20px"
              marginBottom="10px"
            >
              EMAIL
        </Button>
        <IconButton
          aria-label="settings"
          variant="ghost"
          height="40px"
          width="40px"
          icon={<EditIcon onClick={onOpenAddDonorModal} />}
        />
        <NewDonorModal
          isOpen={isOpenAddDonorModal}
          onClose={onCloseAddDonorModal}
          donorData={{ donorName: donorName, studentName: studentName, donorEmail: donorEmail, sponsorLevel: sponsorLevel, source: source, status: status }}
          create={false}
        />
      </Flex>
    </>
  );
}
