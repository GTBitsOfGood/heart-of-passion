import {
  Text,
  Grid,
  GridItem,
  Button,
  Image,
  Box,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import ChapterProgress from "./chapters/ChapterProgress";
import { Chapter } from "src/common/types";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import Select, { ActionMeta } from "react-select";
import { trpc } from "~/utils/api";
import { NewRetreatYearModal } from "./NewRetreatYearModal";
import { useRouter } from "next/router";

interface SidebarProps {
  chapter: Chapter;
  year?: number;
  retreatId?: string;
}

const Sidebar = ({
  chapter,
  year: yearProp,
  retreatId: retreatIdProp,
}: SidebarProps) => {
  const id = useId();
  const {
    isOpen: isOpenAddYearModal,
    onOpen: onOpenAddYearModal,
    onClose: onCloseAddYearModal,
  } = useDisclosure();
  const [clicked, setClicked] = useState(0);

  const chapterId = trpc.chapter.getChapterIdByName.useQuery(chapter.name).data;

  const allRetreats = trpc.retreat.getRetreatYearsAndIds.useQuery(
    chapterId ?? "",
    {
      enabled: !!chapterId,
    },
  ).data;

  if (allRetreats) {
    allRetreats.sort((a, b) => a.year - b.year);
  }

  const latestRetreatId = trpc.chapter.getLatestRetreatId.useQuery(chapterId!, {
    enabled: !!retreatIdProp && !!chapterId,
  }).data;

  const retreatId = retreatIdProp ?? latestRetreatId;

  const router = useRouter();

  function handleClick(path: String) {
    if (!retreatId) {
      // TODO
      router.push(`/chapters/${chapterId}`);
      return;
    }

    router.push(`/${path}/${retreatId}`);
  }

  const [year, setYear] = useState<number>(
    yearProp ?? new Date().getFullYear(),
  );

  const getRetreat = trpc.retreat.getRetreat.useQuery(
    { chapterId: chapterId ?? "", year },
    { enabled: false },
  );

  async function handleYearChange(value: string) {
    if (value == "Add Archive") {
      onOpenAddYearModal();
      return;
    }

    let retreat = allRetreats?.find(
      (retreat) => retreat.year == parseInt(value),
    );

    if (retreat?.id) {
      setYear(parseInt(value));
      router.push(`/retreat/${retreat.id}`);
    }
  }

  const options = useMemo(() => {
    const years = allRetreats?.map((retreat) => {
      return {
        value: retreat.year.toString(),
        label: retreat.year.toString(),
      };
    });

    return years
      ? [...years, { value: "Add Archive", label: "Add Archive" }]
      : [];
  }, [allRetreats]);

  return (
    <>
      <Box pos="fixed" w="400px" h="100%" className="no-scroll-bar">
        <Box
          bg={"#F9F9F9"}
          borderRight="1px"
          borderRightColor={"#EDEDED"}
          marginRight="-20px"
          paddingRight="20px"
          h="100%"
          className="no-scroll-bar"
          scrollBehavior={"smooth"}
          overflowY={"scroll"}
          p="20px"
        >
          <Grid templateColumns="repeat(2, 1fr)" mb="3%">
            <GridItem>
              <Image
                src="/logo.png"
                alt="Heart of Passion Logo"
                height="120px"
                onClick={() => {
                  router.push(`/chapters/`);
                }}
                style={{ cursor: "pointer" }}
              />
            </GridItem>
            <GridItem>
              <Text
                align="center"
                fontSize="36px"
                fontFamily="oswald"
                fontWeight="bold"
              >
                {chapter.name.toUpperCase()}
              </Text>
              {year && (
                <Select
                  instanceId={id}
                  value={{ value: year.toString(), label: year.toString() }}
                  options={options}
                  onChange={(value, actionMeta) => {
                    handleYearChange(value!.value);
                  }}
                  isSearchable={false}
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: 0,
                      boxShadow: "none",
                      textAlign: "right",
                      backgroundColor: "#F9F9F9",
                      fontSize: "36px",
                      fontFamily: "nunito",
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: "black",
                    }),
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              )}
            </GridItem>
          </Grid>
          <ChapterProgress chapter={chapter} />
          <Button
            border={"2px black solid"}
            borderRadius="none"
            backgroundColor={clicked == 1 ? "#54A9DD" : "#F9F9F9"}
            width="98%"
            height="50px"
            justifyContent="left"
            fontFamily="nunito"
            mt="15px"
            mb="2px"
            p="10px"
            onClick={() => {
              handleClick("retreat");
            }}
          >
            Retreat Planning
          </Button>
          <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(15, 1fr)">
            <GridItem
              rowSpan={2}
              paddingLeft="15px"
              paddingTop="10px"
              paddingBottom="10px"
            >
              <Divider
                orientation="vertical"
                borderColor="black"
                w="10px"
                borderLeftWidth="2px"
              />
            </GridItem>
            <GridItem colSpan={14}>
              <Button
                fontFamily="nunito"
                borderRadius="none"
                p="10px"
                width="98%"
                justifyContent="left"
                backgroundColor={clicked == 2 ? "#54A9DD" : "#F9F9F9"}
                onClick={() => {
                  handleClick("retreat-expenses");
                }}
              >
                Expenses
              </Button>
            </GridItem>
            <GridItem colSpan={14}>
              <Button
                fontFamily="nunito"
                borderRadius="none"
                p="10px"
                width="98%"
                justifyContent="left"
                backgroundColor={clicked == 3 ? "#54A9DD" : "#F9F9F9"}
                onClick={() => {
                  router.push(`/backlog/${chapterId}/`);
                }}
              >
                Previous Retreat Events
              </Button>
            </GridItem>
          </Grid>
          <Button
            border={"2px black solid"}
            borderRadius="none"
            backgroundColor={clicked == 4 ? "#54A9DD" : "#F9F9F9"}
            width="98%"
            height="50px"
            justifyContent="left"
            fontFamily="nunito"
            mt="2px"
            mb="2px"
            p="10px"
            onClick={() => {
              setClicked(4);
            }}
          >
            Fundraising Planning
          </Button>
          <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(15, 1fr)">
            <GridItem
              rowSpan={3}
              paddingLeft="15px"
              paddingTop="10px"
              paddingBottom="10px"
            >
              <Divider
                orientation="vertical"
                borderColor="black"
                w="10px"
                borderLeftWidth="2px"
              />
            </GridItem>
            <GridItem colSpan={14}>
              <Button
                fontFamily="nunito"
                borderRadius="none"
                p="10px"
                width="98%"
                justifyContent="left"
                backgroundColor={clicked == 5 ? "#54A9DD" : "#F9F9F9"}
                onClick={() => {
                  setClicked(5);
                }}
              >
                Expenses
              </Button>
            </GridItem>
            <GridItem colSpan={14}>
              <Button
                fontFamily="nunito"
                borderRadius="none"
                p="10px"
                width="98%"
                justifyContent="left"
                backgroundColor={clicked == 6 ? "#54A9DD" : "#F9F9F9"}
                onClick={() => {
                  setClicked(6);
                }}
              >
                Hospitality
              </Button>
            </GridItem>
            <GridItem colSpan={14}>
              <Button
                fontFamily="nunito"
                borderRadius="none"
                p="10px"
                width="98%"
                justifyContent="left"
                backgroundColor={clicked == 7 ? "#54A9DD" : "#F9F9F9"}
                onClick={() => {
                  setClicked(7);
                }}
              >
                Previous Fundraiser Events
              </Button>
            </GridItem>
          </Grid>
          <Button
            fontFamily="nunito"
            borderRadius="none"
            p="10px"
            width="98%"
            justifyContent="left"
            backgroundColor={clicked == 8 ? "#54A9DD" : "#F9F9F9"}
            onClick={() => {
              setClicked(8);
            }}
          >
            Raised Funds
          </Button>
          <Button
            fontFamily="nunito"
            borderRadius="none"
            p="10px"
            width="98%"
            justifyContent="left"
            backgroundColor={clicked == 9 ? "#54A9DD" : "#F9F9F9"}
            onClick={() => {
              setClicked(9);
            }}
          >
            Archive
          </Button>
          <Image
            src="/netlify.png"
            alt="Netlify"
            height="30px"
            mt="20px"
            ml="auto"
            mr="0px"
          />
        </Box>
      </Box>
      <NewRetreatYearModal
        isOpen={isOpenAddYearModal}
        onClose={onCloseAddYearModal}
        chapterName={chapter.name}
      ></NewRetreatYearModal>
    </>
  );
};

export default Sidebar;
