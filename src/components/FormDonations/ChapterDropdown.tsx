import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { DownArrowIcon } from "~/common/theme/icons";

type Props = {
  chapters: { name: string; id: string }[];
  selectedChapter: string;
  setSelectedChapter: (chapterId: string) => void;
  isDisabled?: boolean;
};

export const ChapterDropdown = ({
  chapters,
  selectedChapter,
  setSelectedChapter,
  isDisabled,
}: Props) => {
  let Options = useMemo(
    () =>
      chapters.map((chapter) => (
        <Radio
          colorScheme={chapter.name === "Uncategorized" ? "red" : "red"}
          key={chapter.id}
          value={chapter.id}
          variant="customRadio"
        >
          {chapter.name}
        </Radio>
      )),
    [chapters],
  );

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        variant="outline"
        rightIcon={<DownArrowIcon width="22px" height="auto" />}
        fontWeight="400"
        bg="#DEEBFF"
        minWidth="103px"
        width="fit-content"
        height="fit-content"
        padding="2px 8px 2px 8px"
        textColor="#122E59"
        border="none"
        fontSize="16px"
        lineHeight="24px"
        value={selectedChapter}
        isDisabled={isDisabled ?? false}
      >
        {chapters.find((chapter) => chapter.id === selectedChapter)?.name}
      </MenuButton>
      <MenuList
        borderRadius="none"
        boxShadow={"0px 4px 15px 0px #00000040"}
        minWidth="100px"
        width="auto"
        padding="14px 25px 14px 7px"
        textColor="#122E59"
        lineHeight="24px"
      >
        <RadioGroup
          onChange={setSelectedChapter}
          value={selectedChapter}
          isDisabled={isDisabled ?? false}
        >
          <Stack direction="column" justify="center" spacing="11px">
            <SimpleGrid columns={5}>{Options}</SimpleGrid>
          </Stack>
        </RadioGroup>
      </MenuList>
    </Menu>
  );
};
