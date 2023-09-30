import {
  Text,
  Grid,
  GridItem,
  Flex,
  Spacer,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { BiSolidEdit } from "react-icons/bi";
import "@fontsource/oswald/600.css";
import ProgressBar from "@ramonak/react-progress-bar";
import { Chapter } from "common/types/types";
import ChapterProgress from "./ChapterProgress";

const ChapterCard = ({
  city,
  year,
  totalCost,
  fundExpected,
  fundActual,
}: Chapter) => {
  const progress = Math.floor((fundActual / fundExpected) * 100);
  return (
    <Box
      bgColor="#F9F9F9"
      border={"2px #EDEDED solid"}
      sx={{ borderRadius: "4%" }}
      h="350px"
      _hover={{ bg: "white", boxShadow: "lg" }}
    >
      <Flex mt="2" mr="2">
        <Spacer />
        <IconButton
          aria-label="settings"
          variant="ghost"
          height="40px"
          width="40px"
          icon={<BiSolidEdit size="20px" onClick={() => {}} />}
        />
      </Flex>

      <Text
        align="center"
        fontSize="40px"
        fontWeight="bold"
        fontFamily="oswald"
      >
        {city + " " + year}
      </Text>

      <ChapterProgress
        city={city.toUpperCase()}
        year={year}
        totalCost={totalCost}
        fundExpected={fundExpected}
        fundActual={fundActual}
      />
    </Box>
  );
};

export default ChapterCard;
