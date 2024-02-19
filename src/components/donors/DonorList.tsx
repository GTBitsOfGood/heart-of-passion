import { Heading, Stack, Flex } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useState } from "react";
import DonorEntry from "./DonorEntry";
import { Donor } from "src/common/types";
import { DonorList } from "~/pages/hospitality/[id]";

export default function DonorList({ title, donors }: DonorList) {
  const [open, setOpen] = useState(true);

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
          {open ? (
            donors.map((donor: Donor) => (
              <DonorEntry
                key={donor.donorName + donor.studentName + donor.donorEmail + donor.status}
                {...donor}
              />
            ))
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
    </>
  );
}
