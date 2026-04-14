"use client";

import React from "react";
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

type ActivityType = "recommend" | "like" | "comment";

const activityTabs: { type: ActivityType; name: string }[] = [
  { type: "recommend", name: "추천" },
  { type: "like", name: "좋아요" },
  { type: "comment", name: "댓글" },
];

export default function ActivityClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openLoginModal } = useModalStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  /* =========================
     URL → 상태 파싱 (상태값 제거)
  ========================= */
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const currentTabType =
    (searchParams.get("tab") as ActivityType) ?? "recommend";

  // 현재 선택된 탭의 인덱스 찾기
  const selectedTabIndex = activityTabs.findIndex(
    (t) => t.type === currentTabType,
  );

  /* =========================
     API 데이터 페칭
  ========================= */
  const { data: authMeData, isLoading: authMeLoading } = useAuthMeQuery();

  const { data, isLoading } = useMyCoverListQuery(
    accessToken,
    page - 1, // API가 0-base index라면 page-1 처리
    18,
    currentTabType,
  );

  /* =========================
     URL 변경 헬퍼 (updateParams)
  ========================= */
  const updateParams = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.push(`/mypage/activity?${params.toString()}`, {
      scroll: false,
    });
  };

  /* =========================
     핸들러
  ========================= */
  const activityTabChangeHandler = (type: ActivityType) => {
    updateParams({
      tab: type,
      page: "1", // 탭 변경 시 페이지 1로 초기화
    });
  };

  const pageChangeHandler = (_: React.ChangeEvent<unknown>, value: number) => {
    updateParams({
      page: String(value),
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const linkHandler = (type: string) => {
    if (type === "recommend") {
      handleRecommendClick();
    } else {
      router.push("/main");
    }
  };

  const handleRecommendClick = async () => {
    const isAuthenticated = await fetchAuthMeWithCookie(accessToken);
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
     조건부 렌더링
  ========================= */
  const activityTabSx = (type: ActivityType) => ({
    color:
      type === currentTabType
        ? theme.palette.common.black
        : theme.palette.gray.primary,

    fontWeight: type === currentTabType ? 700 : 400,
  });

  if (authMeData?.success === false) {
    return <Login />;
  }

  return (
    <Box>
      <Box className="H1" sx={{ width: "100%", textAlign: "center", mb: 4 }}>
        내 활동 내역
      </Box>

      {/* 탭 메뉴 */}
      <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
        {activityTabs.map((tab) => (
          <Button
            key={tab.type}
            onClick={() => activityTabChangeHandler(tab.type)}
            sx={{
              borderRadius: "10px",
              minWidth: "60px",
              minHeight: "32px",
              padding: "0 12px",
              "&:hover": {
                backgroundColor: theme.palette.gray.secondary,
              },
            }}
          >
            <Box className="B1" sx={activityTabSx(tab.type)}>
              {tab.name}
            </Box>
          </Button>
        ))}
      </Box>

      {/* 로딩 및 리스트 영역 */}
      {isLoading || authMeLoading ? (
        <Box
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
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.coverId || idx}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>
          <Box className="mt-8 flex justify-center">
            <Pagination
              count={data.data.totalPages || 1}
              page={page}
              onChange={pageChangeHandler}
              sx={{ "& .MuiPagination-ul": { flexWrap: "nowrap" } }}
            />
          </Box>
        </>
      ) : (
        <InfoMessage
          message={
            activityTabs[selectedTabIndex].type === "comment"
              ? `아직 ${activityTabs[selectedTabIndex].name}을 단 곡이 없습니다.\n새로운 곡을 찾아볼까요?`
              : activityTabs[selectedTabIndex].type === "like"
                ? `아직 ${activityTabs[selectedTabIndex].name}를 누른 곡이 없습니다.\n새로운 곡을 찾아볼까요?`
                : `아직 ${activityTabs[selectedTabIndex].name}한 곡이 없습니다.\n새로운 곡을 추천하시겠어요?`
          }
          buttonText={
            activityTabs[selectedTabIndex].type === "recommend"
              ? "곡 추천하기"
              : "최신글 보러가기"
          }
          onClick={() => linkHandler(activityTabs[selectedTabIndex].type)}
        />
      )}
    </Box>
  );
}
