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
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import Image from "next/image";
import { TriangleDownIcon } from "@chakra-ui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import UserList from "~/components/users/UserList";
import { User } from "~/common/types";
import logo from "public/hoplogo.png";
import fonts from "src/common/theme/fonts";
import { NewUserModal } from "~/components/NewUserModal";
import { trpc } from "~/utils/api";

//Adding
import Link from "next/link";
import FormDonationEntry from "~/components/FormDonations/FormDonationEntry";
import { ChapterDropdown } from "~/components/FormDonations/ChapterDropdown";

type Filter = "TODO";

export default function FormDonations() {
  const [filter, setFilter] = useState<Filter>("TODO"); // value decides grouping behavior

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

  function handleFilterClick(filter: Filter) {
    setFilter(filter);
    onCloseFilterPopeover();
  }

  // Get user data from the backend and populate the frontend afterwards
  const formDonations = trpc.formDonations.getDonations.useQuery().data;
  const chapters = trpc.chapter.getChapters.useQuery().data;
  const trpcUtils = trpc.useUtils();

  const updateDonation = trpc.formDonations.updateDonation.useMutation({
    onSuccess: () => {
      trpcUtils.formDonations.invalidate();
    },
  });

  const chapterOptions = useMemo(() => {
    return [
      { name: "Uncategorized", id: "Uncategorized" },
      ...(chapters?.map((chapter) => ({
        name: chapter.name,
        id: chapter.id,
      })) ?? []),
    ];
  }, [chapters]);

  if (!formDonations) return <Spinner />;

  const FormDonations = () => {
    return formDonations.map((donation) => {
      return (
        <FormDonationEntry
          key={donation.referenceNumber}
          formDonation={donation}
          chapterOptions={chapterOptions}
          updateChapter={function (chapterId: string): void {
            updateDonation.mutate({
              referenceNumber: donation.referenceNumber,
              chapterId: chapterId,
            });
          }}
        />
      );
    });
  };

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
            FORM DONATIONS
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
                    {filter == "TODO"
                      ? "View by Chapter"
                      : "View by Permission"}
                  </Text>
                  <TriangleDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent w="11.7em">
                <PopoverBody w="10em">
                  <Stack>
                    <Box onClick={() => handleFilterClick("TODO")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        View by Chapter
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("TODO")}>
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
          </Box>
        </Flex>
        <SimpleGrid columns={5} w={{ base: "67%", "2xl": "68%" }} spacingY={5}>
          <FormDonations />
        </SimpleGrid>
      </Stack>
    </>
  );
}
