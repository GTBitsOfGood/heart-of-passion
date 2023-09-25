import { Flex, Box } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { User } from "common/types/types";
import fonts from "common/theme/fonts";

export default function Users({ name, email, role, chapter }: User) {
  return (
    <>
      <Flex justifyContent="space-around" alignItems="center" py="0.2em">
        <Box fontFamily={fonts.nunito} minW="10%">
          {name}
        </Box>
        <Box fontFamily={fonts.nunito} minW="20%">
          {email}
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
          {role}
        </Box>
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
        <EditIcon />
      </Flex>
    </>
  );
}
