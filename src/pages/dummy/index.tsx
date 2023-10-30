import { Button, Stack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { NewChapterModal } from "~/components/NewChapterModal";
import { NewEventModal } from "~/components/NewEventModal";
import { NewRetreatYearModal } from "~/components/NewRetreatYearModal";
import { NewUserModal } from "~/components/NewUserModal";
import Sidebar from "~/components/Sidebar";

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
  const {
    isOpen: isOpenAddYearModal,
    onOpen: onOpenAddYearModal,
    onClose: onCloseAddYearModal,
  } = useDisclosure();

  const finalRef = React.useRef(null);

  let dummyChapter = {
    name: "Atlanta",
    totalCost: 5100,
    fundExpected: 5180,
    fundActual: 2600,
  };

  let dummyYear = 2023;

  return (
    <>
      <Sidebar chapter={dummyChapter} year={dummyYear} focusRef={finalRef}/>
      <Stack
        direction="row"
        spacing={4}
        align={"center"}
        justify={"center"}
        paddingTop="10px"
      >
        <Button
          colorScheme="twitter"
          onClick={onOpenAddUserModal}
          fontWeight="400"
          color="white"
          bg="hop_blue.500"
          fontFamily="oswald"
          height="50px"
          fontSize="20px"
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
          onClick={onOpenAddChapterModal}
          fontWeight="400"
          color="white"
          bg="hop_blue.500"
          fontFamily="oswald"
          height="50px"
          fontSize="20px"
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
