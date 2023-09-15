import { Heading, Stack, Flex } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useState } from "react";
import UserEntry from "./UserEntry";

export default function Users() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Stack w={{ base: "67%", "2xl": "68%" }}>
        <Flex
          justifyContent="space-between"
          onClick={() => setOpen(!open)}
          borderBottom="1px lightgrey solid"
          p=".5em"
        >
          <Heading size="md">Atlanta</Heading>
          {open ? <TriangleUpIcon /> : <TriangleDownIcon />}
        </Flex>
        <Stack gap="1em">
          {open ? (
            <>
              <UserEntry
                name="Yiwen Zhao"
                email="yiwen.zhao@gatech.edu"
                role="Admin"
                chapter="Atlanta"
              ></UserEntry>
              <UserEntry
                name="Yiwen Zhao"
                email="yiwen.zhao@gatech.edu"
                role="Student"
                chapter="Atlanta"
              ></UserEntry>
              <UserEntry
                name="Yiwen Zhao"
                email="yiwen.zhao@gatech.edu"
                role="Admin"
                chapter="Atlanta"
              ></UserEntry>
            </>
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
    </>
  );
}
