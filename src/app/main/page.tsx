"use client";

import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import PostCard from "../../components/PostCard";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalStore } from "../../app/store/useModalStore";

import { Button } from "@mui/material";
import { usePopularCoverListQuery } from "../../app/api/cover/list";
import { contentData, Genre } from "./type";
import { useTheme } from "@mui/material/styles";
import { useAuthMeQuery } from "../../app/api/auth/authMe";
import { useAuthStore } from "../../app/store/useAuthStore";
import InfoMessage from "@/components/InfoMessage";
import { Period } from "@/app/api/cover/list";
export const dynamic = "force-dynamic";
type PopularTab = {
  title: string;
  value: number;
  period: Period;
};
const MainPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = useAuthStore((state) => state.accessToken);

  // 페이지네이션
  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = React.useState(initialPage);
  const [selectedTab, setSelectedTab] = React.useState<PopularTab>({
    title: "전체",
    value: 0,
    period: "ALL",
  });
  const [selectedGenres, setSelectedGenres] = React.useState<Genre[]>([
    { title: "K-POP", value: "K-POP", label: "kpop" },
  ]);

  const { data, isLoading, error } = usePopularCoverListQuery({
    page: page - 1,
    size: 18,
    period: selectedTab.period,
    genre: selectedGenres.map((genre) => genre.value),
  });
  const pageChangeHandler = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    //현재 페이지 정보 있어야할듯?
    router.push(`/main?page=${value}`, { scroll: false });
  };

  const popularTabChangeHandler = (
    event: React.ChangeEvent<unknown>,
    value: PopularTab
  ) => {
    setSelectedTab(value);
  };
  const genreTabChangeHandler = (genre: Genre) => {
    setSelectedGenres((prev) => {
      const exists = prev.some((item) => item.value === genre.value);

      if (exists) return prev.filter((item) => item.value !== genre.value);

      return [...prev, genre];
    });
  };

  React.useEffect(() => {
    const currentPage = Number(searchParams.get("page") || 1);
    setPage(currentPage);
  }, [searchParams]);
  // 스타일

  const popularTabs: PopularTab[] = [
    { title: "전체", value: 0, period: "ALL" },
    { title: "월간", value: 1, period: "MONTHLY" },
    { title: "일간", value: 2, period: "DAILY" },
    { title: "주간", value: 3, period: "WEEKLY" },
  ];
  const genreTabs = [
    { title: "K-POP", value: "K-POP", label: "kpop" },
    { title: "J-POP", value: "J-POP", label: "jpop" },
    { title: "POP", value: "POP", label: "pop" },
  ];
  const popularTabSx = (index: number) => {
    return {
      color:
        index === selectedTab.value
          ? theme.palette.common.black
          : theme.palette.gray.primary,
      borderRadius: "10px",
      minWidth: "60px",
      minHeight: "32px",
      padding: "0",
      fontSize: "20px",
      marginLeft: index === 0 || index === 1 ? "0" : "12px",

      "&:hover": {
        backgroundColor: theme.palette.gray.secondary,
      },
    };
  };
  const genreTabSx = (selected: boolean) => ({
    color: selected ? theme.palette.common.white : theme.palette.common.black,
    backgroundColor: selected
      ? theme.palette.genre.primary
      : theme.palette.gray.secondary,
    borderRadius: "20px",
    minWidth: "72px",
    minHeight: "32px",
    padding: "0 12px",
    fontSize: "14px",
    marginRight: "8px",

    "&:hover": {
      backgroundColor: theme.palette.genre.secondary,
      color: theme.palette.common.black,
    },
  });
  const isGenreSelected = (value: string) =>
    selectedGenres.some((item) => item.value === value);
  return (
    <div>
      <Box>
        {/* 해당 탭마다 변경되는 값 체인지시에 벨류값을 넣어서 api 호출하면 될듯 */}

        <Box role="tablist" className="flex items-center mb-4">
          {popularTabs.map((tab, index) => (
            <Box key={index} className="flex items-center">
              <Button
                role="tab"
                aria-selected={selectedTab.period === tab.period}
                onClick={(e) => popularTabChangeHandler(e, tab)}
                sx={popularTabSx(index)}
              >
                {tab.title}
              </Button>
              {index === 0 && (
                <Box
                  sx={{
                    width: "1px",
                    height: "14px",
                    backgroundColor: theme.palette.common.black,
                    marginLeft: "12px",
                    marginRight: "12px",
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
      {/* 여기 버튼탭 만들고 버튼값도 넣음 api 호출하고 안에들어가는 포스트 값만 변경하면될듯 */}
      <Box className="flex flex-wrap gap-2 mb-4">
        {genreTabs.map((tab, index) => (
          <Button
            key={index}
            role="tab"
            onClick={() => genreTabChangeHandler(tab)}
            sx={genreTabSx(isGenreSelected(tab.value))}
          >
            {tab.title}
          </Button>
        ))}
      </Box>
      {data?.content.length > 0 ? (
        <React.Fragment>
          <Grid container spacing={2}>
            {data?.content.map((post: contentData, idx: number) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>
          <Box className="mt-8 flex justify-center">
            {/* 여기 토탈카운트로 조합? 페이지 숫자 만들기 나머지값이 있으면 +1 기본 랭스받아오기 */}
            <Pagination count={1} page={page} onChange={pageChangeHandler} />
          </Box>
        </React.Fragment>
      ) : (
        <InfoMessage message="게시글이 없습니다." />
      )}
    </div>
  );
};

export default MainPage;
