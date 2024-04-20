import {
  Text,
  Grid,
  GridItem,
  IconButton,
  Button,
  Image,
  Box,
  Divider,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import ChapterProgress from "./chapters/ChapterProgress";
import { useToast } from "@chakra-ui/react";
import { Chapter } from "src/common/types";
import { useId, useMemo, useState } from "react";
import Select, { ActionMeta } from "react-select";
import { trpc } from "~/utils/api";
import { NewRetreatYearModal } from "./NewRetreatYearModal";
import { useRouter } from "next/router";
import DeleteConfirmation from "./DeleteConfirmation"; // Import DeleteConfirmation
import { IoIosLogOut } from "react-icons/io";

interface SidebarProps {
  chapter: Chapter;
  year?: number;
  retreatId?: string;
  pageClicked: number;
}

const Sidebar = ({
  chapter,
  year,
  retreatId: retreatIdProp,
  pageClicked,
}: SidebarProps) => {
  const id = useId();
  const {
    isOpen: isOpenAddYearModal,
    onOpen: onOpenAddYearModal,
    onClose: onCloseAddYearModal,
  } = useDisclosure();
  const deleteModal = useDisclosure(); // Use useDisclosure for DeleteConfirmation modal
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

  const isAdmin = trpc.user.isAdmin.useQuery().data;

  const retreatId = retreatIdProp ?? latestRetreatId;

  const router = useRouter();

  const trpcUtils = trpc.useUtils();
  const deleteRetreat = trpc.retreat.deleteRetreat.useMutation({
    onSuccess: () => {
      trpcUtils.event.invalidate();
      trpcUtils.fund.invalidate();
      trpcUtils.fundraiser.invalidate();
      trpcUtils.retreat.invalidate();
      trpcUtils.chapter.invalidate();
    },
  });

  const toast = useToast();
  function handleDeleteYear() {
    if (options.length <= 2 || !retreatId) return;

    deleteRetreat.mutate(retreatId);
    toast({
      title: "Success",
      description: "You successfully deleted current year!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    deleteModal.onClose(); // Close the modal after deletion using useDisclosure
  }

  function handleClick(path: String) {
    if (!retreatId) {
      // TODO
      router.push(`/chapters/${chapterId}`);
      return;
    }
    router.push(`/${path}/${retreatId}`);
  }

  console.log(year);

  const getRetreat = trpc.retreat.getRetreat.useQuery(
    { chapterId: chapterId ?? "", year: year ?? new Date().getFullYear() },
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
            </GridItem>
            <GridItem></GridItem>

            <GridItem>
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
            backgroundColor={pageClicked == 1 ? "#54A9DD" : "#F9F9F9"}
            width="98%"
            height="50px"
            justifyContent="left"
            fontFamily="nunito"
            mt="15px"
            mb="2px"
            p="10px"
            onClick={() => {
              handleClick("retreat");
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
                backgroundColor={pageClicked == 2 ? "#54A9DD" : "#F9F9F9"}
                onClick={() => {
                  handleClick("retreat-expenses");
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
                backgroundColor={pageClicked == 3 ? "#54A9DD" : "#F9F9F9"}
                onClick={() => {
                  router.push(`/backlog/${retreatId}/`);
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
            backgroundColor={pageClicked == 4 ? "#54A9DD" : "#F9F9F9"}
            width="98%"
            height="50px"
            justifyContent="left"
            fontFamily="nunito"
            mt="2px"
            mb="2px"
            p="10px"
            onClick={() => {
              router.push(`/planning/${retreatId}/`);
              setClicked(4);
            }}
          >
            Fundraising Planning
          </Button>
          <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(15, 1fr)">
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
                backgroundColor={pageClicked == 6 ? "#54A9DD" : "#F9F9F9"}
                onClick={() => {
                  handleClick("hospitality");
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
                backgroundColor={pageClicked == 7 ? "#54A9DD" : "#F9F9F9"}
                onClick={() => {
                  router.push(`/backlog/fundraiser/${retreatId}/`);
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
            backgroundColor={pageClicked == 8 ? "#54A9DD" : "#F9F9F9"}
            onClick={() => {
              setClicked(8);
              router.push(`/funds/${retreatId}/`);
            }}
          >
            Raised Funds
          </Button>

          <HStack>
            <IconButton
              mt={"20px"}
              icon={
                <IoIosLogOut
                  size="30px"
                  onClick={() => {
                    router.push("/logout");
                  }}
                />
              }
              aria-label={"logout"}
            />
            <Button
              hidden={!isAdmin}
              fontFamily="nunito"
              borderRadius="none"
              mt="20px"
              width="50%"
              justifyContent="left"
              backgroundColor={pageClicked == 9 ? "#54A9DD" : "#F9F9F9"}
              color="red"
              onClick={() => {
                setClicked(9);
                deleteModal.onOpen(); // Open the DeleteConfirmation modal using useDisclosure
              }}
            >
              Delete Current Year
            </Button>

            <Image
              src="/netlify.png"
              alt="Netlify"
              height="30px"
              mt="20px"
              ml="auto"
              mr="0px"
            />
          </HStack>
        </Box>
      </Box>
      <NewRetreatYearModal
        isOpen={isOpenAddYearModal}
        onClose={onCloseAddYearModal}
        chapterName={chapter.name}
      ></NewRetreatYearModal>
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        handleDelete={handleDeleteYear}
      />
    </>
  );
};

export default Sidebar;
