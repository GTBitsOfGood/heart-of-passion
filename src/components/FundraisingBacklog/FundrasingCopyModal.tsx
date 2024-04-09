import { Fundraiser } from "~/common/types";
import { FundraisingPlanningModal } from "../FundraisingPlanningModal";

type BacklogCopyModalProps = {
  event: Fundraiser | undefined;
  copyToCurrentRetreat?: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export default function BacklogCopyModal({
  event,
  copyToCurrentRetreat,
  isOpen,
  onOpen,
  onClose,
}: BacklogCopyModalProps) {
  return (
    <>
      <FundraisingPlanningModal
        isOpen={isOpen}
        onClose={onClose}
        isCopy={true}
        copyToCurrentRetreat={copyToCurrentRetreat}
        retreatId="UNNEEDED BECAUSE NOT USED WHEN COPY"
        copyFundraiser={event}
      />
    </>
  );
}
