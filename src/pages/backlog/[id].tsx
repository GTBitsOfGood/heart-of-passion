import { Box, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "~/utils/api";
import "@fontsource/oswald/700.css";
import Sidebar from "~/components/Sidebar";
import Select from "react-select";
import BacklogHandler from "~/components/Backlog/BacklogHandler";
import { set } from "mongoose";
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

  const [eventToCopy, setEventToCopy] = useState<Event | null>(null);

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
                  PREVIOUS RETREAT YEARS
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
                </Box>
              </Box>
              <BacklogHandler
                openCopyModal={openCopyModal}
                sortMethod={sortMethod}
                eventsByYear={eventsByYear}
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
