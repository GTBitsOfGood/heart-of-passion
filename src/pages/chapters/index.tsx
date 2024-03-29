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
import ChapterCard from "~/components/chapters/ChapterCard";
import { IoMdPeople } from "react-icons/io";
import "@fontsource/oswald/600.css";
import { NewChapterModal } from "~/components/NewChapterModal";
import { useRef } from "react";
import { trpc } from "~/utils/api";
import { Chapter } from "~/common/types";
import { useRouter } from "next/router";

export default function Home() {
  const {
    isOpen: isOpenAddChapterModal,
    onOpen: onOpenAddChapterModal,
    onClose: onCloseAddChapterModal,
  } = useDisclosure();
  const finalRef = useRef(null);

  // Get all the chapters from the backend and populate the frontend afterwards
  let chapters = trpc.chapter.getChapters.useQuery();

  const router = useRouter();

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
            bg="hop_blue.500"
            fontFamily="oswald"
            height="50px"
            fontSize="20px"
            onClick={onOpenAddChapterModal}
          >
            ADD CHAPTER
          </Button>
          <NewChapterModal
            isOpen={isOpenAddChapterModal}
            onClose={onCloseAddChapterModal}
            chapterName=""
            create={true}
          />
        </GridItem>
        <GridItem alignSelf="flex-end">
          <IconButton
            aria-label="settings"
            variant="ghost"
            height="50px"
            width="50px"
            icon={
              <IoMdPeople
                size="50px"
                onClick={() => {
                  router.push("/users");
                }}
              />
            }
          />
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={6} ml="10%" mr="10%">
        {chapters.data?.map((chapter: Chapter) => (
          <GridItem key={chapter.name}>
            <ChapterCard chapter={chapter} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
