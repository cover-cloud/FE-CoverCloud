"use client";

import React from "react";
import Grid from "@mui/material/Grid";
import PostCard from "../../components/PostCard";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalStore } from "../../app/store/useModalStore";

import { Button } from "@mui/material";
import { useCoverListQuery } from "../../app/api/cover/list";
import { contentData, Genre } from "./type";

import { useTheme } from "@mui/material/styles";

const MainPage = () => {
  const theme = useTheme();

  const router = useRouter();
  const searchParams = useSearchParams();

  const closeLoginModal = useModalStore((state) => state.closeLoginModal);
  // 페이지네이션
  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = React.useState(initialPage);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [selectedGenres, setSelectedGenres] = React.useState<Genre[]>([
    { title: "K-POP", value: "kpop", label: "kpop" },
  ]);

  const { data, isLoading, error } = useCoverListQuery(page - 1, 10);
  React.useEffect(() => {
    console.log(data?.content, "콘텐츠");
  }, [data]);

  const pageChangeHandler = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    router.push(`/main?page=${value}`, { scroll: false });
  };

  const popularTabChangeHandler = (
    event: React.ChangeEvent<unknown>,
    value: number
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

  const popularTabs = ["전체", "월간", "일간", "주간"];
  const genreTabs = [
    { title: "K-POP", value: "kpop", label: "kpop" },
    { title: "J-POP", value: "jpop", label: "jpop" },
    { title: "POP", value: "pop", label: "pop" },
  ];
  const popularTabSx = (index: number) => {
    return {
      color:
        index === selectedTab
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

        <Box role="tablist" className="flex items-center">
          {popularTabs.map((tab, index) => (
            <Box key={index} className="flex items-center">
              <Button
                role="tab"
                aria-selected={selectedTab === index}
                onClick={(e) => popularTabChangeHandler(e, index)}
                sx={popularTabSx(index)}
              >
                {tab}
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
      <Box>
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
        <Grid container spacing={2}>
          {data?.content.map((post: contentData, idx: number) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <PostCard {...post} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>데이터 없음</Box>
      )}
      <Box className="mt-8 flex justify-center">
        <Pagination
          count={10}
          page={page}
          onChange={pageChangeHandler}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default MainPage;
