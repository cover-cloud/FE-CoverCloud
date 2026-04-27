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
      fourth: string;
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
    purple: {
      primary: string;
      secondary: string;
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
      fourth: string;
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
    purple?: {
      primary: string;
      secondary: string;
    };
  }
}
