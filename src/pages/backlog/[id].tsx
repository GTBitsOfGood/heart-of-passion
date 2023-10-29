import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "~/utils/api";
import "@fontsource/oswald/700.css";
import Sidebar from "~/components/Sidebar";
import Select from "react-select";
import BacklogHandler from "~/components/Backlog/BacklogHandler";

export default function Backlog() {
  const [chapterEvents, setChapterEvents]: any = useState({});
  const [currOption, setCurrOption] = useState({
    label: "View by Date",
    value: "View by Date",
  });
  const router = useRouter();
  const { id }: { id?: string } = router.query;
  const { data: currRetreatData } = trpc.retreat.getAllEvents.useQuery(id!, {
    enabled: !!id,
  });
  let dummyChapter = {
    name: "Atlanta",
    totalCost: 5100,
    fundExpected: 5180,
    fundActual: 2600,
  };

  let dummyYear = 2023;

  const options = [
    { value: "View by Date", label: "View by Date" },
    { value: "Lowest Cost", label: "Lowest Cost" },
    { value: "Highest Cost", label: "Highest Cost" },
  ];

  const [toggleYears, setToggleYears]: any = useState({});

  useEffect(() => {
    if (currRetreatData) {
      setChapterEvents(currRetreatData);
      for (let year of Object.keys(currRetreatData)) {
        setToggleYears({ [year]: true });
      }
    }
  }, [currRetreatData]);

  return (
    <Box>
      {currRetreatData && chapterEvents && (
        <Box display={"flex"}>
          <Box>
            <Sidebar chapter={dummyChapter} year={dummyYear} />
          </Box>
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
                  defaultValue={{
                    label: currOption.label,
                    value: currOption.value,
                  }}
                  options={options}
                  onChange={(event: any) => {
                    console.log(event);
                    setCurrOption({
                      label: event.label,
                      value: event.value,
                    });
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
              label={currOption.label}
              chapterEvents={chapterEvents}
              toggleYears={toggleYears}
              setToggleYears={setToggleYears}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
