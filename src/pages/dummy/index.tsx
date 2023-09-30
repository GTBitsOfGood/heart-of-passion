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
  return (
    <>
      <Sidebar
        city="Atlanta"
        year={2023}
        totalCost={1234}
        fundExpected={5678}
        fundActual={3456}
      />
      <Stack
        direction="row"
        spacing={4}
        align={"center"}
        justify={"center"}
        paddingTop="10px"
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
        <NewUser
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
        <NewChapter
          focusRef={finalRef}
          isOpen={isOpenAddChapterModal}
          onClose={onCloseAddChapterModal}
        />
      </Stack>
    </>
  );
}
