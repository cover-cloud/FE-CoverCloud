"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";

import { getYoutubeVideoId } from "@/app/utils/youtube";
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
import { HiDotsHorizontal } from "react-icons/hi";

import ArtistInfo from "./components/ArtistInfo";
import CommentSection from "./components/CommentSection";
import PopularVideos from "./components/PopularVideos";

import Modal from "@/components/modal/Modal";
import theme from "@/app/lib/theme";
import { useFormatCreatedAt } from "@/app/utils/formetCreatedAt";
import OptionButton from "@/components/OptionButton";
import { fetchAuthMeWithCookie, useAuthMeQuery } from "@/app/api/auth/authMe";
import { useMobaileModeStore, useModalStore } from "@/app/store/useModalStore";
import { formatViewCount } from "@/app/utils/viewCount";
import { useSnackbarStore } from "@/app/store/useSnackbar";
const PostViewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { isLogin } = useAuthStore();

  const { data: myCommentList } = useMyCommentList();
  const userInfo = useAuthMeQuery();

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [toggleLikeButton, setToggleLikeButton] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { data: postData, isLoading: isPostLoading } = useReadingPost(
    id as string,
  );
  const isMobile = useMobaileModeStore((state) => state.isMobile);
  const videoId = postData ? getYoutubeVideoId(postData.data.data.link) : "";
  const formetCreatedAt = postData
    ? useFormatCreatedAt(postData.data.data.createdAt)
    : "";

  React.useEffect(() => {
    if (!postData) return;
    if (videoId) {
      setYoutubeVideoId(videoId); // 원본url
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

  if (isPostLoading) return <Box>로딩중..</Box>;

  if (!postData) {
    return <Box>페이지 로드에 실패하였습니다.</Box>;
  }
  if (!id) {
    return <div>찾을 수 없는 페이지입니다!</div>;
  }

  const navigateToEdit = async () => {
    const isAuthenticated = await fetchAuthMeWithCookie();
    if (!isAuthenticated.success) {
      openLoginModal();
      return;
    } else {
      router.push(`/post/${id}/edit`);
    }
  };
  const deletePostHandler = async () => {
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
    }
  };
  const likeToggleHandler = async () => {
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
            />
          </Box>
        )}
        <Box sx={{ marginBottom: "12px" }}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
            style={{ aspectRatio: "16 / 9" }}
          />
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
          <CommentSection
            id={Number(id)}
            currentUserId={userInfo.data?.data?.userId}
          />
        </Box>
      </Box>
      <Box className={isMobile ? "w-full" : "w-[33%]"}>
        <PopularVideos isViewer={!isMobile} />
      </Box>
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
    </Box>
  );
};

export default PostViewPage;
