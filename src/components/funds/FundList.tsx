import { Heading, Stack, Flex } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useState } from "react";
import FundEntry from "./FundEntry";
import { Fund, FundList as FundListType } from "src/common/types";

interface FundListProps extends FundListType {
  handleSelectFund: (fund: Fund) => void;
}

// export default function FundList({ title, funds }: FundListType) {
export default function FundList({
  handleSelectFund,
  includeTitle,
  title,
  funds,
}: FundListProps) {
  const [open, setOpen] = useState(true);
  const fundsRendered = funds.map((fund: Fund) => (
    <FundEntry
      key={fund._id + fund.name + fund.amount + fund.date}
      handleSelectFund={handleSelectFund}
      fund={fund}
    />
    // <FundEntry setSelectedFund = {setSelectedFund} fundId = {fund._id!} key={fund.name} {...fund} /> //key needs to be from backend once we wire it up, cannot have duplicates
  ));
  return (
    <>
      <Stack w="95%" py="0.5em" px="1em">
        <Flex
          justifyContent="space-between"
          onClick={() => setOpen(!open)}
          borderBottom={includeTitle ? "1px solid #AEAEAE" : "none"}
          p={includeTitle ? ".5em" : "none"}
          marginBottom={includeTitle ? "1em" : "none"}
        >
          {includeTitle && (
            <Heading size="md" textTransform="capitalize">
              {title}
            </Heading>
          )}
          {includeTitle && (open ? <TriangleUpIcon /> : <TriangleDownIcon />)}
        </Flex>
        <Stack pl="3em" gap="1em">
          {open ? fundsRendered : <></>}
        </Stack>
      </Stack>
    </>
  );
}
