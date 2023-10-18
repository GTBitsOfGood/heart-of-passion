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
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { DropdownIcon } from "~/common/theme/icons";
import { Time, Times } from "~/common/types/types";

type NewTimeFormProps = {
  times: Times;
  setTimes: (updateFunction: (prevTimes: Times) => Times) => void;
  onOpenError: () => void;
  onCloseError: () => void;
  onCloseSide: () => void;
  selectedTime: Time | undefined;
  setSelectedTime: (t: Time | undefined) => void;
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
  const timeList = ["9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am"];
  const [day, setDay] = useState(selectedTime?.day ?? "Day 1");
  const editing = selectedTime !== undefined;

  const getTimeIndex = useCallback(
    (s: string, d: number) => {
      const ind = timeList.findIndex((e) => e === s);
      // console.log(ind);
      return ind === -1 ? d : ind;
    },
    [timeList],
  );

  const [startTime, setStartTime] = useState(
    getTimeIndex(selectedTime?.start ?? "-1", 0),
  );
  const [endTime, setEndTime] = useState(
    getTimeIndex(selectedTime?.end ?? "-1", 2),
  );
  const [endTimeError, setEndTimeError] = useState(false);

  useEffect(() => {
    setDay(selectedTime?.day ?? "Day 1");
    setStartTime(getTimeIndex(selectedTime?.start ?? "-1", 0));
    setEndTime(getTimeIndex(selectedTime?.end ?? "-1", 2));
  }, [selectedTime, getTimeIndex]);

  const handleApply = () => {
    if (!validateFields()) {
      onOpenError();
      return;
    }
    onCloseError();
    onCloseSide();
    //settimes
    const newTime: Time = {
      day: day,
      start: timeList[startTime] as string,
      end: timeList[endTime] as string,
    };
    setTimes((prevTimes) => {
      const updatedTimes = { ...prevTimes };
      if (editing) {
        updatedTimes[selectedTime.day] = (
          updatedTimes[selectedTime.day] ?? []
        ).filter((time) => {
          return (
            time.start !== selectedTime.start || time.end !== selectedTime.end
          );
        });
        updatedTimes[newTime.day] = [
          ...(updatedTimes[newTime.day] ?? []),
          newTime,
        ];
      } else {
        updatedTimes[newTime.day] = [
          ...(prevTimes[newTime.day] ?? []),
          newTime,
        ];
      }
      return updatedTimes;
    });
    setSelectedTime(undefined);
    // console.log(times);

    // setTimes(prevTimes:{} => ({
    //   ...prevTimes,
    //   "Day 1": [...prevTimes["Day 1"], valueToAppend],
    // }));
  };

  const validateFields = () => {
    if (endTime <= startTime) {
      setEndTimeError(true);
      return false;
    }

    const duplicate = times[day]?.some(
      (t) => t.end === timeList[endTime] && t.start === timeList[startTime],
    );
    if (duplicate) {
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
          <Menu>
            <MenuButton
              as={Button}
              width="220px"
              height="51px"
              textAlign="left"
              borderRadius="none"
              bg="white"
              border="1px solid #D9D9D9"
              rightIcon={<DropdownIcon width="31px" height="31px" />}
              fontSize="18px"
              fontWeight="400"
              lineHeight="24px"
              padding="0px"
              paddingLeft="10px"
            >
              {day}
            </MenuButton>
            <MenuList
              boxShadow={"0px 4px 15px 0px #00000040"}
              borderRadius="none"
              width="220px"
            >
              <MenuItem onClick={() => setDay("Day 1")}>Day 1</MenuItem>
              <MenuItem onClick={() => setDay("Day 2")}>Day 2</MenuItem>
              <MenuItem onClick={() => setDay("Day 3")}>Day 3</MenuItem>
              <MenuItem onClick={() => setDay("Day 4")}>Day 4</MenuItem>
            </MenuList>
          </Menu>
        </FormControl>
        <FormControl mt="23px" isRequired>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            Start
          </FormLabel>
          <Menu>
            <MenuButton
              as={Button}
              width="220px"
              textAlign="left"
              borderRadius="none"
              bg="white"
              border="1px solid #D9D9D9"
              rightIcon={<DropdownIcon width="31px" height="31px" />}
              fontSize="18px"
              fontWeight="400"
              lineHeight="24px"
              padding="0px"
              paddingLeft="10px"
            >
              {timeList[startTime]}
            </MenuButton>
            <MenuList
              boxShadow={"0px 4px 15px 0px #00000040"}
              borderRadius="none"
              width="220px"
            >
              {timeList.map((time, i) => {
                return (
                  <MenuItem key={i} onClick={() => setStartTime(i)}>
                    {time}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
        </FormControl>
        <FormControl mt="16px" isInvalid={endTimeError} isRequired>
          <FormLabel fontWeight="500" fontSize="20px" lineHeight="27px">
            End
          </FormLabel>
          <Menu>
            <MenuButton
              as={Button}
              width="220px"
              textAlign="left"
              borderRadius="none"
              bg="white"
              border="1px solid"
              rightIcon={
                <DropdownIcon
                  color={endTimeError ? "#C63636" : "black"}
                  width="31px"
                  height="31px"
                />
              }
              fontSize="18px"
              fontWeight="400"
              lineHeight="24px"
              padding="0px"
              paddingLeft="10px"
              textColor={endTimeError ? "#C63636" : "black"}
              borderColor={endTimeError ? "#C63636" : "#D9D9D9"}
            >
              {timeList[endTime]}
            </MenuButton>
            <MenuList
              boxShadow={"0px 4px 15px 0px #00000040"}
              borderRadius="none"
              width="220px"
            >
              {timeList.map((time, i) => {
                return (
                  <MenuItem
                    key={i}
                    onClick={() => {
                      setEndTime(i);
                      setEndTimeError(false);
                    }}
                  >
                    {time}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
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
