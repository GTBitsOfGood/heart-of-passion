import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  Input,
  useDisclosure,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { DateObject } from "~/common/types";

type NewTimeFormProps = {
  times: DateObject[];
  setTimes: (updateFunction: (prevTimes: DateObject[]) => DateObject[]) => void;
  onOpenError: () => void;
  onCloseError: () => void;
  onCloseSide: () => void;
  selectedTime: DateObject | undefined;
  setSelectedTime: (t: DateObject | undefined) => void;
};

export const NewTimeForm = ({
  times,
  setTimes,
  onOpenError,
  onCloseError,
  onCloseSide,
  selectedTime,
  setSelectedTime,
}: NewTimeFormProps) => {
  const [day, setDay] = useState(selectedTime?.day ?? 1);
  const editing = selectedTime !== undefined;

  const startTimeRef = useRef<any>();
  const endTimeRef = useRef<any>();

  const toast = useToast();

  const to24hrs = (time: string): string => {
    let [hours, minutes] = time.split(/[:\s]/);
    let period = time.slice(-2);
    hours =
      period === "pm" && hours !== "12"
        ? String(Number(hours) + 12)
        : period === "am" && hours === "12"
        ? "00"
        : hours;
    return `${hours}:${minutes}`;
  };

  const to12hrs = (time: string): string => {
    let [hours, minutes] = time.split(":");
    let period = Number(hours) >= 12 ? "pm" : "am";
    hours =
      hours === "00"
        ? "12"
        : Number(hours) > 12
        ? String(Number(hours) - 12)
        : hours;
    return `${hours}:${minutes} ${period}`;
  };

  const toMinutes = (time: string): number => {
    let [hours, minutes] = to24hrs(time).split(":");
    return Number(hours) * 60 + Number(minutes);
  };

  const handleStartTime = () => {
    setStartTime(to12hrs(startTimeRef.current.value));
  };
  const handleEndTime = () => {
    setEndTime(to12hrs(endTimeRef.current.value));
    setEndTimeError(false);
  };

  const [startTime, setStartTime] = useState<string>(
    selectedTime?.from ?? "09:00 am",
  );
  const [endTime, setEndTime] = useState<string>(
    selectedTime?.to ?? "10:00 am",
  );
  const [endTimeError, setEndTimeError] = useState(false);

  const newTime: DateObject = {
    day: day,
    from: startTime,
    to: endTime,
  };

  useEffect(() => {
    setDay(selectedTime?.day ?? 1);
    setStartTime(selectedTime?.from ?? "09:00 am");
    setEndTime(selectedTime?.to ?? "10:00 am");
  }, [selectedTime]);

  const handleApply = () => {
    if (!validateFields()) {
      onOpenError();
      return;
    }
    onCloseError();
    onCloseSide();
    //settimes

    setTimes((prevTimes) => {
      let updatedTimes = prevTimes;
      if (editing) {
        updatedTimes = updatedTimes.filter((time) => {
          return (
            time.day !== selectedTime.day ||
            time.from !== selectedTime.from ||
            time.to !== selectedTime.to
          );
        });
        updatedTimes = [...updatedTimes, newTime];
      } else {
        updatedTimes = [...updatedTimes, newTime];
      }
      updatedTimes.sort((a, b) => {
        if (a.day === b.day) return toMinutes(a.from) - toMinutes(b.from);
        return a.day - b.day;
      });

      return updatedTimes;
    });
    setSelectedTime(undefined);
  };

  const handleDelete = () => {
    onCloseError();
    onCloseSide();
    setTimes((prevTimes) => {
      let updatedTimes = prevTimes.filter((e) => e !== selectedTime);
      return updatedTimes;
    });
    setSelectedTime(undefined);
  };

  const validateFields = () => {
    if (toMinutes(endTime) <= toMinutes(startTime)) {
      setEndTimeError(true);
      toast({
        title: "Error",
        description: "End time must be after start time.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    const sameTime = (t1: DateObject, t2: DateObject) => {
      return t1.day === t2.day && t1.from === t2.from && t1.to === t2.to;
    };

    const duplicate = times?.some((time) =>
      sameTime(time, { day, from: startTime, to: endTime }),
    );

    if (duplicate && (!selectedTime || !sameTime(selectedTime, newTime))) {
      setEndTimeError(true);
      return false;
    }
    setEndTimeError(false);
    return true;
  };

  return (
    <VStack height="100%" justifyContent="space-between">
      <VStack alignItems="start" spacing="0px">
        <FormControl isRequired>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Day
          </FormLabel>
          <Select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            width="220px"
            height="51px"
            borderRadius="none"
            bg="white"
            border="1px solid #D9D9D9"
            fontSize="18px"
            fontWeight="400"
            lineHeight="24px"
            padding="0px"
            paddingLeft="10px"
          >
            <option value="1">Day 1</option>
            <option value="2">Day 2</option>
            <option value="3">Day 3</option>
            <option value="4">Day 4</option>
          </Select>
        </FormControl>
        <FormControl mt="23px" isRequired>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Start
          </FormLabel>
          <Input
            ref={startTimeRef}
            type="time"
            step={900}
            value={to24hrs(startTime)}
            onChange={handleStartTime}
          />
        </FormControl>
        <FormControl mt="16px" isInvalid={endTimeError} isRequired>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            End
          </FormLabel>
          <Input
            ref={endTimeRef}
            type="time"
            step={900}
            value={to24hrs(endTime)}
            onChange={handleEndTime}
          />
        </FormControl>
      </VStack>
      <HStack width="100%" justifyContent="end" mb="34px">
        <Button
          fontFamily="heading"
          fontSize="20px"
          fontWeight="400"
          colorScheme="red"
          color="hop_red.500"
          variant="outline"
          borderRadius="6px"
          mr="13px"
          onClick={handleDelete}
        >
          DELETE
        </Button>
        <Button
          colorScheme="twitter"
          bg="hop_blue.500"
          onClick={handleApply}
          borderRadius="6px"
          fontFamily="heading"
          fontSize="20px"
          fontWeight="400"
        >
          APPLY
        </Button>
      </HStack>
    </VStack>
  );
};
