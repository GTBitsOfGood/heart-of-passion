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
  retreats: { name: string; id: string }[];
  selectedRetreat: string;
  setSelectedRetreat: (retreatId: string) => void;
  isDisabled?: boolean;
};

export const RetreatDropdown = ({
  retreats,
  selectedRetreat,
  setSelectedRetreat,
  isDisabled,
}: Props) => {
  let Options = useMemo(
    () =>
      retreats.map((retreat) => (
        <Radio
          colorScheme={retreat.name === "Uncategorized" ? "red" : "red"}
          key={retreat.id}
          value={retreat.id}
          variant="customRadio"
        >
          {retreat.name}
        </Radio>
      )),
    [retreats],
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
        value={selectedRetreat}
        isDisabled={isDisabled ?? false}
      >
        {retreats.find((retreat) => retreat.id === selectedRetreat)?.name ??
          "Uncategorized"}
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
          onChange={setSelectedRetreat}
          value={selectedRetreat}
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
