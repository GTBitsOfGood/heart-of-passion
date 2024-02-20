import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DateObject, Event } from "~/common/types";
import { NewEventModal } from "../NewEventModal";

type BacklogCopyModalProps = {
  event: Event | undefined;
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
      <NewEventModal
        isOpen={isOpen}
        onClose={onClose}
        isCopy={false}
        copyToCurrentRetreat={copyToCurrentRetreat}
        retreatId="temp"
        copyEvent={event}
        isFundraiser={true}
      />
    </>
  );
}
