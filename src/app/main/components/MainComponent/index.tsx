"use client";

import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import PostCard from "../../../../components/PostCard";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@mui/material";
import { usePopularCoverListQuery } from "../../../../app/api/cover/list";
import { contentData, Genre } from "../../../../app/main/type";
import { useTheme } from "@mui/material/styles";
import { useAuthStore } from "@/app/store/useAuthStore";
import InfoMessage from "@/components/InfoMessage";
import { Period } from "@/app/api/cover/list";

type PopularTab = {
  title: string;
  value: number;
  period: Period;
};
const popularTabs: PopularTab[] = [
  { title: "전체", value: 0, period: "ALL" },
  { title: "월간", value: 1, period: "MONTHLY" },
  { title: "일간", value: 2, period: "DAILY" },
  { title: "주간", value: 3, period: "WEEKLY" },
];

const genreTabs: Genre[] = [
  { title: "K-POP", value: "K_POP", label: "kpop" },
  { title: "J-POP", value: "J_POP", label: "jpop" },
  { title: "POP", value: "POP", label: "pop" },
];
const MainComponent = () => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodFromUrl = (searchParams.get("period") as Period) || "ALL";
  const genresFromUrl = searchParams.get("genres")
    ? searchParams.get("genres")!.split(",")
    : ["K_POP"];
  const accessToken = useAuthStore((state) => state.accessToken);

  // 페이지네이션
  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = useState(initialPage);
  const [selectedTab, setSelectedTab] = useState<PopularTab>(
    () => popularTabs.find((t) => t.period === periodFromUrl) ?? popularTabs[0],
  );

  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(() =>
    genreTabs.filter((g) => genresFromUrl.includes(g.value)),
  );

  const { data } = usePopularCoverListQuery({
    page: page - 1,
    size: 18,
    period: selectedTab.period,
    genres: selectedGenres.map((genre) => genre.value),
  });

  const pageChangeHandler = (_: any, value: number) => {
    setPage(value);
    router.push(`/main?page=${value}`, { scroll: false });
  };

  const popularTabChangeHandler = (tab: PopularTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", tab.period);
    params.set("page", "1"); // 탭 바뀌면 페이지 초기화

    router.push(`/main?${params.toString()}`, { scroll: false });
  };

  const genreTabChangeHandler = (genre: Genre) => {
    const params = new URLSearchParams(searchParams.toString());

    const current = new Set(searchParams.get("genres")?.split(",") ?? []);

    if (current.has(genre.value)) {
      current.delete(genre.value);
    } else {
      current.add(genre.value);
    }

    params.set("genres", Array.from(current).join(","));
    params.set("page", "1");

    router.push(`/main?${params.toString()}`, { scroll: false });
  };
  useEffect(() => {
    setPage(Number(searchParams.get("page") || 1));

    const period = searchParams.get("period") as Period;
    if (period) {
      const tab = popularTabs.find((t) => t.period === period);
      if (tab) setSelectedTab(tab);
    }

    const genres = searchParams.get("genres")?.split(",") ?? [];
    setSelectedGenres(genreTabs.filter((g) => genres.includes(g.value)));
  }, [searchParams]);

  const popularTabSx = (index: number) => ({
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
      {/* 인기 탭 */}
      <Box role="tablist" className="flex items-center mb-4">
        {popularTabs.map((tab, index) => (
          <Box key={index} className="flex items-center">
            <Button
              role="tab"
              aria-selected={selectedTab.period === tab.period}
              onClick={(e) => popularTabChangeHandler(tab)}
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

      {/* 장르 탭 */}
      <Box className="flex flex-wrap gap-2 mb-4">
        {genreTabs.map((tab, idx) => (
          <Button
            key={idx}
            role="tab"
            onClick={() => genreTabChangeHandler(tab)}
            sx={genreTabSx(isGenreSelected(tab.value))}
          >
            {tab.title}
          </Button>
        ))}
      </Box>

      {/* 게시글 리스트 */}
      {data?.content.length ? (
        <>
          <Grid container spacing={2}>
            {data.content.map((post: contentData, idx: number) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>
          <Box className="mt-8 flex justify-center">
            <Pagination count={1} page={page} onChange={pageChangeHandler} />
          </Box>
        </>
      ) : (
        <InfoMessage message="게시글이 없습니다." />
      )}
    </div>
  );
};

export default MainComponent;
