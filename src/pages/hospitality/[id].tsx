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
  import DonorList from "~/components/donors/DonorList";
  import { Donor } from "~/common/types";
  import logo from "public/hoplogo.png";
  import fonts from "src/common/theme/fonts";
  import { NewDonorModal } from "~/components/NewDonorModal";
  import { trpc } from "~/utils/api";
  
  //Adding
  import Link from "next/link";
  
  export default function Donors() {
    const [filter, setFilter] = useState("donor name"); // value decides grouping behavior
  
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
    const donorData = trpc.donor.getDonors.useQuery().data;
    const [donors, setDonors] = useState([] as Donor[]);
  
    // Wait for the data to get fetched and then update users list
    useEffect(() => {
      setDonors(donorData as Donor[]);
    }, [donorData]);
  
    // uses value of filter variable to group users by a text property in their class
    const groups = (function () {
      if (donors && donors.length > 0) {
        const uniques = [...new Set(donors?.map((u) => u.donorEmail))]; // array of unique vals
        const dmap: Map<string, Donor[]> = new Map(
          uniques.map((d) => [d, new Array()]),
        ); // map of val to empty array
        donors?.forEach((d) => dmap.get(d.donorEmail)?.push(d));
        return uniques?.map((d) => ({
          title: d,
          expenses: dmap.get(d) || [],
        }));
      } else {
        return [];
      }
    })();
    const groupsRendered = groups.map((gr: any) => (
      <DonorList key={gr.title} {...gr} />
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
                      {filter == "donor"
                        ? "View by Donor Name"
                        : "View by Student Name"}
                    </Text>
                    <TriangleDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent w="11.7em">
                  <PopoverBody w="10em">
                    <Stack>
                      <Box onClick={() => handleFilterClick("donor name")}>
                        <Text
                          align="right"
                          cursor="pointer"
                          fontFamily={fonts.nunito}
                          fontSize="sm"
                        >
                          View by Donor Name
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
                  ADD DONOR
                </Text>
              </Button>
              <NewDonorModal
                isOpen={isOpenAddUserModal}
                onClose={onCloseAddUserModal}
                donorData={{ donorName: "", studentName: "", donorEmail: "", status: "", source: "", sponsorLevel: ""}}
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
        </Stack>
      </>
    );
  }  