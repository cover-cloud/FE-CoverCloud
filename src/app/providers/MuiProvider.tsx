"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../theme";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const muiCache = createCache({ key: "mui", prepend: true });

export default function MuiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
