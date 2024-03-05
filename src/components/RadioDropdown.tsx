import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  Radio,
  RadioGroup,
  Stack,
  Box,
} from "@chakra-ui/react";
import { DownArrowIcon } from "~/common/theme/icons";

type Props = {
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  isDisabled?: boolean;
};

export const RadioDropdown = ({
  options,
  selectedOption,
  setSelectedOption,
  isDisabled,
}: Props) => {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        variant="outline"
        rightIcon={<DownArrowIcon width="22px" height="auto" />}
        fontWeight="400"
        bg={selectedOption == "Unclassified" ? "#FFDEDF" : "#DEEBFF"}
        minWidth="103px"
        width="fit-content"
        height="fit-content"
        padding="2px 8px 2px 8px"
        textColor="#122E59"
        border="none"
        fontSize="16px"
        lineHeight="24px"
        isDisabled={isDisabled ?? false}
      >
        {selectedOption}
      </MenuButton>
      <MenuList
        borderRadius="none"
        boxShadow={"0px 4px 15px 0px #00000040"}
        // maxWidth="133px"
        minWidth="100px"
        // minHeight="135px"
        // maxHeight="135px"
        width="auto"
        padding="14px 25px 14px 7px"
        textColor="#122E59"
        lineHeight="24px"
      >
        <RadioGroup
          onChange={setSelectedOption}
          value={selectedOption}
          isDisabled={isDisabled ?? false}
        >
          <Stack direction="column" justify="center" spacing="11px">
            {options.map((option) => (
              <Radio key={option} value={option} variant="customRadio">
                {option}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </MenuList>
    </Menu>
  );
};
