import { Button, Stack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { NewChapter } from "~/components/NewChapter";
import { NewUser } from "~/components/NewUser";
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
      <Sidebar chapter={dummyChapter} year={dummyYear} />
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
        <NewUser
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
        <NewChapter
          focusRef={finalRef}
          isOpen={isOpenAddChapterModal}
          onClose={onCloseAddChapterModal}
        />
      </Stack>
    </>
  );
}
