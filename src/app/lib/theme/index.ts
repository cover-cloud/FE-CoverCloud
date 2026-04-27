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
      secondary: "#A6A8F5",
    },
  },

  components: {
    /* =========================
       OutlinedInput (Input / Select 공통)
    ========================= */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ddd",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#aaa",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#aaa",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontSize: "14px",

          /* 기본 underline */
          "&:before": {
            borderBottomColor: "#ddd",
          },

          /* hover underline */
          "&:hover:not(.Mui-disabled):before": {
            borderBottomColor: "#aaa",
          },

          /* focus underline */
          "&:after": {
            borderBottomColor: "#aaa",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#666", // 기본 상태

          "&.Mui-focused": {
            color: "#4f4f4f", // ← 파란색 덮어쓰기
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true, // 클릭 물결 제거 (요즘 거의 다 끔)
      },

      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "6px 14px",
          boxShadow: "none",

          "&:hover": {
            boxShadow: "none",
          },
        },

        /* contained 버튼 */
        contained: {
          backgroundColor: "#0D0D0D",
          color: "#fff",

          "&:hover": {
            backgroundColor: "#222",
          },

          "&.Mui-disabled": {
            backgroundColor: "#ddd",
            color: "#999",
          },
        },

        /* outlined 버튼 */
        outlined: {
          borderColor: "#ddd",
          color: "#0D0D0D",

          "&:hover": {
            borderColor: "#aaa",
            backgroundColor: "#f5f5f5",
          },

          "&.Mui-disabled": {
            borderColor: "#eee",
            color: "#aaa",
          },
        },

        /* text 버튼 */
        text: {
          color: "#0D0D0D",

          "&:hover": {
            // backgroundColor: "#f0f0f0",
          },
        },
      },
    },
  },
});

export default theme;
