"use client";

import React, { useEffect } from "react";
import { Box, Button, CircularProgress, Grid, Pagination } from "@mui/material";
import theme from "@/app/lib/theme";
import InfoMessage from "@/components/InfoMessage";
import { useAuthStore } from "@/app/store/useAuthStore";
import { contentData } from "@/app/main/type";
import PostCard from "@/components/PostCard";
import { useSearchParams, useRouter } from "next/navigation";
import { useMyCoverListQuery } from "@/app/api/mypage/myCoverList";
import Login from "@/components/auth/Login";
import { fetchAuthMeWithCookie, useAuthMeQuery } from "@/app/api/auth/authMe";
import { useModalStore } from "@/app/store/useModalStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";

export const dynamic = "force-dynamic";

export default function ActivityClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openLoginModal } = useModalStore();

  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = React.useState(initialPage);
  const activityTabs: {
    type: "recommend" | "like" | "comment";
    name: string;
  }[] = [
    {
      type: "recommend",
      name: "추천",
    },
    { type: "like", name: "좋아요" },
    { type: "comment", name: "댓글" },
  ];
  const accessToken = useAuthStore((state) => state.accessToken);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { data, isLoading } = useMyCoverListQuery(
    accessToken,
    page,
    10,
    activityTabs[selectedTab].type,
  );

  const { data: authMeData, isLoading: authMeLoading } = useAuthMeQuery();

  const activityTabChangeHandler = (_: React.MouseEvent, index: number) => {
    setSelectedTab(index);
  };

  useEffect(() => {}, [data]);

  const activityTabSx = (index: number) => ({
    color:
      index === selectedTab
        ? theme.palette.common.black
        : theme.palette.gray.primary,
    borderRadius: "10px",
    minWidth: "60px",
    minHeight: "32px",
    padding: "0",
    "&:hover": {
      backgroundColor: theme.palette.gray.secondary,
    },
  });

  const pageChangeHandler = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    router.push(`/mypage/activity?page=${value}`, { scroll: false });
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

  if (authMeData?.success === false) {
    return <Login />;
  }
  return (
    <Box>
      <Box className="H1" sx={{ width: "100%", textAlign: "center" }}>
        내 활동 내역
      </Box>
      <Box>
        {activityTabs.map((tab, index) => (
          <Button
            key={tab.type}
            role="tab"
            aria-selected={selectedTab === index}
            onClick={(e) => activityTabChangeHandler(e, index)}
            sx={activityTabSx(index)}
          >
            <Box className="B1">{tab.name}</Box>
          </Button>
        ))}

        {isLoading || authMeLoading ? (
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
        ) : data?.data.content.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {data.data.content.map((post: contentData, idx: number) => (
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
          <InfoMessage
            message="아직 추천한 곡이 없습니다.\n새로운 곡을 추천하시겠어요?"
            buttonText="곡 추천하기"
            onClick={handleRecommendClick}
          />
        )}
      </Box>
    </Box>
  );
}
