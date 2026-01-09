"use client";

import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { useModalStore } from "../../app/store/useModalStore";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import AccountModal from "../modal/AccountModal";
import AvatarComponent from "../auth/AvatarComponent";
import { useAuthStore } from "@/app/store/useAuthStore";
import { IoIosAddCircle } from "react-icons/io";
import { useRouter } from "next/navigation";

const Header = () => {
  const theme = useTheme();
  const openLoginModal = useModalStore((state) => state.openLoginModal);
  const isLogin = useAuthStore((state) => state.isLogin);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openAccountModal, setOpenAccountModal] = React.useState(false);
  const router = useRouter();

  const handleSearch = () => {
    console.log(searchQuery);
    router.push(`/search?q=${searchQuery}`);
  };

  const handleLogin = () => {
    openLoginModal();
  };

  const openAccountModalHandler = () => {
    setOpenAccountModal(!openAccountModal);
  };
  return (
    <header>
      <Box
        className="flex items-center justify-between gap-4 max-w-7xl mx-auto sm:px-6"
        sx={{ height: "120px", top: 0, left: 0 }}
      >
        <Link href="/" style={{ flex: 1 }}>
          <Box>CoverCloud</Box>
        </Link>
        <Box className="relative" sx={{ flex: 1.5 }}>
          <TextField
            className="H1"
            placeholder="검색어를 입력해주세요."
            value={searchQuery}
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              "& .MuiInputBase-input": {
                padding: "12px",
                border: "none",
              },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <Button
            disableRipple
            disableFocusRipple
            onClick={handleSearch}
            sx={{
              all: "unset",
              position: "absolute",
              right: 0,
              top: 0,
              width: "48px",
              height: "48px",
              color: "black",
              cursor: "pointer",
            }}
          >
            <SearchIcon />
          </Button>
        </Box>
        <Box className="flex justify-end" sx={{ flex: 1 }}>
          {isLogin ? (
            <Box className="flex">
              <Link href="/post/create">
                <Button
                  variant="outlined"
                  sx={{
                    width: "160px",
                    height: "48px",
                    backgroundColor: theme.palette.orange.primary,
                    color: theme.palette.common.white,
                    border: "none",
                    borderRadius: "50px",
                    "&:hover": {
                      backgroundColor: theme.palette.orange.secondary,
                      color: theme.palette.common.black,
                    },
                    "@media (max-width: 980px)": {
                      display: "none",
                    },
                  }}
                >
                  <Box className="H3">곡 추천하기</Box>
                </Button>
                <Box
                  sx={{
                    display: "none",
                    "@media (max-width: 980px)": { display: "block" },
                  }}
                >
                  <IoIosAddCircle
                    size={58}
                    color={theme.palette.orange.primary}
                  />
                </Box>
              </Link>

              <Box ml={"50px"} className="flex items-center">
                <AvatarComponent
                  openAccountModalHandler={openAccountModalHandler}
                />
              </Box>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{
                width: "126px",
                height: "48px",
                borderRadius: "50px",
                backgroundColor: theme.palette.orange.primary,
                "&:hover": {
                  backgroundColor: theme.palette.orange.secondary,
                  color: theme.palette.common.black,
                },
              }}
            >
              <Box className="H3">로그인하기</Box>
            </Button>
          )}

          {openAccountModal && (
            <AccountModal openAccountModalHandler={openAccountModalHandler} />
          )}
        </Box>
      </Box>
    </header>
  );
};

export default Header;
