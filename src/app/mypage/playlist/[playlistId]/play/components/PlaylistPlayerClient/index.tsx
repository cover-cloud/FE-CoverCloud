"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@mui/material";

import PlayerViewer from "@/components/player/PlayerViewer";
import ConfirmModal from "@/components/player/components/ConfirmModal";
import Loading from "@/app/main/loading";

import theme from "@/app/lib/theme";
import { MediaUrlResult } from "@/app/utils/youtube";

import { usePlaylistDetailQuery } from "@/app/api/mypage/playlist/playlist";
import { useReadingPost } from "@/app/api/cover/post";

import { PlaylistItem } from "@/app/mypage/playlist/components/playlistTypes";
import { usePlayerActions } from "@/app/hook/usePlayerActions";

type PlaylistPlayerClientProps = {
  playlistId: string;
};

const PlaylistPlayerClient = ({ playlistId }: PlaylistPlayerClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const playlistIdNum = Number(playlistId);

  const { data, isLoading } = usePlaylistDetailQuery(playlistIdNum);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

  const items: PlaylistItem[] = data?.data?.items ?? [];

  /**
   * /play 로 들어오면 itemIdParam은 null
   * /play?itemId=18 로 들어오면 "18"
   */
  const itemIdParam = searchParams.get("itemId");

  /**
   * itemId가 있으면 해당 item
   * itemId가 없으면 첫 번째 item
   */
  const currentIndex = React.useMemo(() => {
    if (!items.length) return -1;

    if (!itemIdParam) {
      return 0;
    }

    const currentItemId = Number(itemIdParam);

    if (!Number.isFinite(currentItemId)) {
      return 0;
    }

    const foundIndex = items.findIndex((item) => item.itemId === currentItemId);

    return foundIndex === -1 ? 0 : foundIndex;
  }, [items, itemIdParam]);

  const currentItem = items[currentIndex];

  /**
   * 게시글 상세 조회에는 coverId만 사용
   */
  const currentCoverId = currentItem?.coverId ?? 0;

  const {
    data: postData,
    isLoading: isPostLoading,
    isFetching: isPostFetching,
    error: postError,
  } = useReadingPost(currentCoverId ? String(currentCoverId) : "");

  const post = postData?.data?.data;

  const getAspectRatio = (videoData: MediaUrlResult | null) => {
    if (!videoData || !videoData.platform) return "16 / 9";

    switch (videoData.platform) {
      case "soundcloud":
        return "100 / 20";

      default:
        return "16 / 9";
    }
  };

  /**
   * 리스트 클릭 / 다음 곡 이동 시에만 URL 변경
   */
  const moveToItem = (nextItemId: number) => {
    if (nextItemId === currentItem?.itemId) return;

    router.push(`${pathname}?itemId=${nextItemId}`);
  };

  const {
    isLiked,
    likeCount,
    isLikeLoading,
    navigateToEdit,
    reportHandler,
    deleteHandler,
    likeToggleHandler,
  } = usePlayerActions({
    coverId: currentCoverId,
    initialIsLiked: post?.isLiked ?? false,
    initialLikeCount: post?.likeCount ?? 0,
    editHref: `/post/${currentCoverId}/edit`,
    afterDeleteHref: `/mypage/playlist/${playlistId}/play${
      currentItem?.itemId ? `?itemId=${currentItem.itemId}` : ""
    }`,
    onDeleteModalClose: () => setIsDeleteModalOpen(false),
    onReportModalClose: () => setIsReportModalOpen(false),
  });

  const handleVideoEnded = () => {
    if (!items.length || currentIndex === -1) return;

    const nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
    const nextItem = items[nextIndex];

    if (!nextItem) return;

    moveToItem(nextItem.itemId);
  };

  if (isLoading || isPostLoading || isPostFetching) {
    return <Loading />;
  }

  if (!items.length) {
    return <div>플레이리스트에 재생할 곡이 없습니다.</div>;
  }

  if (!currentItem) {
    return <div>재생할 곡이 없습니다.</div>;
  }

  if (postError) {
    return <div>게시글 정보를 불러오지 못했습니다.</div>;
  }

  if (!post) {
    return <div>게시글 데이터가 없습니다.</div>;
  }

  const playerData = {
    id: post.coverId ?? currentCoverId,
    userId: post.userId ?? 0,

    link: post.link ?? "",

    coverTitle: post.coverTitle ?? "",
    coverArtist: post.coverArtist ?? "",

    originalTitle: post.originalTitle ?? "",
    originalArtist: post.originalArtist ?? "",
    originalCoverImageUrl: post.originalCoverImageUrl ?? "",

    coverGenre: post.coverGenre ?? "",
    tags: post.tags ?? [],

    createdAt: post.createdAt ?? "",

    likeCount,
    viewCount: post.viewCount ?? 0,
    isLiked,
  };

  return (
    <>
      <PlayerViewer
        data={playerData}
        playlistId={playlistIdNum}
        playListItems={items}
        userProfileImage=""
        isMobile={isMobile}
        isLikedLoading={isLikeLoading}
        isVideolistLoading={isLoading || isPostLoading || isPostFetching}
        showComments
        showAddPlaylistButton
        showOptions
        showPopularVideos={false}
        showLikeCount
        isPlaylistPlayer
        onVideoEnded={handleVideoEnded}
        getAspectRatio={getAspectRatio}
        onBack={() => router.back()}
        onLikeToggle={likeToggleHandler}
        onEdit={navigateToEdit}
        onDelete={() => setIsDeleteModalOpen(true)}
        onReport={() => setIsReportModalOpen(true)}
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

export default PlaylistPlayerClient;
