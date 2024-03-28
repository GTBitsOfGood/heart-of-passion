import { ChakraProvider } from "@chakra-ui/react";
import { type AppType } from "next/app";

import { trpc } from "~/utils/api";
import { theme } from "../theme";

import "styles/global.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default trpc.withTRPC(MyApp);
