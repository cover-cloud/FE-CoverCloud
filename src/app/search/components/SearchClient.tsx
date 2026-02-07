"use client";

import React from "react";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter, useSearchParams } from "next/navigation";

import PostCard from "@/components/PostCard";
import InfoMessage from "@/components/InfoMessage";
import { contentData } from "@/app/main/type";
import { useSearchQuery } from "@/app/api/search/saerch";
import TuneIcon from "@mui/icons-material/Tune";
import AccessTimeSharpIcon from "@mui/icons-material/AccessTimeSharp";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import { fetchAuthMeWithCookie } from "@/app/api/auth/authMe";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { useModalStore } from "@/app/store/useModalStore";
type SearchType = "title" | "tags";

interface SearchTab {
  title: string;
  searchType: SearchType;
}

const searchTabs: SearchTab[] = [
  { title: "제목", searchType: "title" },
  { title: "태그", searchType: "tags" },
];
type SortType = "LATEST" | "POPULAR";

const sortOptions: { label: string; value: SortType }[] = [
  { label: "최신순", value: "LATEST" },
  { label: "인기순", value: "POPULAR" },
];
export const dynamic = "force-dynamic";
export default function SearchClient() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openLoginModal } = useModalStore();
  /* =========================
     URL → 상태 파싱
  ========================= */
  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const sort = (searchParams.get("sort") as SortType) ?? "LATEST";
  const searchType = (searchParams.get("searchType") as SearchType) ?? "title";

  const selectedTab =
    searchTabs.find((t) => t.searchType === searchType) ?? searchTabs[0];

  /* =========================
     검색
  ========================= */
  const { data, isLoading } = useSearchQuery({
    type: searchType,
    keyword: query,
    page: page - 1,
    size: 10,
    sort,
  });

  /* =========================
     URL 변경 헬퍼
  ========================= */
  const updateParams = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.push(`/search?${params.toString()}`, {
      scroll: false,
    });
  };

  /* =========================
     핸들러
  ========================= */
  const handleTabChange = (tab: SearchTab) => {
    updateParams({
      searchType: tab.searchType,
      page: "1", // 탭 바뀌면 페이지 초기화
    });
  };

  const handlePageChange = (_: any, value: number) => {
    updateParams({
      page: String(value),
    });
  };
  const handleSortChange = (value: SortType) => {
    updateParams({
      sort: value,
      page: "1", // 정렬 바꾸면 페이지 초기화
    });
  };
  const handleRecommendClick = async () => {
    const isAuthenticated = await fetchAuthMeWithCookie();
    if (!isAuthenticated.success) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 추천할 수 있습니다.", "error");
      return;
    }
    router.push("/post/create");
  };
  /* =========================
     스타일
  ========================= */
  const tabSx = (active: boolean) => ({
    color: active ? theme.palette.common.black : theme.palette.gray.primary,
    borderRadius: "10px",
    minWidth: "60px",
    minHeight: "32px",
    fontSize: "20px",
    "&:hover": {
      backgroundColor: theme.palette.gray.secondary,
    },
  });
  // TODO: 로딩 상태 처리
  if (isLoading) {
    return (
      <Box
        className="mt-8"
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          size={64}
          sx={{ color: theme.palette.orange.primary }}
        />
      </Box>
    );
  }
  /* =========================
     결과 없음
  ========================= */

  return (
    <Box>
      {/* 탭 */}
      <Box className="flex items-center mb-4">
        {searchTabs.map((tab) => (
          <Button
            key={tab.searchType}
            onClick={() => handleTabChange(tab)}
            sx={tabSx(selectedTab.searchType === tab.searchType)}
          >
            {tab.title}
          </Button>
        ))}
      </Box>
      <Box
        className="flex items-center justify-between"
        sx={{ mb: "44px", pl: "8px" }}
      >
        <Typography variant="h5">
          <strong style={{ marginRight: "8px" }}>{`“${query}”`}</strong>
          {searchType === "title" ? "제목" : "태그"} 검색 결과.
        </Typography>
        <Box sx={{ minWidth: 120 }}>
          <Select
            size="small"
            renderValue={(value) => (
              <Box
                sx={{
                  fontWeight: 700,
                  mr: "8px",
                  p: "0px 5px",
                }}
              >
                {value === "LATEST" ? "최신순" : "인기순"}
              </Box>
            )}
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as SortType)}
            IconComponent={TuneIcon}
            sx={{
              fontSize: "14px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ddd",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#aaa",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#aaa",
              },
              "&.Mui-focused .MuiSelect-icon": {
                color: "#4f4f4fff",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root": {
                    fontSize: "14px",
                  },

                  "& .MuiMenuItem-root:hover": {
                    backgroundColor: "#f0f0f0",
                  },

                  "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "transparent !important",
                    color: "#000",
                    fontWeight: 700,
                  },

                  "& .MuiMenuItem-root.Mui-selected:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                },
              },
            }}
          >
            <MenuItem value="LATEST">
              <AccessTimeSharpIcon
                fontSize="small"
                sx={{ marginRight: "8px" }}
              />
              <Box>최신순</Box>
            </MenuItem>
            <MenuItem value="POPULAR">
              <FavoriteBorderSharpIcon
                fontSize="small"
                sx={{ marginRight: "8px" }}
              />
              <Box>인기순</Box>
            </MenuItem>
          </Select>
        </Box>
      </Box>
      {!data?.data.content.length ? (
        <InfoMessage
          subMessage={query ? `“${query}”` : ""}
          message="검색 결과가 없습니다.\n새로운 곡을 추천하시겠어요?"
          buttonText="곡 추천하기"
          onClick={handleRecommendClick}
        />
      ) : (
        <React.Fragment>
          {/* 리스트 */}
          <Grid container spacing={2}>
            {data.data.content.map((post: contentData) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.coverId}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>

          {/* 페이지네이션 */}
          <Box className="mt-8 flex justify-center">
            <Pagination
              count={data.data.totalPages}
              page={page}
              onChange={handlePageChange}
              hidePrevButton={page === 1}
              hideNextButton={page === data.data.totalPages}
            />
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
