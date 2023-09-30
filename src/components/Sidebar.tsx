import {
  Text,
  Grid,
  GridItem,
  Button,
  Image,
  Box,
  Divider,
  Select,
} from "@chakra-ui/react";
import ChapterProgress from "./chapters/ChapterProgress";
import { Chapter } from "common/types/types";
import { useState } from "react";

const Sidebar = ({
  city,
  year,
  totalCost,
  fundExpected,
  fundActual,
}: Chapter) => {
  const [clicked, setClicked] = useState(0);
  return (
    <Box pos="fixed" w="400px" h="100%" overflow="hidden">
      <Box
        bg={"#F9F9F9"}
        borderRight="1px"
        borderRightColor={"#EDEDED"}
        marginRight="-20px"
        paddingRight="20px"
        h="100%"
        scrollBehavior={"smooth"}
        overflowY={"scroll"}
        p="20px"
      >
        <Grid templateColumns="repeat(2, 1fr)" mb="3%">
          <GridItem>
            <Image src="/logo.png" alt="Heart of Passion Logo" height="120px" />
          </GridItem>
          <GridItem>
            <Text
              align="center"
              fontSize="36px"
              fontFamily="oswald"
              fontWeight="bold"
            >
              {city.toUpperCase()}
            </Text>
            <Select
              placeholder={year.toString()}
              fontSize="36px"
              fontFamily="nunito"
              variant="unstyled"
              textAlign="right"
            >
              {/* TO DO: add other years.. not sure what years?*/}
              <option>Add Archive</option>
            </Select>
          </GridItem>
        </Grid>
        <ChapterProgress
          city={city.toUpperCase()}
          year={year}
          totalCost={totalCost}
          fundExpected={fundExpected}
          fundActual={fundActual}
        />
        <Button
          border={"2px black solid"}
          borderRadius="none"
          backgroundColor={clicked == 1 ? "#54A9DD" : "#F9F9F9"}
          width="100%"
          height="50px"
          justifyContent="left"
          fontFamily="nunito"
          mt="15px"
          mb="2px"
          p="10px"
          onClick={() => {
            setClicked(1);
          }}
        >
          Retreat Planning
        </Button>
        <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(15, 1fr)">
          <GridItem
            rowSpan={2}
            paddingLeft="15px"
            paddingTop="10px"
            paddingBottom="10px"
          >
            <Divider
              orientation="vertical"
              borderColor="black"
              w="10px"
              borderLeftWidth="2px"
            />
          </GridItem>
          <GridItem colSpan={14}>
            <Button
              fontFamily="nunito"
              borderRadius="none"
              p="10px"
              width="100%"
              justifyContent="left"
              backgroundColor={clicked == 2 ? "#54A9DD" : "#F9F9F9"}
              onClick={() => {
                setClicked(2);
              }}
            >
              Expenses
            </Button>
          </GridItem>
          <GridItem colSpan={14}>
            <Button
              fontFamily="nunito"
              borderRadius="none"
              p="10px"
              width="100%"
              justifyContent="left"
              backgroundColor={clicked == 3 ? "#54A9DD" : "#F9F9F9"}
              onClick={() => {
                setClicked(3);
              }}
            >
              Previous Retreat Events
            </Button>
          </GridItem>
        </Grid>
        <Button
          border={"2px black solid"}
          borderRadius="none"
          backgroundColor={clicked == 4 ? "#54A9DD" : "#F9F9F9"}
          width="100%"
          height="50px"
          justifyContent="left"
          fontFamily="nunito"
          mt="2px"
          mb="2px"
          p="10px"
          onClick={() => {
            setClicked(4);
          }}
        >
          Fundraising Planning
        </Button>
        <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(15, 1fr)">
          <GridItem
            rowSpan={3}
            paddingLeft="15px"
            paddingTop="10px"
            paddingBottom="10px"
          >
            <Divider
              orientation="vertical"
              borderColor="black"
              w="10px"
              borderLeftWidth="2px"
            />
          </GridItem>
          <GridItem colSpan={14}>
            <Button
              fontFamily="nunito"
              borderRadius="none"
              p="10px"
              width="100%"
              justifyContent="left"
              backgroundColor={clicked == 5 ? "#54A9DD" : "#F9F9F9"}
              onClick={() => {
                setClicked(5);
              }}
            >
              Expenses
            </Button>
          </GridItem>
          <GridItem colSpan={14}>
            <Button
              fontFamily="nunito"
              borderRadius="none"
              p="10px"
              width="100%"
              justifyContent="left"
              backgroundColor={clicked == 6 ? "#54A9DD" : "#F9F9F9"}
              onClick={() => {
                setClicked(6);
              }}
            >
              Hospitality
            </Button>
          </GridItem>
          <GridItem colSpan={14}>
            <Button
              fontFamily="nunito"
              borderRadius="none"
              p="10px"
              width="100%"
              justifyContent="left"
              backgroundColor={clicked == 7 ? "#54A9DD" : "#F9F9F9"}
              onClick={() => {
                setClicked(7);
              }}
            >
              Previous Fundraiser Events
            </Button>
          </GridItem>
        </Grid>
        <Button
          fontFamily="nunito"
          borderRadius="none"
          p="10px"
          width="100%"
          justifyContent="left"
          backgroundColor={clicked == 8 ? "#54A9DD" : "#F9F9F9"}
          onClick={() => {
            setClicked(8);
          }}
        >
          Raised Funds
        </Button>
        <Button
          fontFamily="nunito"
          borderRadius="none"
          p="10px"
          width="100%"
          justifyContent="left"
          backgroundColor={clicked == 9 ? "#54A9DD" : "#F9F9F9"}
          onClick={() => {
            setClicked(9);
          }}
        >
          Archive
        </Button>
        <Image
          src="/netlify.png"
          alt="Netlify"
          height="30px"
          mt="20px"
          ml="auto"
          mr="0px"
        />
      </Box>
    </Box>
  );
};

export default Sidebar;
