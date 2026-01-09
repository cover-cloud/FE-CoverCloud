"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";

import { getYoutubeVideoId } from "@/app/utils/youtube";
import { deletePost, useReadingPost } from "@/app/api/cover/post";
import { fetchLike } from "@/app/api/cover/like";

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
const PostViewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { isLogin } = useAuthStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [youtubeVideoId, setYoutubeVideoId] = React.useState<string>("");
  const [coverTitle, setCoverTitle] = React.useState<string>("");
  const [coverArtist, setCoverArtist] = React.useState<string>("");
  const [createAt, setCreateAt] = React.useState<string>("");
  const [coverGenre, setCoverGenre] = React.useState<string>("");
  const [tags, setTags] = React.useState<string[]>([]);

  //상태
  const [isMobile, setIsMobile] = React.useState(false);
  const [isOptionOpen, setIsOptionOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [toggleLikeButton, setToggleLikeButton] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { data: postData, isLoading: isPostLoading } = useReadingPost(
    id as string,
    accessToken
  );

  const videoId = postData ? getYoutubeVideoId(postData.data.link) : "";
  const formetCreatedAt = postData
    ? useFormatCreatedAt(postData.data.createdAt)
    : "";
  React.useEffect(() => {
    if (!postData) return;
    if (videoId) {
      setYoutubeVideoId(videoId); // 원본url
    }

    setCoverTitle(postData.data.coverTitle);
    setCoverArtist(postData.data.coverArtist);

    setCreateAt(formetCreatedAt);
    setCoverGenre(postData.data.coverGenre);
    setTags(postData.data.tags);
  }, [postData]);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (isPostLoading) return <Box>로딩중..</Box>;
  console.log(postData, "포스트 데이터");
  if (!postData) {
    return <Box>페이지 로드에 실패하였습니다.</Box>;
  }
  if (!id) {
    return <div>찾을 수 없는 페이지입니다!</div>;
  }

  const openOptionHandler = () => {
    setIsOptionOpen(!isOptionOpen);
  };
  const navigateToEdit = () => {
    router.push(`/post/${id}/edit`);
  };
  const deletePostHandler = async () => {
    try {
      const deleteResult = await deletePost(
        id as string | string[],
        accessToken
      );
      console.log(deleteResult, "결과");
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
      const likedResult = await fetchLike(id as string);
      if (likedResult.success) {
        setToggleLikeButton(!toggleLikeButton);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex gap-3">
      <Box className="w-[66%]">
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
                {toggleLikeButton ? <FaRegHeart /> : <FaHeart />}
              </Button>
              <Box
                className="flex items-center justify-center relative"
                onClick={openOptionHandler}
              >
                <HiDotsHorizontal />
                {isOptionOpen && isLogin && (
                  <Box className="absolute top-7 right-0 bg-white w-24 border-2 border-gray-200">
                    <Box
                      className="hover:bg-gray-100 p-2"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      삭제
                    </Box>
                    <Box
                      className="hover:bg-gray-100 p-2"
                      onClick={navigateToEdit}
                    >
                      수정
                    </Box>
                  </Box>
                )}
                {isOptionOpen && !isLogin && (
                  <Box className="absolute top-7 right-0 bg-white w-24 border-2 border-gray-200">
                    <Box className="hover:bg-gray-100 p-2">신고</Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Box className="flex B1 mb-2">
            <Box>{"비어있음"}</Box>
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
            coverArtist={coverArtist}
            songTitle="노래제목"
            coverUrl=""
            isMobile={isMobile}
          />
          <CommentSection id={id as string} />
        </Box>
      </Box>
      <Box className="w-[33%]">
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
