"use client";

import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { deletePost, useReadingPost } from "@/app/api/cover/post";
import { fetchLike, fetchUnlike } from "@/app/api/cover/like";
import { fetchAuthMeWithCookie, useAuthMeQuery } from "@/app/api/auth/authMe";
import { reportPost } from "@/app/api/cover/reportPost";

import { useAuthStore } from "@/app/store/useAuthStore";
import { useModalStore } from "@/app/store/useModalStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";

import Modal from "@/components/modal/Modal";
import PlayerViewer from "@/components/player/PlayerViewer";

import theme from "@/app/lib/theme";
import { useFormatCreatedAt } from "@/app/utils/formetCreatedAt";
import { MediaUrlResult } from "@/app/utils/youtube";
import { PlayerViewData } from "@/components/player/playerTypes";

type PostClientProps = {
  id: string;
  initialData?: any;
};

const PostClient = ({ id, initialData }: PostClientProps) => {
  const router = useRouter();

  const userInfo = useAuthMeQuery();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = useAuthStore((state) => state.isLogin);
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

  const [toggleLikeButton, setToggleLikeButton] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    data: postData,
    isLoading: isPostLoading,
    error,
  } = useReadingPost(id, { data: initialData });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const post = postData?.data?.data;

  const formattedCreatedAt = useFormatCreatedAt(post?.createdAt ?? "");

  React.useEffect(() => {
    if (!post) return;

    setToggleLikeButton(post.isLiked);
    setLikeCount(post.likeCount ?? 0);
  }, [post]);

  const getAspectRatio = (videoData: MediaUrlResult | null) => {
    if (!videoData || !videoData.platform) return "16 / 9";

    switch (videoData.platform) {
      case "youtube":
        return "16 / 9";

      case "tiktok":
        return "16 / 9";

      case "soundcloud":
        return "100 / 20";

      default:
        return "16 / 9";
    }
  };

  if (isPostLoading) {
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

  if (error) {
    return <Box>페이지 로드에 실패하였습니다.</Box>;
  }

  if (!id || !post) {
    return <Box>찾을 수 없는 페이지입니다!</Box>;
  }

  const playerData: PlayerViewData = {
    id: Number(id),
    userId: post.userId,

    link: post.link || "",

    coverTitle: post.coverTitle || "",
    coverArtist: post.coverArtist || "",

    originalTitle: post.originalTitle || "",
    originalArtist: post.originalArtist || "",
    originalCoverImageUrl: post.originalCoverImageUrl || "",

    coverGenre: post.coverGenre || "",
    tags: post.tags || [],

    createdAt: formattedCreatedAt,

    likeCount,
    viewCount: post.viewCount ?? 0,
    isLiked: toggleLikeButton,
  };

  const navigateToEdit = async () => {
    const isAuthenticated = await fetchAuthMeWithCookie(accessToken);

    if (!isAuthenticated.success) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 수정할 수 있습니다.", "error");

      return;
    }

    router.push(`/post/${id}/edit`);
  };

  const reportPostHandler = async () => {
    const isAuthenticated = await fetchAuthMeWithCookie(accessToken);

    if (!isAuthenticated.success) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 신고할 수 있습니다.", "error");

      setIsReportModalOpen(false);

      return;
    }

    try {
      const reportResult = await reportPost(id);

      if (reportResult.data.success) {
        useSnackbarStore.getState().show("신고가 접수되었습니다.", "success");
      } else {
        useSnackbarStore.getState().show("신고 실패", "error");
      }

      setIsReportModalOpen(false);
    } catch (error) {
      setIsReportModalOpen(false);

      useSnackbarStore.getState().show("신고 실패", "error");
    }
  };

  const deletePostHandler = async () => {
    const isAuthenticated = await fetchAuthMeWithCookie(accessToken);

    if (!isAuthenticated.success) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 삭제할 수 있습니다.", "error");

      setIsDeleteModalOpen(false);

      return;
    }

    try {
      const deleteResult = await deletePost(id);

      if (deleteResult.success) {
        useSnackbarStore.getState().show("삭제가 완료되었습니다.", "success");
        router.push("/");
      } else {
        useSnackbarStore.getState().show("삭제 실패", "error");
      }

      setIsDeleteModalOpen(false);
    } catch (error) {
      setIsDeleteModalOpen(false);

      useSnackbarStore.getState().show("삭제 실패", "error");
    }
  };

  const likeToggleHandler = async () => {
    if (!isLogin || !accessToken) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 좋아요를 할 수 있습니다.", "error");

      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (toggleLikeButton) {
        const unlikeResult = await fetchUnlike(id);

        if (!unlikeResult.success) {
          useSnackbarStore
            .getState()
            .show("좋아요 취소에 실패했습니다.", "error");

          return;
        }

        useSnackbarStore.getState().show("좋아요가 취소되었습니다.", "success");

        setToggleLikeButton(false);
        setLikeCount((prev) => prev - 1);
      } else {
        const likeResult = await fetchLike(id);

        if (!likeResult.success) {
          useSnackbarStore.getState().show("좋아요에 실패했습니다.", "error");

          return;
        }

        useSnackbarStore.getState().show("좋아요가 추가되었습니다.", "success");

        setToggleLikeButton(true);
        setLikeCount((prev) => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PlayerViewer
        data={playerData}
        userProfileImage={userInfo.data?.data?.profileImage || ""}
        isMobile={isMobile}
        isLoading={isLoading}
        showComments
        showAddPlaylistButton
        showOptions
        showPopularVideos
        showLikeCount
        onBack={() => router.back()}
        onLikeToggle={likeToggleHandler}
        onEdit={navigateToEdit}
        onDelete={() => setIsDeleteModalOpen(true)}
        onReport={() => setIsReportModalOpen(true)}
        onVideoEnded={() => {
          // 게시글 단건 페이지에서는 다음 곡 이동 없음
        }}
        getAspectRatio={getAspectRatio}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box
          className="flex flex-col items-center"
          sx={{
            width: "100%",
            bgcolor: "#fff",
            borderRadius: "12px",
            p: "40px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: "8px" }}>
            게시글 삭제
          </Typography>

          <Typography
            sx={{
              fontSize: "20px",
              color: "#666",
              mb: "24px",
            }}
          >
            삭제한 게시글은 다시 복구할 수 없습니다.
            <br />
            정말 삭제하시겠습니까?
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={deletePostHandler}
            >
              삭제
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      >
        <Box
          className="flex flex-col items-center"
          sx={{
            width: "100%",
            bgcolor: "#fff",
            borderRadius: "12px",
            p: "40px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: "8px" }}>
            게시글 신고
          </Typography>

          <Typography
            sx={{
              fontSize: "20px",
              color: "#666",
              mb: "24px",
            }}
          >
            게시글을 신고하시겠습니까?
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setIsReportModalOpen(false)}
            >
              취소
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={reportPostHandler}
            >
              신고
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default PostClient;
