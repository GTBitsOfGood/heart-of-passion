import { Button, Stack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { NewChapterModal } from "~/components/NewChapterModal";
import { NewEventModal } from "~/components/NewEventModal";
import { NewUserModal } from "~/components/NewUserModal";

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
  const {
    isOpen: isOpenAddEventModal,
    onOpen: onOpenAddEventModal,
    onClose: onCloseAddEventModal,
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
          bg="hop_blue.500"
          borderRadius="none"
          onClick={onOpenAddUserModal}
          fontFamily="heading"
          fontWeight="400"
          fontSize="24px"
        >
          ADD USER
        </Button>
        <NewUserModal
          focusRef={finalRef}
          isOpen={isOpenAddUserModal}
          onClose={onCloseAddUserModal}
        />

        <Button
          colorScheme="twitter"
          bg="hop_blue.500"
          borderRadius="none"
          onClick={onOpenAddChapterModal}
          fontFamily="heading"
          fontWeight="400"
          fontSize="24px"
        >
          ADD CHAPTER
        </Button>
        <NewChapterModal
          focusRef={finalRef}
          isOpen={isOpenAddChapterModal}
          onClose={onCloseAddChapterModal}
        />
        <Button
          colorScheme="twitter"
          bg="hop_blue.500"
          borderRadius="none"
          onClick={onOpenAddEventModal}
          fontFamily="heading"
          fontWeight="400"
          fontSize="24px"
        >
          ADD EVENT
        </Button>
        <NewEventModal
          focusRef={finalRef}
          isOpen={isOpenAddEventModal}
          onClose={onCloseAddEventModal}
        />
      </Stack>
    </>
  );
}
