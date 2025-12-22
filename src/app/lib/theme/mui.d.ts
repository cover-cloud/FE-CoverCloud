import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    genre: {
      primary: string;
      secondary: string;
    };
    gray: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    white: {
      primary: string;
    };
    black: {
      primary: string;
    };
    orange: {
      primary: string;
      secondary: string;
    };
    danger: {
      primary: string;
    };
  }

  interface PaletteOptions {
    genre?: {
      primary: string;
      secondary: string;
    };
    gray?: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    white?: {
      primary: string;
    };
    black?: {
      primary: string;
    };
    orange?: {
      primary: string;
      secondary: string;
    };
    danger?: {
      primary: string;
    };
  }
}
