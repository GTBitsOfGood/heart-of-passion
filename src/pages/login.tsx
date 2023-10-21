import { Box, Button, Center, Image, VStack } from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import "@fontsource/oswald/600.css";

export default function Login() {
  return (
    <>
      <Center height="100vh">
        <VStack spacing={20}>
          <Image
            src="/logo.png"
            alt="Heart of Passion Incorporated"
            width="200px"
          />
          <Box height="0vh" />
          <Button
            leftIcon={<FaGoogle />}
            color="hop_blue.500"
            variant="outline"
            width="200px"
          >
            Login with Google
          </Button>
        </VStack>
      </Center>
    </>
  );
}
