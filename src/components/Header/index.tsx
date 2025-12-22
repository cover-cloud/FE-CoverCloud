"use client";

import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { useModalStore } from "../../app/store/useModalStore";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

const Header = () => {
  const theme = useTheme();
  const openLoginModal = useModalStore((state) => state.openLoginModal);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = () => {
    console.log(searchQuery);
  };

  const handleLogin = () => {
    openLoginModal();
  };

  return (
    <header>
      <Box className="flex items-center justify-between w-[80%] mx-auto h-[97px]">
        <Link href="/">
          <Box>CoverCloud</Box>
        </Link>
        <Box>
          <TextField
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <SearchIcon />
          </Button>
        </Box>
        <Link href="/post/create">
          <Button
            variant="outlined"
            sx={{
              backgroundColor: theme.palette.orange.primary,
              color: theme.palette.common.white,
              border: "none",
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: theme.palette.orange.secondary,
                color: theme.palette.common.black,
              },
            }}
          >
            곡 추천하기
          </Button>
        </Link>
        <Box>
          <Button variant="contained" onClick={handleLogin}>
            login
          </Button>
        </Box>
      </Box>
    </header>
  );
};

export default Header;
