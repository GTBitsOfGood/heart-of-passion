import { radioAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys);

const customRadio = definePartsStyle({
  control: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "gray.300",
    background: "white",

    _checked: {
      color: "purple.800",
      borderColor: "purple.800",
      background: "white",
      _hover: {
        bg: "white",
        borderColor: "purple.800",
      },
    },
    _hover: {
      bg: "white",
      borderColor: "purple.800",
    },
    _focus: {
      boxShadow: "none",
    },
  },
  label: {
    bg: "#DEEBFF",
    padding: "2px 8px 2px 8px",
    borderRadius: "4px",
  },
});
export const radioTheme = defineMultiStyleConfig({
  variants: { customRadio },
});
