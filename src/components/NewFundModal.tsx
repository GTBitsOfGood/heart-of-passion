import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useReducer, ChangeEvent } from "react";
import { RadioDropdown } from "./RadioDropdown";
import { Donor, Fund, fundSchema, donorSchema } from "~/common/types";
import { trpc } from "~/utils/api";
import { SPONSOR_LEVEL_OPTIONS, STATUS_OPTIONS } from "~/server/models/Donor";

type NewFundProps = {
  isOpen: boolean;
  onClose: () => void;
  fund: Fund | null;
  create: boolean;
  retreatId: string;
};

type State = {
  fund: Omit<Partial<Fund>, "source"> & { source: string };
  trackDonor: boolean;
  donor: Partial<Donor> & { sponsorLevel: string; status: string };

  errors: ErrorState<keyof Fund, keyof Donor>;
};

type ErrorState<F extends keyof Fund, D extends keyof Donor> = {
  fund: {
    [key in F]?: string[];
  };

  donor: {
    [key in D]?: string[];
  };
};

type Action<T extends keyof State = keyof State> =
  | {
      type: "TOGGLE_TRACK_DONOR";
    }
  | {
      type: "UPDATE_FUND";
      value: Partial<Fund>;
    }
  | {
      type: "UPDATE_DONOR";
      value: Partial<Donor>;
    }
  | {
      type: "UPDATE_ERRORS";
      errors: Partial<ErrorState<keyof Fund, keyof Donor>>;
    }
  | { type: "RESET"; payload?: Partial<State> };

const INITIAL_STATE: State = {
  fund: {
    source: "Other",
  },
  donor: {
    sponsorLevel: SPONSOR_LEVEL_OPTIONS[0]!,
    status: STATUS_OPTIONS[0]!,
  },
  errors: {
    fund: {},
    donor: {},
  },

  trackDonor: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TOGGLE_TRACK_DONOR":
      return { ...state, trackDonor: !state.trackDonor };
    case "UPDATE_FUND":
      return { ...state, fund: { ...state.fund, ...action.value } };
    case "UPDATE_DONOR":
      return { ...state, donor: { ...state.donor, ...action.value } };
    case "RESET":
      return { ...INITIAL_STATE, ...action.payload };
    default:
      return state;
  }
};

export const NewFundModal = ({
  isOpen,
  onClose,
  fund,
  create,
  retreatId,
}: NewFundProps) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (!fund) return;
    dispatch({
      type: "RESET",
      payload: {
        fund: {
          name: fund.name,
          date: fund.date,
          amount: fund.amount,
          source: fund.source,
        },
      },
    });
  }, [fund]);

  const {
    isOpen: isError,
    onClose: onCloseError,
    onOpen: onOpenError,
  } = useDisclosure({ defaultIsOpen: false });

  const toast = useToast();
  const trpcUtils = trpc.useUtils();

  const createFund = trpc.fund.createFund.useMutation({
    onSuccess: () => {
      trpcUtils.fund.invalidate();
      trpcUtils.chapter.invalidate();
    },
  });
  const updateFund = trpc.fund.updateFund.useMutation({
    onSuccess: () => {
      trpcUtils.fund.invalidate();
      trpcUtils.chapter.invalidate();
    },
  });
  const deleteFund = trpc.fund.deleteFund.useMutation({
    onSuccess: () => {
      trpcUtils.fund.invalidate();
      trpcUtils.chapter.invalidate();
    },
  });
  const createDonor = trpc.donor.createDonor.useMutation({
    onSuccess: () => {
      trpcUtils.donor.invalidate();
    },
  });

  // For the fund's "Source" dropdown
  const fundraiserData = trpc.fundraiser.getFundraisers.useQuery(retreatId, {
    enabled: !!retreatId,
  }).data;
  const sourceOptions = useMemo(
    () => ["Other"].concat(fundraiserData?.map((f) => f.name) ?? []),
    [fundraiserData],
  );

  const onCloseModal = () => {
    dispatch({
      type: "RESET",
    });

    onCloseError();
    onClose();
  };

  const handleSave = async () => {
    const fundResult = fundSchema.safeParse(state.fund);
    if (!fundResult.success) {
      const fundErrors = fundResult.error.flatten().fieldErrors;
      const errorMsg = fundResult.error.issues
        .map((issue) => issue.message)
        .join("\n");

      dispatch({
        type: "UPDATE_ERRORS",
        errors: {
          fund: fundErrors,
        },
      });
      toast({
        title: "ERROR IN FUND FIELDS",
        description: errorMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    let donor: Donor | null = null;

    if (state.trackDonor) {
      const unvalidatedDonor = {
        donorName: state.fund.name,
        source: state.fund.source,
        ...state.donor,
      };

      const donorResult = donorSchema.safeParse(unvalidatedDonor);
      if (!donorResult.success) {
        const donorErrors = donorResult.error.flatten().fieldErrors;
        const errorMsg = donorResult.error.issues
          .map((issue) => issue.message)
          .join("\n");

        dispatch({
          type: "UPDATE_ERRORS",
          errors: {
            donor: donorErrors,
          },
        });
        toast({
          title: "ERROR IN DONOR FIELDS",
          description: errorMsg,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      donor = donorResult.data;
    }

    // Create or update the fund
    if (create) {
      createFund.mutate({
        retreatId,
        fundDetails: fundResult.data,
      });

      if (state.trackDonor && donor) {
        createDonor.mutate(donor);
      }
    } else {
      updateFund.mutate({
        fundId: fund?._id!,
        updates: {
          name: fundResult.data.name,
          date: fundResult.data.date,
          amount: fundResult.data.amount,
          source: fundResult.data.source,
        },
      });
    }

    onCloseModal();
  };

  const handleDelete = () => {
    if (create || !fund?._id) return;
    deleteFund.mutate(fund._id);
    onCloseModal();
  };

  const handleFundChange = <T extends keyof Fund>(field: T, value: Fund[T]) => {
    dispatch({
      type: "UPDATE_FUND",
      value: {
        [field]: value,
      },
    });
  };

  const handleDonorChange = <T extends keyof Donor>(
    field: T,
    value: Donor[T],
  ) => {
    dispatch({
      type: "UPDATE_DONOR",
      value: {
        [field]: value,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} isCentered>
      <ModalOverlay />
      <ModalContent
        width="550px"
        maxWidth="550px"
        borderRadius="none"
        boxShadow="0px 4px 29px 0px #00000040"
      >
        <ModalHeader />
        <ModalCloseButton
          borderRadius="50%"
          outline="solid"
          width="28px"
          height="28px"
        />
        <ModalBody pl="30px" pr="30px" lineHeight="24px">
          <VStack
            fontFamily="body"
            fontSize="16px"
            fontWeight="light"
            alignItems="start"
            spacing="5px"
            mt="24px"
          >
            <HStack align="start" spacing="35px">
              <FormControl isRequired isInvalid={!!state.errors.fund.name}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Name
                </FormLabel>
                <Input
                  placeholder="Jane Doe"
                  color="black"
                  _placeholder={{ color: "#666666" }}
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  width="180px"
                  height="30px"
                  value={state.fund.name}
                  onChange={(e) => handleFundChange("name", e.target.value)}
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage>Name is required</FormErrorMessage>
                </Box>
              </FormControl>

              <FormControl isRequired isInvalid={!!state.errors.fund.source}>
                <FormLabel fontWeight="600" mb="4px">
                  Source
                </FormLabel>
                <RadioDropdown
                  options={sourceOptions}
                  selectedOption={state.fund.source}
                  setSelectedOption={(value) =>
                    handleFundChange("source", value)
                  }
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage>
                    {state.errors.fund.source?.join("\n")}
                  </FormErrorMessage>
                </Box>
              </FormControl>
            </HStack>

            <HStack align="start" spacing="35px">
              <FormControl isRequired isInvalid={!!state.errors.fund.date}>
                <FormLabel textColor="black" fontWeight="600" mb="4px">
                  Date
                </FormLabel>
                <Input
                  placeholder="2/24/2022"
                  color="black"
                  _placeholder={{ color: "#666666" }}
                  border="1px solid #D9D9D9"
                  borderRadius="0px"
                  width="180px"
                  height="30px"
                  type="date"
                  value={state.fund.date}
                  onChange={(e) => handleFundChange("date", e.target.value)}
                />
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage>
                    {state.errors.fund.date?.join("\n")}
                  </FormErrorMessage>
                </Box>
              </FormControl>

              <FormControl isRequired isInvalid={!!state.errors.fund.amount}>
                <FormLabel fontWeight="600" mb="4px">
                  Amount
                </FormLabel>
                <InputGroup width="180px">
                  <InputLeftAddon width="40px" height="30px" borderRadius="0px">
                    $
                  </InputLeftAddon>
                  <Input
                    type="number"
                    height="30px"
                    borderRadius="0px"
                    border="1px solid #D9D9D9"
                    placeholder="150"
                    value={state.fund.amount}
                    onChange={(e) =>
                      handleFundChange("amount", Number(e.target.value))
                    }
                  />
                </InputGroup>
                <Box minHeight="20px" mt={2}>
                  <FormErrorMessage>
                    {state.errors.fund.amount?.join("\n")}
                  </FormErrorMessage>
                </Box>
              </FormControl>
            </HStack>
          </VStack>

          <Box mt="20px">
            <FormControl display="flex" alignItems="center">
              <FormLabel fontWeight="600" mb="0">
                Also track Donor?
              </FormLabel>
              <Switch
                isChecked={state.trackDonor}
                onChange={() =>
                  dispatch({
                    type: "TOGGLE_TRACK_DONOR",
                  })
                }
              />
            </FormControl>
          </Box>

          {state.trackDonor && (
            <Box
              mt="15px"
              border="1px solid #D9D9D9"
              padding="15px"
              width="100%"
            >
              <VStack align="start" spacing="15px" width="100%">
                {/* Student Name + Email (one row) */}
                <HStack width="100%" align="start" spacing="15px">
                  <FormControl
                    flex="1"
                    isRequired
                    isInvalid={!!state.errors.donor.studentName}
                  >
                    <FormLabel fontWeight="600">Student Name</FormLabel>
                    <Input
                      placeholder="Emily Doe"
                      borderRadius="0"
                      border="1px solid #D9D9D9"
                      height="30px"
                      value={state.donor.studentName}
                      onChange={(e) =>
                        handleDonorChange("studentName", e.target.value)
                      }
                    />
                    <FormErrorMessage>
                      {state.errors.donor.studentName?.join("\n")}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    flex="1"
                    isInvalid={!!state.errors.donor.donorEmail}
                  >
                    <FormLabel fontWeight="600">Donor Email</FormLabel>
                    <Input
                      placeholder="jdoe@example.com"
                      borderRadius="0"
                      border="1px solid #D9D9D9"
                      height="30px"
                      type="email"
                      value={state.donor.donorEmail}
                      onChange={(e) =>
                        handleDonorChange("donorEmail", e.target.value)
                      }
                    />
                    <FormErrorMessage>
                      {state.errors.donor.donorEmail?.join("\n")}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>

                {/* Address (full width) */}
                <FormControl>
                  <FormLabel fontWeight="600">Address</FormLabel>
                  <Input
                    placeholder="123 Jane St"
                    borderRadius="0"
                    border="1px solid #D9D9D9"
                    width="100%"
                    height="30px"
                    value={state.donor.address}
                    onChange={(e) =>
                      handleDonorChange("address", e.target.value)
                    }
                  />
                </FormControl>

                {/* Sponsor Level + Status (one row) */}
                <HStack width="100%" align="start" spacing="15px">
                  <FormControl
                    flex="1"
                    isRequired
                    isInvalid={!!state.errors.donor.sponsorLevel}
                  >
                    <FormLabel fontWeight="600">Sponsorship Level</FormLabel>
                    <RadioDropdown
                      options={SPONSOR_LEVEL_OPTIONS}
                      selectedOption={state.donor.sponsorLevel}
                      setSelectedOption={(value) =>
                        handleDonorChange("sponsorLevel", value)
                      }
                    />
                    <FormErrorMessage>
                      {state.errors.donor.sponsorLevel?.join("\n")}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    flex="1"
                    isRequired
                    isInvalid={!!state.errors.donor.status}
                  >
                    <FormLabel fontWeight="600">Status</FormLabel>
                    <RadioDropdown
                      options={STATUS_OPTIONS}
                      selectedOption={state.donor.status}
                      setSelectedOption={(value) =>
                        handleDonorChange("status", value)
                      }
                    />
                    <FormErrorMessage>
                      {state.errors.donor.status?.join("\n")}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>

                {/* Notes (full width) */}
                <FormControl>
                  <FormLabel fontWeight="600">Notes</FormLabel>
                  <Textarea
                    border="1px solid #D9D9D9"
                    borderRadius="0"
                    resize="none"
                    height="60px"
                    value={state.donor.notes}
                    onChange={(e) => handleDonorChange("notes", e.target.value)}
                  />
                </FormControl>
              </VStack>
            </Box>
          )}
        </ModalBody>

        <ModalFooter pr="20px" pb="20px">
          <Button
            fontSize="16px"
            fontWeight="400"
            colorScheme="red"
            variant="outline"
            mr="15px"
            onClick={handleDelete}
            isDisabled={create}
          >
            DELETE
          </Button>
          <Button
            colorScheme="twitter"
            onClick={handleSave}
            fontSize="16px"
            fontWeight="400"
            mr="15px"
          >
            APPLY
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
