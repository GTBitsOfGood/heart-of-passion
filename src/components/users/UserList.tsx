import { Heading, Stack, Flex } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useState } from "react";
import UserEntry from "./UserEntry";
import { User, UserList as UserListType } from "src/common/types";

export default function UserList({ title, users }: UserListType) {
  const [open, setOpen] = useState(true);
  const usersRendered = users.map((user: User) => (
    <UserEntry key={user.email} {...user} />
  ));
  return (
    <>
      <Stack w={{ base: "67%", "2xl": "68%" }} py="0.5em">
        <Flex
          justifyContent="space-between"
          onClick={() => setOpen(!open)}
          borderBottom="1px #AEAEAE solid"
          p=".5em"
        >
          <Heading size="md" textTransform="capitalize">
            {title}
          </Heading>
          {open ? <TriangleUpIcon /> : <TriangleDownIcon />}
        </Flex>
        <Stack gap="1em">{open ? usersRendered : <></>}</Stack>
      </Stack>
    </>
  );
}
