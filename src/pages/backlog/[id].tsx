import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "~/utils/api";
import "@fontsource/oswald/700.css";
import { TriangleDownIcon } from "@chakra-ui/icons";
import { IEvent } from "~/server/models/Event";
import BacklogCard from "~/components/Backlog/BacklogCard";

export default function Backlog() {
  const [chapterEvents, setChapterEvents]: IEvent[] | any[] = useState([]);
  const router = useRouter();
  const { id }: { id?: string } = router.query;
  const { data: currRetreatData } = trpc.retreat.getAllEvents.useQuery(
    id || "",
    {
      enabled: id !== undefined,
    },
  );

  useEffect(() => {
    setChapterEvents(currRetreatData);
  }, [currRetreatData]);

  return (
    <Box>
      {chapterEvents && (
        <Box display={"flex"}>
          <Box>{/* Sidebar */}</Box>
          <Box display={"flex"} flexDirection={"column"}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              borderBottom={"1px solid black"}
            >
              <Text fontSize={36} fontWeight={700} fontFamily={"oswald"}>
                PREVIOUS RETREAT YEARS
              </Text>
              <Box display={"flex"} gap={2} alignItems={"center"}>
                <Text fontFamily={"nunito"} fontSize={20}>
                  View by Date
                </Text>
                <TriangleDownIcon cursor={"pointer"} />
              </Box>
            </Box>
            <Box display={"flex"} justifyContent={"center"}>
              <Box width={"95%"}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  borderBottom={"1px solid #AEAEAE"}
                >
                  <Text fontSize={20} fontWeight={700} fontFamily={"nunito"}>
                    2022
                  </Text>
                  <Box display={"flex"} alignItems={"center"}>
                    <TriangleDownIcon cursor={"pointer"} />
                  </Box>
                </Box>
                <Box>
                  {chapterEvents.map((event: any) => {
                    return <BacklogCard key={event.name} {...event} />;
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
