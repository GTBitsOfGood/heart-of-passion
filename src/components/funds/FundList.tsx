import { Heading, Stack, Flex } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useState } from "react";
import FundEntry from "./FundEntry";
import { Fund, FundList as FundListType } from "src/common/types";

export default function FundList({ title, funds }: FundListType) {
  const [open, setOpen] = useState(true);
  const fundsRendered = funds.map((fund: Fund) => (
    <FundEntry key={fund.name} {...fund} />
  ));
  return (
    <>
      <Stack w="95%" py="0.5em" px="1em">
        <Flex
          justifyContent="space-between"
          onClick={() => setOpen(!open)}
          borderBottom="1px #AEAEAE solid"
          p=".5em"
          marginBottom="1em"
        >
          <Heading size="md" textTransform="capitalize">
            {title}
          </Heading>
          {open ? <TriangleUpIcon /> : <TriangleDownIcon />}
        </Flex>
        <Stack pl="3em" gap="1em">
          {open ? fundsRendered : <></>}
        </Stack>
      </Stack>
    </>
  );
}
