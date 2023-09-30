import {
  Button,
  Heading,
  Grid,
  GridItem,
  Image,
  Box,
  IconButton,
} from "@chakra-ui/react";
import ChapterCard from "~/components/chapters/ChapterCard";
import { IoMdSettings } from "react-icons/io";
import "@fontsource/oswald/600.css";

export default function Home() {
  const placeholderData = [
    {
      city: "Atlanta",
      year: 2023,
      totalCost: 1234,
      fundExpected: 5678,
      fundActual: 3456,
    },
    {
      city: "Charlotte",
      year: 2023,
      totalCost: 45678,
      fundExpected: 200,
      fundActual: 0,
    },
    {
      city: "New Orleans",
      year: 2023,
      totalCost: 45678,
      fundExpected: 200,
      fundActual: 0,
    },
  ];

  return (
    <Box m="2%">
      <Grid templateColumns="repeat(8, 1fr)" mb="3%">
        <GridItem>
          <Image src="/logo.png" alt="Heart of Passion Logo" height="120px" />
        </GridItem>
        <GridItem alignSelf="flex-end" colSpan={5}>
          <Heading fontFamily="oswald">SELECT A CHAPTER</Heading>
        </GridItem>
        <GridItem alignSelf="flex-end">
          <Button
            color="white"
            bgColor="#54A9DD"
            fontFamily="oswald"
            height="50px"
            fontSize="20px"
            onClick={() => {}}
          >
            ADD CHAPTER
          </Button>
        </GridItem>
        <GridItem alignSelf="flex-end">
          <IconButton
            aria-label="settings"
            variant="ghost"
            height="50px"
            width="50px"
            icon={<IoMdSettings size="50px" onClick={() => {}} />}
          />
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={6} ml="10%" mr="10%">
        {placeholderData.map((chapter) => (
          <GridItem>
            <ChapterCard
              city={chapter.city.toUpperCase()}
              year={chapter.year}
              totalCost={chapter.totalCost}
              fundExpected={chapter.fundExpected}
              fundActual={chapter.fundActual}
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
