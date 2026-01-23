"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";

import { getYoutubeVideoId } from "@/app/utils/youtube";
import { deletePost, useReadingPost } from "@/app/api/cover/post";
import { fetchLike, fetchUnlike } from "@/app/api/cover/like";
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
import { useModalStore } from "@/app/store/useModalStore";
const PostViewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { isLogin } = useAuthStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: myCommentList } = useMyCommentList(accessToken);
  const userInfo = useAuthMeQuery(accessToken);

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
  //상태
  const [isMobile, setIsMobile] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [toggleLikeButton, setToggleLikeButton] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { data: postData, isLoading: isPostLoading } = useReadingPost(
    id as string,
  );

  const videoId = postData ? getYoutubeVideoId(postData.data.data.link) : "";
  const formetCreatedAt = postData
    ? useFormatCreatedAt(postData.data.data.createdAt)
    : "";
  useEffect(() => {
    console.log(myCommentList);
    console.log(userInfo);
    // 이게 필요한가?
  }, [userInfo]);
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
  }, [postData]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);
  useEffect(() => {
    console.log(isMobile);
  }, [isMobile]);

  if (isPostLoading) return <Box>로딩중..</Box>;

  if (!postData) {
    return <Box>페이지 로드에 실패하였습니다.</Box>;
  }
  if (!id) {
    return <div>찾을 수 없는 페이지입니다!</div>;
  }

  const navigateToEdit = async () => {
    const isAuthenticated = await fetchAuthMeWithCookie(accessToken);
    if (!isAuthenticated.success) {
      openLoginModal();
      return;
    } else {
      router.push(`/post/${id}/edit`);
    }
  };
  const deletePostHandler = async () => {
    try {
      const deleteResult = await deletePost(
        id as string | string[],
        accessToken,
      );
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
    // setToggleLikeButton(!toggleLikeButton);
    setIsLoading(true);
    try {
      if (toggleLikeButton) {
        const likedResult = await fetchUnlike(id as string, accessToken);
        if (likedResult.success) {
          setToggleLikeButton(false);
          console.log("싫어요");
        }
      } else {
        const likedResult = await fetchLike(id as string, accessToken);
        if (likedResult.success) {
          setToggleLikeButton(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={isMobile ? "flex flex-col" : "flex gap-3"}>
      <Box className={isMobile ? "w-full" : "w-[66%]"}>
        <Box className="flex justify-between">
          <Box className="flex items-center justify-center">
            <IoIosArrowBack />
          </Box>
        </Box>
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
            <Box className="flex gap-2">
              <FaPlay />
              <Button onClick={likeToggleHandler} disabled={isLoading}>
                {!toggleLikeButton ? <FaRegHeart /> : <FaHeart />}
              </Button>
              <OptionButton
                isLogin={userInfo.data?.data?.userId === videoOwner}
                openDeleteModal={() => setIsDeleteModalOpen(true)}
                navigateToEdit={navigateToEdit}
              />
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
        <PopularVideos />
      </Box>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box>
          <h1>삭제</h1>
          <p>삭제하시겠습니까?</p>
          <Box>
            <Button onClick={() => setIsDeleteModalOpen(false)}>취소</Button>
            <Button onClick={deletePostHandler}>삭제</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PostViewPage;
