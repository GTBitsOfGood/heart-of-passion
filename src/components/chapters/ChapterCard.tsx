import { Text, Flex, Spacer, Box, IconButton } from "@chakra-ui/react";
import { BiSolidEdit } from "react-icons/bi";
import "@fontsource/oswald/600.css";
import { Chapter } from "src/common/types";
import ChapterProgress from "./ChapterProgress";
import { NewChapterModal } from "../NewChapterModal";
import { useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import Link from "next/link";

interface ChapterCardProps {
  chapter: Chapter;
}
const ChapterCard = ({ chapter }: ChapterCardProps) => {
  const progress = Math.floor(
    (chapter.fundActual / chapter.fundExpected) * 100,
  );

  const {
    isOpen: isOpenAddChapterModal,
    onOpen: onOpenAddChapterModal,
    onClose: onCloseAddChapterModal,
  } = useDisclosure();
  const finalRef = useRef(null);

  return (
    <Link href={`/chapters/${chapter.id}`}>
      <Box
        bgColor="#F9F9F9"
        border={"2px #EDEDED solid"}
        sx={{ borderRadius: "4%" }}
        h="350px"
        _hover={{ bg: "white", boxShadow: "lg" }}
      >
        <Flex mt="2" mr="2">
          <Spacer />
          <IconButton
            aria-label="settings"
            variant="ghost"
            height="40px"
            width="40px"
            icon={<BiSolidEdit size="20px" onClick={onOpenAddChapterModal} />}
          />
          <NewChapterModal
            isOpen={isOpenAddChapterModal}
            onClose={onCloseAddChapterModal}
            chapterName={chapter.name}
            create={false}
          />
        </Flex>

        <Text
          align="center"
          fontSize="40px"
          fontWeight="bold"
          fontFamily="oswald"
        >
          {chapter.name.toUpperCase()}
        </Text>

        <ChapterProgress chapter={chapter} />
      </Box>
    </Link>
  );
};

export default ChapterCard;
