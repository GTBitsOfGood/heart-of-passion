import { Box } from "@chakra-ui/react";
import { FormDonation } from "~/common/types";
import { RetreatDropdown } from "./RetreatDropdown";
import { useCallback } from "react";

export default function FormDonationEntry({
  formDonation,
  referenceNumber,
  retreatOptions,
  updateRetreat,
}: {
  formDonation: FormDonation;
  referenceNumber: string;
  retreatOptions: { name: string; id: string }[];
  updateRetreat: (referenceNumber: string, retreatId: string) => void;
}) {
  const retreat = formDonation.retreatId
    ? formDonation.retreatId
    : "Uncategorized";

  const handleUpdateRetreat = useCallback(
    (retreatId: string) => {
      updateRetreat(referenceNumber, retreatId);
    },
    [referenceNumber, updateRetreat],
  );

  return (
    <>
      <Box>{formDonation.name}</Box>
      <Box>{formDonation.amount}</Box>
      <Box>{formDonation.date.toLocaleDateString()}</Box>
      <Box>
        <RetreatDropdown
          retreats={retreatOptions}
          selectedRetreat={retreat}
          setSelectedRetreat={handleUpdateRetreat}
        />
      </Box>
      <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
        {formDonation.note ?? ""}
      </Box>
    </>
  );
}
