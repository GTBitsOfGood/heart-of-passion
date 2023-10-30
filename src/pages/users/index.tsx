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
import { User } from "~/common/types";
import logo from "public/hoplogo.png";
import fonts from "src/common/theme/fonts";
import { NewUserModal } from "~/components/NewUserModal";
import { trpc } from "~/utils/api";

//Adding
import Link from 'next/link'

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

  // Get user data from the backend and populate the frontend afterwards
  const userData = trpc.user.getUsers.useQuery().data;
  const [users, setUsers] = useState([] as User[]);
  let adminRendered;

  // Wait for the data to get fetched and then update users list
  useEffect(() => {
    setUsers(userData as User[]);
  }, [userData]);

  // uses value of filter variable to group users by a text property in their class
  const groups = (function () {
    let uniques;
    if (users && users.length > 0) {
      uniques = [
        ...new Set(users?.map((u: any) => (u[filter] ? u[filter] : "admin"))),
      ]; // array of unique vals}
      // group users by groupBy name into dictionary
      const umap = new Map(uniques.map((u: any) => [u, new Array()])); // map of val to empty array
      users?.forEach(
        (u: any) =>
          umap.get(u[filter] ? u[filter] : "admin")?.push({
            email: u["email"],
            name: u["name"],
            role: u["role"],
            chapter: u["chapter"],
          }),
      );
      let index = uniques.indexOf("admin");
      if (index !== -1) {
        adminRendered = umap.get("admin");
        uniques.splice(index, 1);
      }
      return uniques.map((u: string) => ({ title: u, users: umap.get(u) }));
    } else {
      return [];
    }
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
        <Link href="/chapters">
          <Image src={logo} alt="logo" />
        </Link>
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
            <NewUserModal
              focusRef={finalRef}
              isOpen={isOpenAddUserModal}
              onClose={onCloseAddUserModal}
              userData={{ name: "", email: "", role: "student", chapter: "" }}
              create={true}
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
        {adminRendered ? (
          <UserList key={"admin"} title={"admin"} users={...adminRendered} />
        ) : (
          <></>
        )}
      </Stack>
    </>
  );
}
