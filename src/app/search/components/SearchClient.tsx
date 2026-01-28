"use client";

import React from "react";
import Box from "@mui/material/Box";
import { Button, Grid, Pagination } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter, useSearchParams } from "next/navigation";

import PostCard from "@/components/PostCard";
import InfoMessage from "@/components/InfoMessage";
import { contentData } from "@/app/main/type";
import { useSearchQuery } from "@/app/api/search/saerch";

type SearchType = "title" | "tags";

interface SearchTab {
  title: string;
  searchType: SearchType;
}

const searchTabs: SearchTab[] = [
  { title: "제목", searchType: "title" },
  { title: "태그", searchType: "tags" },
];

export const dynamic = "force-dynamic";
export default function SearchClient() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =========================
     URL → 상태 파싱
  ========================= */
  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

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
    return <InfoMessage message="검색 중입니다..." onClick={() => {}} />;
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
      {!data?.data.content.length ? (
        <InfoMessage
          subMessage={query ? `“${query}”` : ""}
          message="검색 결과가 없습니다.\n새로운 곡을 추천하시겠어요?"
          buttonText="곡 추천하기"
          onClick={() => {}}
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
