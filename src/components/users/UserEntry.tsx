import { Flex, Box } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { User } from "common/types/types";

export default function Users({ name, email, role, chapter }: User) {
  return (
    <>
      <Flex justifyContent="space-around">
        <Box>{name}</Box>
        <Box>{email}</Box>
        <Box
          backgroundColor="lightblue"
          borderRadius=".2em"
          py=".1em"
          px=".5em"
        >
          {role}
        </Box>
        <Box
          backgroundColor="lightblue"
          borderRadius=".2em"
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
