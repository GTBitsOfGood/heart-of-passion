import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  VStack,
  HStack,
  useDisclosure,
  CloseButton,
  Button,
} from "@chakra-ui/react";
import { WarningIcon, XIcon } from "~/common/theme/icons";

type FloatingAlertProps = {
  onClose: () => void;
};

export const FloatingAlert = ({ onClose }: FloatingAlertProps) => {
  return (
    <Box position="absolute" top="0px" right="-313px">
      <Alert
        padding="0px"
        status="error"
        width="300px"
        height="65px"
        bg="#C63636"
        borderRadius="4px"
        boxShadow={"0px 4px 29px 0px #00000040"}
      >
        <HStack width="100%" height="100%" spacing="0px" justifyContent="start">
          <Box width="32px" height="100%">
            <WarningIcon
              position="absolute"
              top="8px"
              left="8px"
              width="16px"
              height="16px"
            />
          </Box>
          <VStack
            alignItems="start"
            spacing="0px"
            textColor="white"
            width="236px"
            maxWidth="236px"
          >
            <AlertDescription
              fontFamily="heading"
              fontSize="12px"
              fontWeight="700"
              lineHeight="17px"
              letterSpacing="0.05em"
              textAlign="left"
            >
              ERROR INCOMPLETE FIELDS
            </AlertDescription>
            <AlertDescription
              fontFamily="body"
              fontWeight="400"
              fontSize="12px"
              lineHeight="16px"
            >
              Fill in the incomplete fields that are outlined in red!
            </AlertDescription>
          </VStack>
        </HStack>
        <XIcon
          // as={Button}
          // color="white"
          cursor="pointer"
          position="absolute"
          width="16px"
          height="16px"
          right="8px"
          top="8px"
          onClick={onClose}
        />
      </Alert>
    </Box>
  );
};
