import { Heading, Stack, Flex } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import FundEntry from "./FundEntry";
import { Fund, FundList as FundListType, Fundraiser } from "src/common/types";
import { trpc } from "~/utils/api";

interface FundListProps extends FundListType {
  handleSelectFund: (fund: Fund) => void;
  retreatId: string
}

// export default function FundList({ title, funds }: FundListType) {
export default function FundList({
  handleSelectFund,
  title,
  funds,
  retreatId,
}: FundListProps) {
  const [open, setOpen] = useState(true);
  const fundsRendered = funds.map((fund: Fund) => (
    <FundEntry
      key={fund._id + fund.name + fund.amount + fund.date}
      handleSelectFund={handleSelectFund}
      fund={fund}
    />
    // <FundEntry setSelectedFund = {setSelectedFund} fundId = {fund._id!} key={fund.name} {...fund} /> //key needs to be from backend once we wire it up, cannot have duplicates
  ));

  const trpcUtils = trpc.useUtils();

  const fundraiserData = trpc.fundraiser.getFundraisers.useQuery(retreatId, {
    enabled: !!retreatId,
  }).data;

  const updateFundraiser = trpc.fundraiser.updateFundraiser.useMutation({
    onSuccess: () => {
      trpcUtils.fundraiser.invalidate();
    },
  });
  const updateActualProfits = () => {
    fundraiserData?.forEach((fundraiser) => {
      let totalProfit = 0
      funds.forEach((fund) => {
        if (fund.source == fundraiser.name) {
          totalProfit+=fund.amount
        }
      })
      updateFundraiser.mutate({
        fundraiserId: fundraiser?._id,
        fundraiser: {...fundraiser, actualProfit: totalProfit},
      });
    })
  }

  useEffect(() => {
    updateActualProfits()
  }, [funds])

  return (
    <>
      <Stack w="95%" py="0.5em" px="1em">
        <Flex
          justifyContent="space-between"
          onClick={() => setOpen(!open)}
          borderBottom="1px #AEAEAE solid"
          p=".5em"
          marginBottom="1em"
        >
          <Heading size="md" textTransform="capitalize">
            {title}
          </Heading>
          {open ? <TriangleUpIcon /> : <TriangleDownIcon />}
        </Flex>
        <Stack pl="3em" gap="1em">
          {open ? fundsRendered : <></>}
        </Stack>
      </Stack>
    </>
  );
}
