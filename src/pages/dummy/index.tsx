import { Button, Stack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { NewChapter } from "~/components/NewChapter";
import { NewUser } from "~/components/NewUser";

export default function DummyPage() {
  const {
    isOpen: isOpenAddUserModal,
    onOpen: onOpenAddUserModal,
    onClose: onCloseAddUserModal,
  } = useDisclosure();
  const {
    isOpen: isOpenAddChapterModal,
    onOpen: onOpenAddChapterModal,
    onClose: onCloseAddChapterModal,
  } = useDisclosure();

  const finalRef = React.useRef(null);
  return (
    <>
      <Stack
        direction="row"
        spacing={4}
        align={"center"}
        justify={"center"}
        marginTop="10px"
      >
        <Button
          colorScheme="twitter"
          borderRadius="none"
          onClick={onOpenAddUserModal}
          fontFamily="heading"
          fontWeight="400"
          fontSize="24px"
        >
          ADD USER
        </Button>
        <NewUser
          focusRef={finalRef}
          isOpen={isOpenAddUserModal}
          onClose={onCloseAddUserModal}
        />

        <Button
          colorScheme="twitter"
          borderRadius="none"
          onClick={onOpenAddChapterModal}
          fontFamily="heading"
          fontWeight="400"
          fontSize="24px"
        >
          ADD CHAPTER
        </Button>
        <NewChapter
          focusRef={finalRef}
          isOpen={isOpenAddChapterModal}
          onClose={onCloseAddChapterModal}
        />
      </Stack>
    </>
  );
}
