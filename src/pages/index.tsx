import { Button, Heading, Text } from "@chakra-ui/react";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const count = api.example.count.useQuery();
  const increment = api.example.incrementCount.useMutation({
    onSuccess() {
      count.refetch();
    },
  });

  return (
    <>
      <Heading>Heallo {hello.data?.greeting}</Heading>
      <Text>Count: {count.data?.count}</Text>
      <Button onClick={() => increment.mutate()}>Increment</Button>
    </>
  );
}
