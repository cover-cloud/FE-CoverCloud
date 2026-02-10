"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  detectAndValidateMediaUrl,
  exampleUsage,
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

import { FaPlay } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

import ArtistInfo from "./components/ArtistInfo";
import CommentSection from "./components/CommentSection";
import PopularVideos from "./components/PopularVideos";

import Modal from "@/components/modal/Modal";
import theme from "@/app/lib/theme";
import { useFormatCreatedAt } from "@/app/utils/formetCreatedAt";
import OptionButton from "@/components/OptionButton";
import { fetchAuthMeWithCookie, useAuthMeQuery } from "@/app/api/auth/authMe";
import { useModalStore } from "@/app/store/useModalStore";
import { formatViewCount } from "@/app/utils/viewCount";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { requireAuth } from "@/app/utils/requireAuth";
import { reportPost } from "@/app/api/cover/reportPost";
const PostViewPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const userInfo = useAuthMeQuery();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = useAuthStore((state) => state.isLogin);
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  const [youtubeVideoId, setYoutubeVideoId] = React.useState<string>("");
  const [coverTitle, setCoverTitle] = React.useState<string>("");
  const [coverArtist, setCoverArtist] = React.useState<string>("");
  const [createAt, setCreateAt] = React.useState<string>("");
  const [coverGenre, setCoverGenre] = React.useState<string>("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [originalArtist, setOriginalArtist] = React.useState<string>("");
  const [originalTitle, setOriginalTitle] = React.useState<string>("");
  const [videoOwner, setVideoOwner] = React.useState<number | null>(null);
  const [likeCount, setLikeCount] = React.useState<number>(0);
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
  } = useReadingPost(id as string);
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
    if (videoId && videoId.embedUrl) {
      setYoutubeVideoId(videoId.embedUrl); // 원본url
    }

    setCoverTitle(postData.data.data.coverTitle);
    setCoverArtist(postData.data.data.coverArtist);
    setOriginalTitle(postData.data.data.originalTitle);
    setOriginalArtist(postData.data.data.originalArtist);
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
    const isAuthenticated = await fetchAuthMeWithCookie();

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
    const isAuthenticated = await fetchAuthMeWithCookie();
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
    const isAuthenticated = await fetchAuthMeWithCookie();
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
        router.push("/");
      } else {
        alert("삭제 실패");
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
    <Box className={isMobile ? "flex flex-col" : "flex"} sx={{ gap: "52px" }}>
      <Box className={isMobile ? "w-full" : "w-[66%]"}>
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
          {youtubeVideoId && (
            <iframe
              src={youtubeVideoId}
              width="100%"
              height={videoId?.platform === "soundcloud" ? "200px" : "auto"}
              style={{
                aspectRatio: getAspectRatio(videoId),
                borderRadius: "12px",
              }}
              allowFullScreen
            />
          )}
        </Box>
        <Box>
          <Box className="flex justify-between items-center">
            <h1 className="H1 mb-1">{coverTitle}</h1>
            <Box className="flex gap-4">
              <Box className="flex gap-2 items-center">
                <FaPlay />
                <Box sx={{ fontSize: "20px" }}>
                  {formatViewCount(postData?.data.data.viewCount)}
                </Box>
              </Box>
              <Button
                className="flex gap-2 items-center"
                onClick={likeToggleHandler}
                disabled={isLoading}
                disableRipple
                sx={{
                  minWidth: "auto",
                  padding: 0,
                  marginRight: "15px",
                  backgroundColor: "transparent",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                  "&:active": {
                    backgroundColor: "transparent",
                  },
                  "&.Mui-disabled": {
                    color: "#000",
                    opacity: 0.5,
                  },
                }}
              >
                {!toggleLikeButton ? (
                  <FaRegHeart size={20} />
                ) : (
                  <FaHeart size={20} />
                )}
                <Box
                  sx={{
                    fontSize: "20px",
                  }}
                >
                  {likeCount}
                </Box>
              </Button>

              {!isMobile && (
                <OptionButton
                  isLogin={userInfo.data?.data?.userId === videoOwner}
                  openDeleteModal={() => setIsDeleteModalOpen(true)}
                  navigateToEdit={navigateToEdit}
                  openReportModal={() => setIsReportModalOpen(true)}
                />
              )}
            </Box>
          </Box>

          <Box className="flex B1 mb-2">
            <Box>{coverArtist}</Box>
          </Box>
          <Box className="flex C2 mb-4">
            <Box>{createAt}</Box>
          </Box>
          <Box
            className="flex gap-2 items-center overflow-hidden min-w-0 "
            sx={{ marginBottom: "20px" }}
          >
            <Box className="flex-shrink-0">{coverGenre}</Box>

            <Box className="w-[1px] h-4 bg-black flex-shrink-0" />

            {/* 태그 묶음 */}
            <Box
              className="flex flex-1"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: theme.palette.purple.primary,
              }}
            >
              {tags?.map((t) => (
                <Box key={t} className="mr-2 ">
                  #{t}
                </Box>
              ))}
            </Box>
          </Box>
          <ArtistInfo
            coverArtist={originalArtist || ""}
            songTitle={originalTitle || ""}
            coverUrl=""
            isMobile={isMobile}
          />
          {isMobile && (
            <Box
              onClick={() => setIsCommentOpen(true)}
              sx={{
                p: 2,
                my: 2,
                bgcolor: theme.palette.gray.secondary,
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography className="B1">댓글 보기</Typography>
              <Typography
                sx={{ color: theme.palette.gray.primary }}
              ></Typography>
            </Box>
          )}
          {!isMobile && (
            <CommentSection
              id={Number(id)}
              currentUserId={userInfo.data?.data?.userId}
            />
          )}
        </Box>
      </Box>
      <Box className={isMobile ? "w-full" : "w-[33%]"}>
        <PopularVideos isViewer={!isMobile} />
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

export default PostViewPage;
