import {
  Box,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "~/utils/api";
import "@fontsource/oswald/700.css";
import Sidebar from "~/components/Sidebar";
import Select from "react-select";
import PlanningHandler from "~/components/FundraisingPlanning/PlanningHandler";
import { FundraisingPlanningModal } from "~/components/FundraisingPlanningModal";
import { Fundraiser } from "~/common/types";
import { fundraiserRouter } from "~/server/api/routers/fundraiser";

export enum PlanningSort {
  ViewByDate = "View by Date",
  LowestCost = "Lowest Cost",
  HighestCost = "Highest Cost",
}

export default function Planning() {
  const router = useRouter();
  const { id: retreatId }: { id?: string } = router.query;

  const retreat = trpc.retreat.getRetreatById.useQuery(retreatId!, {
    enabled: !!retreatId,
  })?.data;

  const {
    isOpen: isOpenFundraisingPlanningModal,
    onOpen: onOpenFundraisingPlanningModal,
    onClose: onCloseFundraisingPlanningModal,
  } = useDisclosure();

  const fundraisers = trpc.fundraiser.getFundraisers.useQuery(retreatId!, {
    enabled: !!retreatId,
  }).data;

  const chapter = trpc.chapter.getChapterByRetreatId.useQuery(retreatId!, {
    enabled: !!retreatId,
  })?.data;

  const sortOptions = Object.values(PlanningSort).map((sortMethod) => ({
    value: sortMethod,
    label: sortMethod,
  }));
  const [sortMethod, setSortMethod] = useState<PlanningSort>(
    PlanningSort.ViewByDate,
  );

  return (
    <>
      <Box>
        {fundraisers && (
          <Box display={"flex"}>
            <Box>{chapter ? <Sidebar chapter={chapter} year={retreat?.year} retreatId={retreatId} pageClicked={4}/> : <Spinner />}</Box>
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
                    onClick={onOpenFundraisingPlanningModal}
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
                  <FundraisingPlanningModal
                    isOpen={isOpenFundraisingPlanningModal}
                    onClose={onCloseFundraisingPlanningModal}
                  />
                </Box>
              </Box>
              <PlanningHandler
                sortMethod={sortMethod}
                fundraisers={fundraisers}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
