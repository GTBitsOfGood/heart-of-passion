import { Box, Button, Center, Image, VStack } from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import "@fontsource/oswald/600.css";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { auth } from "~/server/auth";

export const getServerSideProps = (async (context) => {
  const authRequest = auth.handleRequest(context);
  const session = await authRequest.validate();

  if (session) {
    await auth.invalidateSession(session.sessionId);
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}) satisfies GetServerSideProps<{}>;

export default function Login() {
  return <h1>You cant see this</h1>;
}
