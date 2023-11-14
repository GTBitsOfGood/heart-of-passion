import { Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { use } from "react";

export default function Home() {
  const router = useRouter();

  router.push(`/chapters`);
  return (
    <>
      <Heading>Home</Heading>

      <Text>Hello from Heart of Passion</Text>
    </>
  );
}
