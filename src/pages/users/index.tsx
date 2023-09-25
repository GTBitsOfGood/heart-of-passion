import {
  Heading,
  Stack,
  Flex,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  Box,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { TriangleDownIcon, SettingsIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import UserList from "~/components/users/UserList";
import { User } from "~/common/types/types";
import logo from "public/hoplogo.png";
import fonts from "common/theme/fonts";
import { NewUser } from "~/components/NewUser";
import { api } from "~/utils/api";

export default function Users() {
  const [filter, setFilter] = useState("chapter"); // value decides grouping behavior

  const {
    isOpen: isOpenFilterPopover,
    onOpen: onOpenFilterPopover,
    onClose: onCloseFilterPopeover,
  } = useDisclosure();

  const {
    isOpen: isOpenAddUserModal,
    onOpen: onOpenAddUserModal,
    onClose: onCloseAddUserModal,
  } = useDisclosure();

  function handleFilterClick(filter: string) {
    setFilter(filter);
    onCloseFilterPopeover();
  }

  const finalRef = useRef(null);

  const userData = api.user.getUsers.useQuery().data?.message;
  const [users, setUsers] = useState([] as User[]);

  useEffect(() => {
    setUsers(userData as User[]);
  }, [userData]);

  function updateUsers(user: User) {
    const newUsers = [...users, user];
    setUsers(newUsers);
  }

  // uses value of filter variable to group users by a text property in their class
  const groups = (function () {
    let uniques;
    if (filter == "chapter") {
      uniques = [...new Set(users?.map((u: any) => u[filter]["name"]))];
    } else {
      uniques = [...new Set(users?.map((u: any) => u[filter]))]; // array of unique vals}
    }
    // group users by groupBy name into dictionary
    const umap = new Map(uniques.map((u: any) => [u, new Array()])); // map of val to empty array
    if (filter === "chapter") {
      users?.forEach(
        (u: any) =>
          umap.get(u[filter]["name"])?.push({
            email: u["email"],
            name: u["name"],
            role: u["role"],
            chapter: u["chapter"]["name"],
          }),
      );
    } else {
      users?.forEach(
        (u: any) =>
          umap.get(u[filter])?.push({
            email: u["email"],
            name: u["name"],
            role: u["role"],
            chapter: u["chapter"]["name"],
          }),
      );
    }
    return uniques.map((u: string) => ({ title: u, users: umap.get(u) }));
  })();
  const groupsRendered = groups.map((gr: any) => (
    <UserList key={gr.title} {...gr} />
  ));

  return (
    <>
      <Box
        position="absolute"
        w={{ base: "6em", "2xl": "10em" }}
        m={{ base: "1em", "2xl": "2em" }}
      >
        <Image src={logo} alt="logo" />
      </Box>
      <Stack w="100%" alignItems="center">
        <Flex
          justifyContent={"space-between"}
          w="70%"
          borderBottom="solid 1px black"
          paddingTop={{ base: "7%", "2xl": "4%" }}
        >
          <Heading size="lg" fontFamily={fonts.oswald} fontWeight="extrabold">
            USERS
          </Heading>
          <Box>
            <Popover
              placement="bottom-end"
              isOpen={isOpenFilterPopover}
              onClose={onCloseFilterPopeover}
            >
              <PopoverTrigger>
                <Button
                  onClick={onOpenFilterPopover}
                  variant="ghost"
                  gap="0.5em"
                >
                  <Text align="right" fontFamily={fonts.nunito} fontSize="sm">
                    {filter == "chapter"
                      ? "View by Chapter"
                      : "View by Permission"}
                  </Text>
                  <TriangleDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent w="11.7em">
                <PopoverBody w="10em">
                  <Stack>
                    <Box onClick={() => handleFilterClick("chapter")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        View by Chapter
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("role")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        View by Permission
                      </Text>
                    </Box>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Button
              backgroundColor="#26ACE2"
              borderRadius="0"
              h="80%"
              w="4.5em"
              onClick={onOpenAddUserModal}
            >
              <Text color="white" fontFamily={fonts.oswald} fontWeight="light">
                ADD USER
              </Text>
            </Button>
            <NewUser
              focusRef={finalRef}
              isOpen={isOpenAddUserModal}
              onClose={onCloseAddUserModal}
              updateUsers={updateUsers}
            />
          </Box>
          <SettingsIcon
            boxSize="2.5em"
            position="absolute"
            right={{ base: "5em", "2xl": "12em" }}
            top={{ base: "5.6em", "2xl": "6em" }}
          />
        </Flex>
        {groupsRendered}
      </Stack>
    </>
  );
}
