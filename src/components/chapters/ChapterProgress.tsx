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

const ChapterProgress = ({
  city,
  year,
  totalCost,
  fundExpected,
  fundActual,
}: Chapter) => {
  const progress = Math.floor((fundActual / fundExpected) * 100);
  return (
    <>
      <ProgressBar
        completed={progress}
        bgColor="#54A9DD"
        height="80px"
        width="90%"
        margin="18px"
        borderRadius="2%"
        baseBgColor="white"
        labelSize="36px"
        labelAlignment="left"
        customLabelStyles={{
          fontFamily: "oswald",
          marginLeft: "30px",
          color: "black",
        }}
      />

      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={6}
        ml="5"
        mr="5"
        justifyContent="center"
      >
        <GridItem>
          <Text
            align="center"
            fontWeight="bold"
            fontSize="36px"
            fontFamily="oswald"
          >
            ${totalCost}
          </Text>
          <Text align="center" fontSize="13px">
            Total Cost
          </Text>
        </GridItem>
        <GridItem>
          <Text
            align="center"
            fontWeight="bold"
            fontSize="36px"
            fontFamily="oswald"
          >
            ${fundExpected}
          </Text>
          <Text align="center" fontSize="13px">
            Fundraising Expected
          </Text>
        </GridItem>
        <GridItem>
          <Text
            align="center"
            fontWeight="bold"
            fontSize="36px"
            fontFamily="oswald"
          >
            ${fundActual}
          </Text>
          <Text align="center" fontSize="13px">
            Fundraising Actual
          </Text>
        </GridItem>
      </Grid>
    </>
  );
};

export default ChapterProgress;
