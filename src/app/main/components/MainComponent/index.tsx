"use client";

import React from "react";
import Grid from "@mui/material/Grid";
import PostCard from "../../../../components/PostCard";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, CircularProgress, useMediaQuery } from "@mui/material";
import { usePopularCoverListQuery } from "../../../../app/api/cover/list";
import { contentData, Genre } from "../../../../app/main/type";
import { useTheme } from "@mui/material/styles";
import InfoMessage from "@/components/InfoMessage";
import { Period } from "@/app/api/cover/list";
import PostBasicButton from "@/components/PostBasicButton";

type PopularTab = {
  title: string;
  period: Period;
};

const popularTabs: PopularTab[] = [
  { title: "전체", period: "ALL" },
  { title: "월간", period: "MONTHLY" },
  { title: "주간", period: "WEEKLY" },
  { title: "일간", period: "DAILY" },
];

const genreTabs: Genre[] = [
  { title: "K-POP", value: "K_POP", label: "kpop" },
  { title: "J-POP", value: "J_POP", label: "jpop" },
  { title: "POP", value: "POP", label: "pop" },
  { title: "기타", value: "OTHER", label: "OTHER" },
];

const MainComponent = ({ initialData }: { initialData?: any }) => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  /* =========================
      URL → 상태 (UI 기준)
    ========================= */
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const period = (searchParams.get("period") as Period) ?? "ALL";
  const genreValues = searchParams.get("genres")
    ? searchParams.get("genres")!.split(",")
    : [];

  const selectedTab =
    popularTabs.find((t) => t.period === period) ?? popularTabs[0];

  const selectedGenres = genreTabs.filter((g) => genreValues.includes(g.value));

  /* =========================
      API 호출 (0부터)
    ========================= */
  const { data: queryData, isLoading } = usePopularCoverListQuery({
    page: page - 1,
    size: 18,
    period,
    genres: selectedGenres.map((g) => g.value),
    initialData,
  });

  const data = queryData ?? initialData;

  /* =========================
      URL 변경 헬퍼
    ========================= */
  const updateParams = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.push(`/main?${params.toString()}`, { scroll: false });
  };

  /* =========================
      핸들러
    ========================= */
  const handlePageChange = (_: any, value: number) => {
    updateParams({ page: String(value) });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const popularTabChangeHandler = (tab: PopularTab) => {
    updateParams({
      period: tab.period,
      page: "1",
    });
  };

  const genreTabChangeHandler = (genre: Genre) => {
    const current = new Set(genreValues);

    current.has(genre.value)
      ? current.delete(genre.value)
      : current.add(genre.value);

    updateParams({
      genres: Array.from(current).join(","),
      page: "1",
    });
  };

  /* =========================
      스타일
    ========================= */
  const popularTabSx = (active: boolean) => ({
    color: active ? theme.palette.common.black : theme.palette.gray.primary,
    borderRadius: "10px",
    minWidth: "60px",
    minHeight: "32px",
    fontSize: "20px",
    "@media (hover: hover)": {
      "&:hover": {
        backgroundColor: theme.palette.gray.secondary,
      },
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
    "@media (hover: hover)": {
      "&:hover": {
        backgroundColor: theme.palette.genre.secondary,
        color: theme.palette.common.black,
      },
    },
  });
  const bannerClickHandler = (type: string) => {
    const formLink = "https://forms.gle/tkzk8Qk9n6JYMoav6";
    switch (type) {
      case "desktop":
        if (!isMobile) {
          // 데스크톱에서는 의견 남기기 페이지로 이동
          window.open(formLink, "_blank");
        }
        break;
      case "mobile":
        if (isMobile) {
          // 모바일에서는 의견 남기기 페이지로 이동
          window.open(formLink, "_blank");
        }
        break;
    }
  };
  /* =========================
      렌더링
    ========================= */
  return (
    <div>
      {/* 인기 탭 */}
      <Box
        sx={{
          backgroundColor: "#FEE9E7",
          height: "146px",
          width: "100%",
          marginBottom: "32px",
          padding: "0 10px",
          cursor: isMobile ? "initial" : "pointer",
        }}
        onClick={() => bannerClickHandler("desktop")}
      >
        <Box className="relative flex h-full sm:w-full max-w-[650px] mx-auto ">
          <Box className="flex flex-col justify-center" zIndex={1}>
            <Box className="banner mb-1">서비스는 어떠셨나요?</Box>
            <Box className="bannerSub mb-1">
              {isMobile ? (
                <>
                  더 좋은 서비스를 위해 <br /> 여러분의 의견을 들려주세요.
                </>
              ) : (
                "더 좋은 서비스를 위해 여러분의 의견을 들려주세요."
              )}
            </Box>
            <Box display={isMobile ? "block" : "none"}>
              <PostBasicButton
                onClick={() => bannerClickHandler("mobile")}
                backgroundColor={theme.palette.gray.fourth}
                hoverBGColor={theme.palette.gray.primary}
                color="white"
              >
                의견 남기기
              </PostBasicButton>
            </Box>
          </Box>
          <Box
            className="absolute"
            sx={{
              bottom: 25,
              right: 0,
              zIndex: 0,
              scale: isMobile ? 0.8 : 1,
            }}
          >
            <img src={"/asset/image/banner.png"} alt="banner" />
          </Box>
        </Box>
      </Box>
      <Box className="flex items-center mb-4">
        {popularTabs.map((tab) => (
          <Button
            key={tab.period}
            onClick={() => popularTabChangeHandler(tab)}
            sx={popularTabSx(tab.period === period)}
          >
            <Box className="S1">{tab.title}</Box>
          </Button>
        ))}
      </Box>

      {/* 장르 탭 */}
      <Box className="flex flex-wrap gap-2 mb-4">
        {genreTabs.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => genreTabChangeHandler(tab)}
            sx={genreTabSx(genreValues.includes(tab.value))}
          >
            <Box className="S3">{tab.title}</Box>
          </Button>
        ))}
      </Box>

      {/* 리스트 */}
      {data?.content.length ? (
        <>
          <Grid container spacing={2}>
            {data.content.map((post: contentData) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.coverId}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>

          <Box className="mt-8 flex justify-center">
            <Pagination
              count={data.totalPages}
              page={page}
              onChange={handlePageChange}
              hidePrevButton={page === 1}
              hideNextButton={page === data.totalPages}
              sx={{ "& .MuiPagination-ul": { flexWrap: "nowrap" } }}
            />
          </Box>
        </>
      ) : isLoading ? (
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
      ) : (
        <InfoMessage message="게시글이 없습니다." />
      )}
    </div>
  );
};

export default MainComponent;
