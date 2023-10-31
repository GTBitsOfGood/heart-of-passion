import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Retreat } from "~/common/types";
import { trpc } from "~/utils/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  chapterName: string;
};

export const NewRetreatYearModal = ({
  isOpen,
  onClose,
  chapterName,
}: Props) => {
  const onCloseModal = () => {
    setYear("");
    setYearError(0);
    onClose();
  };

  const [year, setYear] = useState("");
  // 0 - none
  // 1 - blank year
  // 2 - year already exists
  const [yearError, setYearError] = useState(0);

  const handleYearChange = (event: React.FormEvent<HTMLInputElement>) =>
    setYear(event.currentTarget.value);

  const trpcUtils = trpc.useContext();

  const { data: chapterId } =
    trpc.chapter.getChapterIdByName.useQuery(chapterName);

  const existsRetreat = trpc.retreat.existsRetreat.useQuery(
    { chapterId: chapterId ?? "", year: parseInt(year) },
    { enabled: false },
  );

  const createRetreat = trpc.retreat.createRetreat.useMutation({
    onSuccess: () => {
      trpcUtils.retreat.invalidate();
    },
  });

  const handleSave = async () => {
    if (year === "") {
      setYearError(1);
      return;
    }
    const { data: exists } = await existsRetreat.refetch();

    if (exists) {
      setYearError(2);
      return;
    }
    setYearError(0);

    const retreat: Retreat = {
      chapterId: chapterId ?? "",
      year: parseInt(year),
    };
    await createRetreat.mutate(retreat);

    onCloseModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      isCentered
      closeOnOverlayClick={true}
    >
      <ModalOverlay />
      <ModalContent
        width="327px"
        maxWidth="327px"
        height="195px"
        maxHeight="195px"
      >
        {/* <ModalHeader></ModalHeader> */}
        <ModalCloseButton
          width="28px"
          height="28px"
          top="12px"
          right="23px"
          borderRadius="50%"
          outline="solid"
        ></ModalCloseButton>
        <ModalBody pl="33px" pt="40px">
          <VStack
            fontFamily="body"
            fontSize="16px"
            lineHeight="24px"
            fontWeight="600"
            spacing="5px"
          >
            <FormControl isInvalid={yearError !== 0}>
              <FormLabel fontWeight="600" mb="4px">
                Year
              </FormLabel>
              <Input
                fontWeight="600"
                placeholder="2020"
                color="#666666"
                _placeholder={{ color: "#666666" }}
                border="1px solid #D9D9D9"
                borderRadius="0px"
                width="240px"
                height="30px"
                value={year}
                onChange={handleYearChange}
                pl="11px"
                type="number"
              />
              <Box minHeight="20px" mt={2}>
                <FormErrorMessage mt={0}>
                  {yearError === 1 && `Year is required`}
                  {yearError === 2 && `Year already exists`}
                </FormErrorMessage>
              </Box>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter pr="54px" pb="26px" pt="0px">
          <Button
            colorScheme="twitter"
            bg="hop_blue.500"
            onClick={handleSave}
            fontFamily="oswald"
            fontSize="20px"
            fontWeight="400"
            borderRadius="6px"
            padding="4px 8px 4px 8px"
            width="77px"
            height="38px"
          >
            APPLY
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
