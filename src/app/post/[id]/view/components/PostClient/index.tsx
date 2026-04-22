"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  detectAndValidateMediaUrl,
  exampleUsage,
  fetchSoundCloudDataWithApi,
  fetchTiktokDataWithApi,
  getYoutubeVideoId,
  MediaUrlResult,
} from "@/app/utils/youtube";
import { deletePost, useReadingPost } from "@/app/api/cover/post";
import {
  fetchLike,
  fetchUnlike,
  useLikeMutation,
  useUnlikeMutation,
} from "@/app/api/cover/like";
import { useMyCommentList } from "@/app/api/cover/comment";

import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

import PlayLikeCount from "../PlayLikeCount";
import ArtistInfo from "../ArtistInfo";
import CommentSection from "../CommentSection";
import PopularVideos from "../PopularVideos";

import Modal from "@/components/modal/Modal";
import theme from "@/app/lib/theme";
import { useFormatCreatedAt } from "@/app/utils/formetCreatedAt";
import OptionButton from "@/components/OptionButton";
import { fetchAuthMeWithCookie, useAuthMeQuery } from "@/app/api/auth/authMe";
import { useModalStore } from "@/app/store/useModalStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { requireAuth } from "@/app/utils/requireAuth";
import { reportPost } from "@/app/api/cover/reportPost";
const genres = [
  { title: "K-POP", value: "K_POP" },
  { title: "J-POP", value: "J_POP" },
  { title: "POP", value: "POP" },
  { title: "기타", value: "OTHER" },
];
const PostClient = ({ id, initialData }: { id: string; initialData?: any }) => {
  const router = useRouter();

  const userInfo = useAuthMeQuery();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = useAuthStore((state) => state.isLogin);
  const openLoginModal = useModalStore((state) => state.openLoginModal);
  const initialVideo = initialData?.data?.link
    ? detectAndValidateMediaUrl(initialData?.data?.link)
    : null;
  const initialCreatedAt = useFormatCreatedAt(initialData?.data?.createdAt);
  const [youtubeVideoId, setYoutubeVideoId] = React.useState<string>(
    initialVideo?.embedUrl || "",
  );
  const [coverTitle, setCoverTitle] = React.useState<string>(
    initialData?.data?.coverTitle || "",
  );
  const [coverArtist, setCoverArtist] = React.useState<string>(
    initialData?.data?.coverArtist || "",
  );
  const [createAt, setCreateAt] = React.useState<string>(
    initialCreatedAt || "",
  );
  const [coverGenre, setCoverGenre] = React.useState<string>(
    initialData?.data?.coverGenre || "",
  );
  const [tags, setTags] = React.useState<string[]>(
    initialData?.data?.tags || [],
  );
  const [originalArtist, setOriginalArtist] = React.useState<string>(
    initialData?.data?.originalArtist || "",
  );
  const [originalTitle, setOriginalTitle] = React.useState<string>(
    initialData?.data?.originalTitle || "",
  );
  const [originalCoverImageUrl, setOriginalCoverImageUrl] =
    React.useState<string>(initialData?.data?.originalCoverImageUrl || "");
  const [videoOwner, setVideoOwner] = React.useState<number | null>(null);
  const [likeCount, setLikeCount] = React.useState<number>(
    initialData?.data?.likeCount || 0,
  );
  //상태
  const [isCommentOpen, setIsCommentOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [toggleLikeButton, setToggleLikeButton] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    data: postData,
    isLoading: isPostLoading,
    error,
  } = useReadingPost(id as string, { data: initialData });
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const videoId: MediaUrlResult = postData
    ? detectAndValidateMediaUrl(postData.data.data.link)
    : { platform: null, id: null, isValid: false, originalUrl: "" };
  const formetCreatedAt = postData
    ? useFormatCreatedAt(postData.data.data.createdAt)
    : "";
  const getAspectRatio = (videoId: MediaUrlResult | null) => {
    if (!videoId || !videoId.platform) return "16 / 9"; // 기본값

    switch (videoId.platform) {
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
  React.useEffect(() => {
    if (!postData) return;
    const rawLink = postData.data.data.link; // 서버에서 받아온 원본 링크
    const videoInfo = detectAndValidateMediaUrl(rawLink);

    // 비동기로 ID와 Embed URL을 확정짓는 함수
    const resolveMedia = async () => {
      // 1. 틱톡이고, 단축 URL(embedUrl이 없는 상태)인 경우
      if (videoInfo.platform === "tiktok" && !videoInfo.embedUrl) {
        const tiktokData = await fetchTiktokDataWithApi(rawLink);
        if (tiktokData && tiktokData.embedUrl) {
          setYoutubeVideoId(tiktokData.embedUrl); // 진짜 숫자 ID가 포함된 주소로 세팅
        }
      }
      if (videoInfo.platform === "soundcloud" && !videoInfo.embedUrl) {
        const soundcloudData = await fetchSoundCloudDataWithApi(rawLink);
        if (soundcloudData && soundcloudData.embedUrl) {
          setYoutubeVideoId(soundcloudData.embedUrl); // 진짜 숫자 ID가 포함된 주소로 세팅
        }
      }
      // 2. 유튜브나 이미 ID가 있는 틱톡, 사운드클라우드인 경우
      else if (videoInfo.embedUrl) {
        setYoutubeVideoId(videoInfo.embedUrl);
      }
    };

    resolveMedia();

    setCoverTitle(postData.data.data.coverTitle);
    setCoverArtist(postData.data.data.coverArtist);
    setOriginalTitle(postData.data.data.originalTitle);
    setOriginalArtist(postData.data.data.originalArtist);
    setOriginalCoverImageUrl(postData.data.data.originalCoverImageUrl);
    setCreateAt(formetCreatedAt);
    setCoverGenre(postData.data.data.coverGenre);
    setTags(postData.data.data.tags);
    setVideoOwner(postData.data.data.userId);
    setToggleLikeButton(postData.data.data.isLiked);
    setLikeCount(postData.data.data.likeCount);
  }, [postData]);

  if (isPostLoading)
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

  if (error) {
    return <Box>페이지 로드에 실패하였습니다.</Box>;
  }
  if (!id) {
    return <div>찾을 수 없는 페이지입니다!</div>;
  }

  const navigateToEdit = async () => {
    const isAuthenticated = await fetchAuthMeWithCookie(accessToken);

    if (!isAuthenticated.success) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 수정할 수 있습니다.", "error");
      return;
    } else {
      router.push(`/post/${id}/edit`);
    }
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
      const reportResult = await reportPost(id as string);
      if (reportResult.data.success) {
        setIsReportModalOpen(false);
        useSnackbarStore.getState().show("신고가 접수되었습니다.", "success");
      } else {
        useSnackbarStore.getState().show("신고 실패", "error");
        setIsReportModalOpen(false);
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      setIsDeleteModalOpen(false);
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
      const deleteResult = await deletePost(id as string | string[]);
      if (deleteResult.success) {
        useSnackbarStore.getState().show("삭제가 완료되었습니다.", "success");
        router.push("/");
      } else {
        useSnackbarStore.getState().show("삭제 실패", "error");
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log(error);
      setIsDeleteModalOpen(false);
    }
  };
  const likeToggleHandler = async () => {
    if (!isLogin && !accessToken) {
      openLoginModal();
      useSnackbarStore
        .getState()
        .show("로그인 후 좋아요를 할 수 있습니다.", "error");
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    if (toggleLikeButton) {
      const unlikeResult = await fetchUnlike(id as string);
      if (!unlikeResult.success) {
        useSnackbarStore.setState({
          open: true,
          message: "좋아요 취소에 실패했습니다.",
        });
        return;
      } else {
        useSnackbarStore.setState({
          open: true,
          message: "좋아요가 취소되었습니다.",
        });
        setToggleLikeButton(false);
        setLikeCount((prev) => prev - 1);
      }
    } else {
      const likeResult = await fetchLike(id as string);
      if (!likeResult.success) {
        useSnackbarStore.setState({
          open: true,
          message: "좋아요에 실패했습니다.",
        });
        return;
      } else {
        useSnackbarStore.setState({
          open: true,
          message: "좋아요가 추가되었습니다.",
        });
        setToggleLikeButton(true);
        setLikeCount((prev) => prev + 1);
      }
      console.log("Like", likeResult);
    }
    setIsLoading(false);
  };

  return (
    <Box className="main-wrapper">
      <Box className="post-content">
        {isMobile && (
          <Box
            className="flex justify-between"
            sx={{
              my: "20px",
              mx: "10px",
            }}
          >
            <Box
              className="flex items-center justify-center"
              onClick={() => router.back()}
            >
              <IoIosArrowBack size={24} />
            </Box>

            <OptionButton
              isLogin={userInfo.data?.data?.userId === videoOwner}
              openDeleteModal={() => setIsDeleteModalOpen(true)}
              navigateToEdit={navigateToEdit}
              openReportModal={() => setIsReportModalOpen(true)}
            />
          </Box>
        )}
        <Box sx={{ marginBottom: "12px" }}>
          {youtubeVideoId ? (
            <iframe
              src={youtubeVideoId}
              width="100%"
              height={videoId?.platform === "soundcloud" ? "200px" : "auto"}
              style={{
                aspectRatio: getAspectRatio(videoId),
                borderRadius: "12px",
                border: "none",
              }}
              allowFullScreen
            />
          ) : (
            /* 동영상이 준비되기 전 보여줄 스켈레톤 */
            <Skeleton
              variant="rounded"
              width="100%"
              sx={{
                aspectRatio: getAspectRatio(videoId), // 비디오와 동일한 비율 유지
                borderRadius: "12px",
                height: videoId?.platform === "soundcloud" ? "200px" : "auto",
              }}
              animation="wave"
            />
          )}
        </Box>
        <Box>
          <Box className="flex justify-between items-center">
            <h1 className="H1 mb-1">{coverTitle}</h1>
            {!isMobile && (
              <Box className="flex gap-4">
                <PlayLikeCount
                  viewCount={postData?.data.data.viewCount}
                  likeCount={likeCount}
                  isLiked={toggleLikeButton}
                  isLoading={isLoading}
                  isMobile={isMobile}
                  onLikeToggle={likeToggleHandler}
                />

                {!isMobile && (
                  <OptionButton
                    isLogin={userInfo.data?.data?.userId === videoOwner}
                    openDeleteModal={() => setIsDeleteModalOpen(true)}
                    navigateToEdit={navigateToEdit}
                    openReportModal={() => setIsReportModalOpen(true)}
                    isCenter
                  />
                )}
              </Box>
            )}
          </Box>

          <Box className="flex B1 mb-2 ">
            <Box>커버 아티스트： </Box>
            <Box sx={{ fontWeight: "bold" }}>{coverArtist}</Box>
          </Box>
          <Box className="flex C2 mb-4">
            <Box>{createAt} 작성</Box>
          </Box>
          <Box
            className="flex gap-2 items-center min-w-0"
            sx={{ marginBottom: "20px", flexWrap: "wrap" }}
          >
            <Box className="flex-shrink-0 S3">
              {genres.find((g) => g.value === coverGenre)?.title || "기타"}
            </Box>

            <Box className="w-[1px] h-4 bg-black flex-shrink-0" />

            {/* 태그 묶음 */}
            <Box
              className="flex flex-1"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: theme.palette.purple.primary,
                flexWrap: "wrap",
              }}
            >
              {tags?.map((t) => (
                <Box
                  key={t}
                  className="mr-2"
                  sx={{ cursor: "pointer", "&:hover": { opacity: 0.7 } }}
                  onClick={() =>
                    router.push(
                      `/search?q=${encodeURIComponent(t)}&searchType=tags`,
                    )
                  }
                >
                  #{t}
                </Box>
              ))}
            </Box>
          </Box>
          {isMobile && (
            <Box className="mb-5">
              <PlayLikeCount
                viewCount={postData?.data.data.viewCount}
                likeCount={likeCount}
                isLiked={toggleLikeButton}
                isLoading={isLoading}
                isMobile={isMobile}
                onLikeToggle={likeToggleHandler}
              />
            </Box>
          )}
          <ArtistInfo
            coverArtist={originalArtist || "정보없음"}
            songTitle={originalTitle || "정보없음"}
            coverUrl={originalCoverImageUrl || ""}
            isMobile={isMobile}
          />
          {!isPostLoading && isMobile && (
            <Box
              onClick={() => setIsCommentOpen(true)}
              sx={{
                p: 2,

                bgcolor: theme.palette.gray.secondary,
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box className="B1">댓글 보기</Box>
              <Typography
                sx={{ color: theme.palette.gray.primary }}
              ></Typography>
            </Box>
          )}
          {!isPostLoading && !isMobile && (
            <CommentSection
              id={Number(id)}
              currentUserId={userInfo.data?.data?.userId}
              userProfileImage={userInfo.data?.data?.profileImage || ""}
            />
          )}
        </Box>
      </Box>
      <Box className="sidebar-content">
        <PopularVideos isViewer={!isMobile} currentCoverId={Number(id)} />
      </Box>
      {isMobile && (
        <SwipeableDrawer
          anchor="bottom"
          open={isCommentOpen}
          onClose={() => setIsCommentOpen(false)}
          onOpen={() => setIsCommentOpen(true)}
          // 드로어 높이 및 리사이징 설정
          PaperProps={{
            sx: {
              height: "75dvh", // 화면의 75% 차지
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              댓글
            </Typography>
            <Button onClick={() => setIsCommentOpen(false)}>
              <IoCloseSharp size={32} />
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
            <CommentSection
              id={Number(id)}
              currentUserId={userInfo.data?.data?.userId}
              userProfileImage={userInfo.data?.data?.profileImage || ""}
            />
          </Box>
        </SwipeableDrawer>
      )}
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
          {/* 제목 */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: "8px" }}>
            게시글 삭제
          </Typography>

          {/* 설명 */}

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

          {/* 버튼 영역 */}
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
          {/* 제목 */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: "8px" }}>
            게시글 신고
          </Typography>

          {/* 설명 */}

          <Typography
            sx={{
              fontSize: "20px",
              color: "#666",
              mb: "24px",
            }}
          >
            게시글을 신고하시겠습니까?
          </Typography>

          {/* 버튼 영역 */}
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
    </Box>
  );
};

export default PostClient;
