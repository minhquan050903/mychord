import {
  ColorMode,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import type { ComponentStyleConfig } from "@chakra-ui/theme";

const Input = {
  baseStyle: ({ colorMode }: { colorMode: ColorMode }) => ({
    field: {
      borderStyle: "solid",
      borderWidth: "2px",
      border: "2px solid",
      borderColor: "gray.900",
      _focus: {
        outline: "2px solid",
        outlineColor: "gray.900",
      },
      backgroundColor: colorMode === "dark" ? "gray.900" : "gray.50",
    },
  }),
  sizes: {},
  defaultProps: {
    variant: null,
  },
};

const Divider: ComponentStyleConfig = {
  baseStyle: {
    borderColor: "primary",
    borderWidth: "2px",
  },
};

export const theme = extendTheme(
  {
    semanticTokens: {
      colors: {
        error: "red.500",
        primary: {
          default: "gray.800",
          _dark: "gray.200",
        },
      },
    },
    components: {
      // Input,
      NumberInput: Input,
      Divider,
      // Button,
      Link: {
        baseStyle: ({ colorMode }: { colorMode: ColorMode }) => ({
          color: colorMode === "dark" ? "blue.400" : "blue.600",
          fontWeight: "bold",
        }),
      },
    },
    fonts: {
      heading: `'Besley', sans-serif`,
      body: `'Inter', sans-serif`,
    },
    styles: {
      global: () => ({
        html: {
          fontSize: "16px",
        },
        // body: {
        //   fontFamily: "Quicksand",
        // },
      }),
    },
  },
  withDefaultColorScheme({
    colorScheme: "blue",
  })
);
