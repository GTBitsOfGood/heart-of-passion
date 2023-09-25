import {
  Button,
  Heading,
  Grid,
  GridItem,
  Image,
  Box,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import ChapterCard from "~/components/ChapterCard";
import { IoMdSettings } from "react-icons/io";
import "@fontsource/oswald/600.css";
import { NewChapter } from "~/components/NewChapter";
import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { Chapter } from "common/types/types";

export default function Home() {
  const {
    isOpen: isOpenAddChapterModal,
    onOpen: onOpenAddChapterModal,
    onClose: onCloseAddChapterModal,
  } = useDisclosure();
  const finalRef = useRef(null);

  let chapter = api.chapter.getChapters.useQuery().data?.message;

  const [chapters, setChapters] = useState([] as Chapter[]);

  useEffect(() => {
    setChapters(chapter as Chapter[]);
  }, [chapter]);

  function updateChapters(data: Chapter): void {
    const newChapters = [...chapters, data];
    setChapters(newChapters);
  }

  return (
    <Box m="2%">
      <Grid templateColumns="repeat(8, 1fr)" mb="3%">
        <GridItem>
          <Image src="/logo.png" alt="Heart of Passion Logo" height="120px" />
        </GridItem>
        <GridItem alignSelf="flex-end" colSpan={5}>
          <Heading fontFamily="oswald">SELECT A CHAPTER</Heading>
        </GridItem>
        <GridItem alignSelf="flex-end">
          <Button
            color="white"
            bgColor="#54A9DD"
            fontFamily="oswald"
            height="50px"
            fontSize="20px"
            onClick={onOpenAddChapterModal}
          >
            ADD CHAPTER
          </Button>
          <NewChapter
            focusRef={finalRef}
            isOpen={isOpenAddChapterModal}
            onClose={onCloseAddChapterModal}
            updateChapters={updateChapters}
          />
        </GridItem>
        <GridItem alignSelf="flex-end">
          <IconButton
            aria-label="settings"
            variant="ghost"
            height="50px"
            width="50px"
            icon={<IoMdSettings size="50px" onClick={() => {}} />}
          />
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={6} ml="10%" mr="10%">
        {chapters?.map((chapter: Chapter) => (
          <GridItem>
            <ChapterCard name={chapter.name.toUpperCase()} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
