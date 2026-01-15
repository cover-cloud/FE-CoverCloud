"use client";
import React from "react";
import Box from "@mui/material/Box";
import { Grid, Pagination } from "@mui/material";
import PostCard from "@/components/PostCard";
import InfoMessage from "@/components/InfoMessage";
import { contentData } from "@/app/main/type";
import { usePopularCoverListQuery } from "@/app/api/cover/list";
import { useSearchParams } from "next/navigation";

const searchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [page, setPage] = React.useState(1);
  const pageChangeHandler = (event: any, value: number) => {
    setPage(value);
  };
  const { data, isLoading, error } = usePopularCoverListQuery({
    page: page - 1,
    size: 18,
    // period: "ALL",
  });
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
      <Box>searchPage</Box>
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
};

export default searchPage;
