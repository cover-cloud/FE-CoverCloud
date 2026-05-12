"use client";

import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useReadingPost } from "@/app/api/cover/post";
import { useAuthMeQuery } from "@/app/api/auth/authMe";

import Modal from "@/components/modal/Modal";
import PlayerViewer from "@/components/player/PlayerViewer";

import theme from "@/app/lib/theme";
import { useFormatCreatedAt } from "@/app/utils/formetCreatedAt";
import { MediaUrlResult } from "@/app/utils/youtube";
import { PlayerViewData } from "@/components/player/playerTypes";
import { usePlayerActions } from "@/app/hook/usePlayerActions";
import ConfirmModal from "@/components/player/components/ConfirmModal";

type PostClientProps = {
  id: string;
  initialData?: any;
};

const PostClient = ({ id, initialData }: PostClientProps) => {
  const userInfo = useAuthMeQuery();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

  const {
    data: postData,
    isLoading: isPostLoading,
    error,
  } = useReadingPost(id, { data: initialData });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const post = postData?.data?.data;

  const formattedCreatedAt = useFormatCreatedAt(post?.createdAt ?? "");

  const {
    isLiked,
    likeCount,
    isLikeLoading,
    navigateToEdit,
    reportHandler,
    deleteHandler,
    likeToggleHandler,
    goBack,
  } = usePlayerActions({
    coverId: id,
    initialIsLiked: post?.isLiked ?? false,
    initialLikeCount: post?.likeCount ?? 0,
    editHref: `/post/${id}/edit`,
    afterDeleteHref: "/",
    onDeleteModalClose: () => setIsDeleteModalOpen(false),
    onReportModalClose: () => setIsReportModalOpen(false),
  });

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
    isLiked,
  };

  return (
    <>
      <PlayerViewer
        data={playerData}
        userProfileImage={userInfo.data?.data?.profileImage || ""}
        isMobile={isMobile}
        isLikedLoading={isLikeLoading}
        showComments
        showAddPlaylistButton
        showOptions
        showPopularVideos
        showLikeCount
        onBack={goBack}
        onLikeToggle={likeToggleHandler}
        onEdit={navigateToEdit}
        onDelete={() => setIsDeleteModalOpen(true)}
        onReport={() => setIsReportModalOpen(true)}
        onVideoEnded={() => {
          // 게시글 단건 페이지에서는 다음 곡 이동 없음
        }}
        getAspectRatio={getAspectRatio}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="게시글 삭제"
        description={
          <>
            삭제한 게시글은 다시 복구할 수 없습니다.
            <br />
            정말 삭제하시겠습니까?
          </>
        }
        confirmText="삭제"
        confirmColor="error"
        onConfirm={deleteHandler}
      />

      <ConfirmModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="게시글 신고"
        description="게시글을 신고하시겠습니까?"
        confirmText="신고"
        confirmColor="error"
        onConfirm={reportHandler}
      />
    </>
  );
};

export default PostClient;
