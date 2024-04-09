import { Flex, Box, useDisclosure, SimpleGrid } from "@chakra-ui/react";
import { useMemo } from "react";
import fonts from "~/common/theme/fonts";
import { FormDonation } from "~/common/types";
import { trpc } from "~/utils/api";
import { RadioDropdown } from "../RadioDropdown";
import { ChapterDropdown } from "./ChapterDropdown";
import { useState } from "react";

export default function FormDonationEntry({
  formDonation,
  chapterOptions,
  updateChapter,
}: {
  formDonation: FormDonation;
  chapterOptions: { name: string; id: string }[];
  updateChapter: (chapterId: string) => void;
}) {
  const chapter = formDonation.chapterId ?? "Uncategorized";

  return (
    <>
      <Box>{formDonation.name}</Box>
      <Box>{formDonation.amount}</Box>
      <Box>{formDonation.date.toLocaleDateString()}</Box>
      <Box>
        <ChapterDropdown
          chapters={chapterOptions}
          selectedChapter={chapter}
          setSelectedChapter={(chapterId) => {
            updateChapter(chapterId);
          }}
        />
      </Box>
      <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
        {formDonation.note ?? ""}
      </Box>
    </>
  );
}
