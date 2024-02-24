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
} from "@chakra-ui/react";
import Image from "next/image";
import { TriangleDownIcon, SettingsIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import DonorList from "~/components/donors/DonorList";
import { Donor } from "~/common/types";
import fonts from "src/common/theme/fonts";
import { NewDonorModal } from "~/components/NewDonorModal";
import { useRouter } from "next/router";
import { trpc } from "~/utils/api";
import Sidebar from "~/components/Sidebar";

//Adding
import Link from "next/link";

export default function Donors() {
  const router = useRouter();
  const { id: retreatId }: { id?: string } = router.query;
  const chapter = trpc.chapter.getChapterByRetreatId.useQuery(retreatId!).data;

  const [filter, setFilter] = useState("donorName"); // value decides grouping behavior

  const {
    isOpen: isOpenFilterPopover,
    onOpen: onOpenFilterPopover,
    onClose: onCloseFilterPopover,
  } = useDisclosure();

  const {
    isOpen: isOpenAddDonorModal,
    onOpen: onOpenAddDonorModal,
    onClose: onCloseAddDonorModal,
  } = useDisclosure();

  function handleFilterClick(filter: string) {
    setFilter(filter);
    onCloseFilterPopover();
  }

  const finalRef = useRef(null);

  // Get donor data from the backend and populate the frontend afterwards
  const donorData = trpc.donor.getDonors.useQuery().data;
  const [donors, setDonors] = useState([] as Donor[]);

  // Wait for the data to get fetched and then update donors list
  useEffect(() => {
    setDonors(donorData as Donor[]);
  }, [donorData]);

  // uses value of filter variable to group donors by a text property in their class
  const groups = (function () {
    if (donors && donors.length > 0) {
      if (filter === "studentName") {
        const uniques = [...new Set(donors?.map((u) => u.studentName))]; // array of unique vals
        const emap = new Map(uniques.map((e) => [e, new Array()])); // map of val to empty array
        donors?.forEach((e) => emap.get(e.studentName)?.push(e));
        return uniques?.map((e) => ({
          title: e,
          donors: emap.get(e) || [],
        }));
      } else if (filter === "donorName") {
        donors.sort((a, b) => a.donorName.localeCompare(b.donorName)); // Sort alphabetically
        return [{ title: "Donor Names", donors: donors }];
      } else if (filter === "status") {
        const uniques = [...new Set(donors?.map((u) => u.status))]; // array of unique vals
        const emap = new Map(uniques.map((e) => [e, new Array()])); // map of val to empty array
        donors?.forEach((e) => emap.get(e.status)?.push(e));
        return uniques?.map((e) => ({
          title: e,
          donors: emap.get(e) || [],
        }));
      } else if (filter === "sponsorLevel") {
        const uniques = [...new Set(donors?.map((u) => u.sponsorLevel))]; // array of unique vals
        const emap = new Map(uniques.map((e) => [e, new Array()])); // map of val to empty array
        donors?.forEach((e) => emap.get(e.sponsorLevel)?.push(e));
        return uniques?.map((e) => ({
          title: e,
          donors: emap.get(e) || [],
        }));
      } else {
        const uniques = [...new Set(donors?.map((u) => u.source))]; // array of unique vals
        const emap = new Map(uniques.map((e) => [e, new Array()])); // map of val to empty array
        donors?.forEach((e) => emap.get(e.source)?.push(e));
        return uniques?.map((e) => ({
          title: e,
          donors: emap.get(e) || [],
        }));
      }
    } else {
      return [];
    }
  })();
  const groupsRendered = groups.map((gr: any) => (
    <DonorList key={gr.title} {...gr} />
  ));

  return (
    <Box>
      {chapter ? (
        <Sidebar chapter={chapter!} retreatId={retreatId} />
      ) : (
        <Spinner />
      )}
      <Stack
        spacing={4}
        alignItems={"right"}
        paddingTop="10px"
        paddingRight="5%"
        paddingLeft="2%"
        marginLeft="400px" // size of sidebar
      >
        <Flex
          justifyContent={"space-between"}
          borderBottom="solid 1px black"
          paddingTop={{ base: "7%", "2xl": "4%" }}
        >
          <Heading size="lg" fontFamily={fonts.oswald} fontWeight="extrabold">
            HOSPITALITY
          </Heading>
          <Box>
            <Popover
              placement="bottom-end"
              isOpen={isOpenFilterPopover}
              onClose={onCloseFilterPopover}
            >
              <PopoverTrigger>
                <Button
                  onClick={onOpenFilterPopover}
                  variant="ghost"
                  gap="0.5em"
                >
                  <Text align="right" fontFamily={fonts.nunito} fontSize="sm">
                    {filter == "donorName"
                      ? "View by Donor Name"
                      : filter == "studentName"
                      ? "View by Student Name"
                      : filter == "status"
                      ? "View by Status"
                      : filter == "sponsorLevel"
                      ? "View by Sponsorship Level"
                      : "View by Source"}
                  </Text>
                  <TriangleDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent w="11.7em">
                <PopoverBody w="10em">
                  <Stack>
                    <Box onClick={() => handleFilterClick("donorName")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Donor Name
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("studentName")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Student Name
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("status")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Status
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("sponsorLevel")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Sponsorship Level
                      </Text>
                    </Box>
                    <Box onClick={() => handleFilterClick("source")}>
                      <Text
                        align="right"
                        cursor="pointer"
                        fontFamily={fonts.nunito}
                        fontSize="sm"
                      >
                        Source
                      </Text>
                    </Box>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Button
              colorScheme="twitter"
              onClick={onOpenAddDonorModal}
              fontWeight="400"
              color="white"
              bg="hop_blue.500"
              fontFamily="oswald"
              height="50px"
              fontSize="20px"
              marginBottom="10px"
            >
              <Text color="white" fontFamily={fonts.oswald} fontWeight="light">
                ADD DONOR
              </Text>
            </Button>
            <NewDonorModal
              isOpen={isOpenAddDonorModal}
              onClose={onCloseAddDonorModal}
              donorData={{
                donorName: "",
                studentName: "",
                donorEmail: "",
                status: "",
                source: "",
                sponsorLevel: "",
              }}
              create={true}
            />
          </Box>
        </Flex>
        {groupsRendered}
        <Flex borderBottom="1px #AEAEAE solid"></Flex>
      </Stack>
    </Box>
  );
}
