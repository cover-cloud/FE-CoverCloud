"use client";

import React from "react";
import Box from "@mui/material/Box";
import { Button, Grid, Pagination } from "@mui/material";
import PostCard from "@/components/PostCard";
import InfoMessage from "@/components/InfoMessage";
import { contentData } from "@/app/main/type";
import { usePopularCoverListQuery } from "@/app/api/cover/list";
import { useSearchParams } from "next/navigation";
import { useSearchQuery } from "@/app/api/search/saerch";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

interface saerchTab {
  title: string;
  value: number;
  searchType: string;
}
const saerchTabs: saerchTab[] = [
  { title: "제목", value: 0, searchType: "TITLE" },
  { title: "태그", value: 1, searchType: "TAG" },
];

export default function SearchClient() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const router = useRouter();
  const searchTypeFromUrlRaw = searchParams.get("searchType");
  const searchTypeFromUrl =
    saerchTabs.find((t) => t.searchType === searchTypeFromUrlRaw)?.searchType ||
    "TITLE";
  const [page, setPage] = React.useState(0);
  const [selectedTab, setSelectedTab] = React.useState<saerchTab>(
    () =>
      saerchTabs.find((t) => t.searchType === searchTypeFromUrl) ??
      saerchTabs[0],
  );
  const pageChangeHandler = (_: any, value: number) => {
    setPage(value);
  };

  const { data } = useSearchQuery(query || "", page, 18);

  const searchTabChangeHandler = (tab: saerchTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("searchType", tab.searchType);
    params.set("page", "0"); // 탭 바뀌면 페이지 초기화

    router.push(`/search?${params.toString()}`, { scroll: false });
  };
  const searchTabSx = (index: number) => ({
    color:
      index === selectedTab.value
        ? theme.palette.common.black
        : theme.palette.gray.primary,
    borderRadius: "10px",
    minWidth: "60px",
    minHeight: "32px",
    padding: 0,
    fontSize: "20px",
    marginLeft: index > 1 ? "12px" : "0",
    "&:hover": {
      backgroundColor: theme.palette.gray.secondary,
    },
  });
  React.useEffect(() => {
    setPage(Number(searchParams.get("page") || 0));

    const searchType = searchParams.get("searchType") as string;
    if (searchType) {
      const tab = saerchTabs.find((t) => t.searchType === searchType);
      if (tab) setSelectedTab(tab);
    }
  }, [searchParams]);
  if (!data?.data.content.length)
    return (
      <InfoMessage
        subMessage={query ? `“${query}”` : ""}
        message="검색 결과가 없습니다.\n새로운 곡을 추천하시겠어요?"
        buttonText="곡 추천하기"
        onClick={() => {
          // TODO: 곡 추천 페이지로 이동 로그인 상태 확인후
        }}
      />
    );

  return (
    <Box>
      <Box role="tablist" className="flex items-center mb-4">
        {saerchTabs.map((tab, index) => (
          <Box key={index} className="flex items-center">
            <Button
              role="tab"
              aria-selected={selectedTab.searchType === tab.searchType}
              onClick={(e) => searchTabChangeHandler(tab)}
              sx={searchTabSx(index)}
            >
              {tab.title}
            </Button>
          </Box>
        ))}
      </Box>
      {data?.data.content.length > 0 ? (
        <React.Fragment>
          <Grid container spacing={2}>
            {data?.data.content.map((post: contentData, idx: number) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>
          <Box className="mt-8 flex justify-center">
            {/* 여기 토탈카운트로 조합? 페이지 숫자 만들기 나머지값이 있으면 +1 기본 랭스받아오기 */}
            <Pagination
              count={data?.data.totalPages}
              page={page}
              onChange={pageChangeHandler}
              hideNextButton={page === data?.data.totalPages - 1}
              hidePrevButton={page === 0}
            />
          </Box>
        </React.Fragment>
      ) : (
        <InfoMessage
          subMessage={query ? `“${query}”` : ""}
          message="검색 결과가 없습니다.\n새로운 곡을 추천하시겠어요?"
          buttonText="곡 추천하기"
          onClick={() => {
            // TODO: 곡 추천 페이지로 이동 로그인 상태 확인후
          }}
        />
      )}
    </Box>
  );
}
