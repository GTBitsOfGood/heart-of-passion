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

const ChapterCard = ({
  name,
  year,
  totalCost,
  fundExpected,
  fundActual,
}: {
  name: string;
  year: string;
  totalCost: number;
  fundExpected: number;
  fundActual: number;
}) => {
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
        {name + " " + year}
      </Text>

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

      <Grid templateColumns="repeat(3, 1fr)" gap={6} ml="5" mr="5">
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
    </Box>
  );
};

export default ChapterCard;
