import { ChakraProvider } from "@chakra-ui/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";
import { theme } from "./theme";

// Supports weights 200-900
import '@fontsource/nunito';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
