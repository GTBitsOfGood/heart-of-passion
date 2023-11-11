import { Flex, Box, IconButton, useDisclosure } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { User } from "~/common/types";
import fonts from "~/common/theme/fonts";
import { NewUserModal } from "../NewUserModal";
import { useRef } from "react";

export default function Users({ name, email, role, chapter }: User) {
  const {
    isOpen: isOpenAddUserModal,
    onOpen: onOpenAddUserModal,
    onClose: onCloseAddUserModal,
  } = useDisclosure();
  const finalRef = useRef(null);

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
        <IconButton
          aria-label="settings"
          variant="ghost"
          height="40px"
          width="40px"
          icon={<EditIcon onClick={onOpenAddUserModal} />}
        />
        <NewUserModal
          isOpen={isOpenAddUserModal}
          onClose={onCloseAddUserModal}
          userData={{ name: name, email: email, role: role, chapter: chapter }}
          create={false}
        />
      </Flex>
    </>
  );
}
