import { Box, Spinner, Text, useDisclosure, useToast, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "~/utils/api";
import "@fontsource/oswald/700.css";
import Sidebar from "~/components/Sidebar";
import Select from "react-select";
import PlanningHandler from "~/components/FundraisingPlanning/PlanningHandler";
import BacklogCopyModal from "~/components/Backlog/BacklogCopyModal";
import { Event } from "~/common/types";

export enum BacklogSort {
  ViewByDate = "View by Date",
  LowestCost = "Lowest Cost",
  HighestCost = "Highest Cost",
}

export default function Backlog() {
  const router = useRouter();
  const { id: chapterId }: { id?: string } = router.query;

  const eventsByYear = trpc.retreat.getAllEventsForChapter.useQuery(
    chapterId!,
    {
      enabled: !!chapterId,
    },
  )?.data;

  const chapter = trpc.chapter.getChapterById.useQuery(chapterId!, {
    enabled: !!chapterId,
  })?.data;

  const fundraiser = trpc.fundraiser.getFundraiser.useQuery(chapterId!, {
    enabled: !!chapterId,
  });

  const toast = useToast();
  const trpcUtils = trpc.useUtils();
  const createEventInLatestRetreat =
    trpc.event.createEventInLatestRetreat.useMutation({
      onSuccess: () => {
        trpcUtils.event.invalidate();
        trpcUtils.retreat.invalidate();
      },
    });

  const sortOptions = Object.values(BacklogSort).map((sortMethod) => ({
    value: sortMethod,
    label: sortMethod,
  }));
  const [sortMethod, setSortMethod] = useState<BacklogSort>(
    BacklogSort.ViewByDate,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [eventToCopy, setEventToCopy] = useState<Event | undefined>(undefined);

  const openCopyModal = (event: Event) => {
    setEventToCopy(event);
    onOpen();
  };

  const copyToCurrentRetreat = () => {
    if (!eventToCopy) return;

    createEventInLatestRetreat.mutate({
      chapterId: chapterId!,
      eventDetails: eventToCopy,
    });
    toast({
      title: "Success",
      description: "You successfully copied the event!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <>
      <Box>
        {eventsByYear && (
          <Box display={"flex"}>
            <Box>{chapter ? <Sidebar chapter={chapter} /> : <Spinner />}</Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              marginLeft={400}
              padding={50}
              width={"100%"}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                borderBottom={"1px solid black"}
                paddingX={3}
              >
                <Text fontSize={36} fontWeight={700} fontFamily={"oswald"}>
                  FUNDRAISING PLANNING
                </Text>
                <Box display={"flex"} gap={2} alignItems={"center"}>
                  <Select
                    value={{ label: sortMethod, value: sortMethod }}
                    options={sortOptions}
                    onChange={(event) => {
                      setSortMethod(event!.value);
                    }}
                    isSearchable={false}
                    styles={{
                      control: (base: any) => ({
                        ...base,
                        border: 0,
                        boxShadow: "none",
                        textAlign: "right",
                        fontSize: "20px",
                        fontFamily: "nunito",
                      }),
                      dropdownIndicator: (base: any) => ({
                        ...base,
                        color: "black",
                      }),
                    }}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                  />
                    <Button
                        colorScheme="twitter"
                        // onClick={null}
                        fontWeight="400"
                        color="white"
                        bg="hop_blue.500"
                        fontFamily="oswald"
                        height="50px"
                        fontSize="20px"
                        marginBottom="10px"
                        >
                        ADD FUNDRAISER
                    </Button>
                </Box>
              </Box>
              <PlanningHandler
                openCopyModal={openCopyModal}
                sortMethod={sortMethod}
                eventsByYear={eventsByYear}
                fundraiser={fundraiser.data}
              />
            </Box>
          </Box>
        )}
      </Box>

      <BacklogCopyModal
        event={eventToCopy}
        copyToCurrentRetreat={copyToCurrentRetreat}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </>
  );
}
