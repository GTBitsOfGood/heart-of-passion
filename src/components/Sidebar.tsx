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
    year: number;
    focusRef: React.MutableRefObject<null>;
  }

  type OptionType = {
    value: string;
    label: string;
  };

  const Sidebar = ({ chapter, year, focusRef }: SidebarProps) => {
    const id = useId();
    const {
      isOpen: isOpenAddYearModal,
      onOpen: onOpenAddYearModal,
      onClose: onCloseAddYearModal,
    } = useDisclosure();
    const [clicked, setClicked] = useState(0);

    const chapterId = trpc.chapter.getChapterIdByName.useQuery(chapter.name);

    const retreatYears = trpc.retreat.getRetreatYears.useQuery(
      chapterId.data ?? "", {enabled: !!chapterId.data}
    );

    const router = useRouter();

    const archiveOption: OptionType = {
      value: "Add Archive",
      label: "Add Archive",
    };

    const options: OptionType[] = useMemo(() => {
      return [
        ...(retreatYears.data?.map((yr, i) => {
          const option = {
            value: yr.toString(),
            label: yr.toString(),
            // onChange: () => {
            //   // console.log("HERE");
            //   setSelectedOption(i);
            // },
          };
          return option;
        }) ?? []),
        // {
        //   value: "Add Archive",
        //   label: "Add Archive",
        //   // onChange: () => {
        //   // console.log("lol");
        //   // console.log(selectedOption?.value);
        //   // setSelectedOption((retreatYears?.data?.length ?? 0)-1);
        //   // onOpenModal();
        //   // },
        // },
        archiveOption,
      ];
    }, [retreatYears.data]);

    const getOptionFromYear = useCallback(
      (yr: number) => {
        return options.find((o) => o.value === yr.toString()) ?? archiveOption;
      },
      [options],
    );

    const [selectedOption, setSelectedOption] = useState<OptionType>(
      getOptionFromYear(year),
    );
    const getRetreat = trpc.retreat.getRetreat.useQuery(
      { chapterId: chapterId.data ?? "", year: parseInt(selectedOption.value) },
      { enabled: false },
    );

    const handleChange = async (
      option: OptionType | null,
      actionMeta: ActionMeta<OptionType>,
    ) => {
      setSelectedOption(option ?? archiveOption);
      // console.log("OPTION"+option.value);
      if (option?.value === "Add Archive") {
        onOpenAddYearModal();
      }
    };

    useEffect(() => {
      // console.log(selectedOption);
      if (selectedOption) {
        if (selectedOption.value !== "Add Archive") {
          (async () => {
            const { data: retreat } = await getRetreat.refetch();
            router.push(`retreat/${retreat?._id}`);
          })();
        }
      }
    }, [selectedOption]);

    return (
      <>
        <Box pos="fixed" w="400px" h="100%" overflow="hidden">
          <Box
            bg={"#F9F9F9"}
            borderRight="1px"
            borderRightColor={"#EDEDED"}
            marginRight="-20px"
            paddingRight="20px"
            h="100%"
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
                <Select
                  instanceId={id}
                  defaultValue={{
                    value: year.toString(),
                    label: year.toString(),
                  }}
                  options={options}
                  onChange={handleChange}
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
                {/* <Select
                placeholder={year.toString()}
                fontSize="36px"
                fontFamily="nunito"
                variant="unstyled"
                textAlign="right"
              >
                <option>Add Archive</option>
              </Select> */}
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
                setClicked(1);
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
                    setClicked(2);
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
                    setClicked(3);
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
          focusRef={focusRef}
          isOpen={isOpenAddYearModal}
          onClose={onCloseAddYearModal}
          chapterName={chapter.name}
        ></NewRetreatYearModal>
      </>
    );
  };

  export default Sidebar;
