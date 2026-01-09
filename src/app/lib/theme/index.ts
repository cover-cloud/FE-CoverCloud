import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },

    genre: {
      primary: "#4F46E5",
      secondary: "#BBBCF2",
    },

    gray: {
      primary: "#666666",
      secondary: "#DDDDDD",
      tertiary: "#F2F2F2",
      fourth: "#484848",
    },

    common: {
      black: "#0D0D0D",
      white: "#FFFFFF",
    },
    orange: {
      primary: "#F17140",
      secondary: "#F2A385",
    },
    danger: {
      primary: "#FEE9E7",
    },
    purple: {
      primary: "#8385EF",
    },
  },
});

export default theme;
