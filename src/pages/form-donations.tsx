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
import { useMemo, useState, useCallback } from "react";
import logo from "public/hoplogo.png";
import fonts from "src/common/theme/fonts";
import { trpc } from "~/utils/api";

//Adding
import Link from "next/link";
import FormDonationEntry from "~/components/FormDonations/FormDonationEntry";

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
  const retreats = trpc.retreat.getLatestRetreats.useQuery().data;
  const trpcUtils = trpc.useUtils();

  const updateDonation = trpc.formDonations.updateDonation.useMutation({
    onSuccess: () => {
      trpcUtils.formDonations.invalidate();
    },
  });

  const latestRetreats = trpc.retreat.getLatestRetreats.useQuery().data;

  const retreatOptions = useMemo(() => {
    return (
      latestRetreats?.map((retreat) => ({
        name: retreat.name,
        id: retreat.id,
      })) ?? []
    );
  }, [latestRetreats]);

  const updateRetreat = useCallback(
    async (referenceNumber: string, retreatId: string): Promise<void> => {
      updateDonation.mutateAsync({
        referenceNumber,
        retreatId,
      });
    },
    [updateDonation],
  );

  if (!formDonations) return <Spinner />;

  const FormDonations = () => {
    return formDonations.map((donation) => {
      return (
        <FormDonationEntry
          key={donation.referenceNumber}
          formDonation={donation}
          referenceNumber={donation.referenceNumber}
          retreatOptions={retreatOptions}
          updateRetreat={updateRetreat}
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
