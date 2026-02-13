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
import { IoIosAddCircle } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthMeQuery } from "@/app/api/auth/authMe";
import { IoClose } from "react-icons/io5";
import { useAuthStore } from "@/app/store/useAuthStore";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";

export const dynamic = "force-dynamic";

const Header = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") ?? "";

  const page = Number(searchParams.get("page") ?? 1);
  const theme = useTheme();
  const openLoginModal = useModalStore((state) => state.openLoginModal);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLogin = useAuthStore((state) => state.isLogin);
  // const isLogin = useAuthStore((state) => state.isLogin);

  const { data, error } = useAuthMeQuery();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [openAccountModal, setOpenAccountModal] = React.useState(false);
  const [openSearchBar, setOpenSearchBar] = React.useState(false);

  const router = useRouter();

  const [searchType, setSearchType] = React.useState<"title" | "tags">("title");

  /** ✅ URL 쿼리 → input 동기화 */

  React.useEffect(() => {
    const q = searchParams.get("q");
    const type = searchParams.get("searchType");

    if (q !== null) {
      setSearchQuery(q);
    }

    if (type === "tags" || type === "title") {
      setSearchType(type);
    }
  }, [searchParams]);
  React.useEffect(() => {
    if (!isMobile) {
      setOpenSearchBar(false);
    }
  }, [isMobile]);
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    router.push(
      `/search?q=${encodeURIComponent(searchQuery)}&searchType=${searchType}&page=1`,
    );
  };
  const handleLogin = () => {
    openLoginModal();
  };

  const openAccountModalHandler = () => {
    setOpenAccountModal((prev) => !prev);
  };
  const searchBarHandler = (open: boolean) => {
    if (open) {
      handleSearch();
    } else {
      setOpenSearchBar(true);
    }
  };
  const buttonSx = {
    all: "unset",
    position: "absolute",
    top: 0,
    color: "black",
    cursor: "pointer",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <header>
      <Box
        className="flex items-center justify-between gap-4 max-w-7xl mx-auto px-6"
        sx={{ height: "120px", top: 0, left: 0 }}
      >
        {!openSearchBar && (
          <Link href="/" style={{ flex: 1 }}>
            <Box
              sx={{
                display: "block",
                "@media (min-width:627px)": {
                  display: "none",
                },
              }}
            >
              <Image
                src="/asset/logo/favicon.png"
                alt="CoverCloud"
                width={60}
                height={60}
              />
            </Box>
            <Box
              sx={{
                display: "none",
                "@media (min-width:627px)": {
                  display: "block",
                },
              }}
            >
              <Image
                src="/asset/logo/coverLogo.png"
                alt="CoverCloud"
                width={180}
                height={32}
              />
            </Box>
          </Link>
        )}

        <Box
          className="relative"
          sx={{
            flex: 1.5,
            display: {
              xs: "none",
            },
            "@media (min-width:767px)": {
              display: "flex",
            },
          }}
        >
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

        <Box
          className="relative flex justify-end"
          sx={{
            flex: 1,
            display: {
              xs: "flex",
            },
            "@media (min-width:767px)": {
              display: "none",
            },
          }}
        >
          <Box
            className="relative"
            sx={{
              flex: openSearchBar ? 1 : "0 0 48px",
              transition: "flex 0.3s ease",
            }}
          >
            <TextField
              className="H1"
              placeholder="검색어를 입력해주세요."
              value={searchQuery}
              fullWidth
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  height: "48px",
                  transition: "width 0.3s ease, flex 0.3s ease",
                  width: "100%",
                  borderRadius: "50px",
                  padding: "0 12px",
                  paddingLeft: openSearchBar ? "48px" : "12px",
                },
                "& .MuiInputBase-input": {
                  padding: "12px",
                },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />

            <Button
              disableRipple
              disableFocusRipple
              sx={{ ...buttonSx, left: 0 }}
              onClick={() => searchBarHandler(openSearchBar)}
            >
              <SearchIcon />
            </Button>
            {openSearchBar && (
              <Button
                disableRipple
                disableFocusRipple
                sx={{
                  ...buttonSx,
                  right: 0,
                }}
                onClick={() => setOpenSearchBar(false)}
              >
                <IoClose />
              </Button>
            )}
          </Box>
        </Box>

        {!openSearchBar && (
          <Box className="flex justify-end" sx={{ flex: 1 }}>
            {isLogin ? (
              <Box className="flex">
                <Link href="/post/create">
                  {isMobile ? (
                    <Box sx={{}}>
                      <IoIosAddCircle
                        size={58}
                        color={theme.palette.orange.primary}
                      />
                    </Box>
                  ) : (
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
                      }}
                    >
                      <Box className="H3">곡 추천하기</Box>
                    </Button>
                  )}
                </Link>

                <Box ml={"50px"} className="flex items-center">
                  <AvatarComponent
                    openAccountModalHandler={openAccountModalHandler}
                    profileImage={data?.data.profileImage}
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
        )}
      </Box>
    </header>
  );
};

export default Header;
