import { Heading } from "@chakra-ui/react";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Heading>Heallo {hello.data?.greeting}</Heading>
    </>
  );
}
