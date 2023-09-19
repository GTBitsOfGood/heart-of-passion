import {
  Button,
  Heading,
  Grid,
  GridItem,
  Image,
  Box,
  IconButton,
} from "@chakra-ui/react";
import ChapterCard from "~/components/ChapterCard";
import { IoMdSettings } from "react-icons/io";
import "@fontsource/oswald/600.css";

export default function Home() {
  const placeholderData = [
    {
      name: "Atlanta 2023",
      totalCost: 1234,
      fundExpected: 5678,
      fundActual: 3456,
    },
    {
      name: "Charlotte 2023",
      totalCost: 45678,
      fundExpected: 200,
      fundActual: 0,
    },
    {
      name: "New Orleans 2023",
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
              name={chapter.name.toUpperCase()}
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
