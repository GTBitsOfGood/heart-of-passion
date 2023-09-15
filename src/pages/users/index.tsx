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
import { useState } from "react";
import UserList from "~/components/users/UserList";
import logo from "public/hoplogo.png";
import fonts from "common/theme/fonts";

export default function Users() {
  const [filter, setFilter] = useState("chapter");

  const {
    isOpen: isOpenFilterPopover,
    onOpen: onOpenFilterPopover,
    onClose: onCloseFilterPopeover,
  } = useDisclosure();

  function handleFilterClick(filter: string) {
    setFilter(filter);
    onCloseFilterPopeover();
  }

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
          <Heading size="lg" fontFamily={fonts.oswald}>
            USERS
          </Heading>
          <Box>
            <Popover placement="bottom-end" isOpen={isOpenFilterPopover}>
              <PopoverTrigger>
                <Button
                  onClick={onOpenFilterPopover}
                  variant="ghost"
                  gap="0.5em"
                >
                  <Text align="right">
                    {filter == "chapter"
                      ? "View by Chapter"
                      : "View by Permission"}
                  </Text>
                  <TriangleDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent w="13em">
                <PopoverBody w="11em">
                  <Stack>
                    <Box onClick={() => handleFilterClick("chapter")}>
                      <Text align="right">View by Chapter</Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("permission")}>
                      <Text align="right">View by Permission</Text>
                    </Box>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Button
              backgroundColor="skyblue"
              color="white"
              borderRadius="0"
              size="sm"
            >
              ADD USER
            </Button>
          </Box>
          <SettingsIcon
            boxSize="2.5em"
            position="absolute"
            right={{ base: "5em", "2xl": "12em" }}
            top={{ base: "5.6em", "2xl": "6em" }}
          />
        </Flex>
        <UserList />
        <UserList />
        <UserList />
      </Stack>
    </>
  );
}
