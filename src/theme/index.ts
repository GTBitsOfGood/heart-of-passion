
import { extendTheme } from "@chakra-ui/react";
import { radioTheme } from "./components/Radio";

import colors from './foundations/colors'
import typography from './foundations/typography'

export const theme = extendTheme({
  colors,
  ...typography,

  components: {
    Radio: radioTheme,
  }
});
