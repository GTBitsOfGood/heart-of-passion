import { Heading, Stack, Flex } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useState } from "react";
import DonorEntry from "./DonorEntry";
import { Donor, DonorList } from "src/common/types";

export default function DonorList({ includeTitle, title, donors }: DonorList) {
  const [open, setOpen] = useState(true);

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
          {open ? (
            donors?.map((donor: Donor) => (
              <DonorEntry
                key={
                  donor.donorEmail +
                  donor.donorName +
                  donor.studentName +
                  donor.status +
                  donor.sponsorLevel +
                  donor.source
                }
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
