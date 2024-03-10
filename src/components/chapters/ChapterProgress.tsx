import { Text, Grid, GridItem } from "@chakra-ui/react";
import "@fontsource/oswald/600.css";
import ProgressBar from "@ramonak/react-progress-bar";
import { Chapter } from "src/common/types";

interface ChapterProgressProps {
  chapter: Chapter;
}

const ChapterProgress = ({ chapter }: ChapterProgressProps) => {
  const progress =
    chapter.fundExpected == 0
      ? 0
      : Math.floor((chapter?.fundActual / chapter?.fundExpected) * 100);

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
            ${chapter?.totalCost}
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
            ${chapter?.fundExpected}
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
            ${chapter?.fundActual}
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
