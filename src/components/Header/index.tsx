"use client";

import React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { useModalStore } from "../../app/store/useModalStore";

const Header = () => {
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
        <Box>logo</Box>
        <Box>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <SearchIcon />
          </Button>
        </Box>
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
