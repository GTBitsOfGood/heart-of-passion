import { Heading, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { use } from "react";
import { auth } from "~/server/auth";

export const getServerSideProps = (async (context) => {
  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validate();

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const user = session.user;

  if (user.role !== "admin") {
    return {
      redirect: {
        destination: `/chapters/${user.chapter}`,
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/chapters",
      permanent: false,
    },
  };
}) satisfies GetServerSideProps<{}>;

export default function Home() {
  return (
    <>
      <Heading>Home</Heading>
    </>
  );
}
