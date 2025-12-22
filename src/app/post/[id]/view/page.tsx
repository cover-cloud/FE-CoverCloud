"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import { getYoutubeVideoId } from "@/app/utils/youtube";
import { IoIosArrowBack } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useAuthMeQuery } from "@/app/api/auth/authMe";
import { deletePost } from "@/app/api/cover/post";

import ArtistInfo from "./components/ArtistInfo";
import CommentSection from "./components/CommentSection";
import PopularVideos from "./components/PopularVideos";

import Modal from "@/components/modal/Modal";
const PostViewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { isLogin } = useAuthStore();

  const { data, isLoading, error } = useAuthMeQuery();
  console.log(data, error, "로그인 되었나?");

  const youtubeVideoId = getYoutubeVideoId(
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // 원본url
  );

  const genres = "장르";
  const tag = ["태그1", "태그2", "태그3"];
  const [isMobile, setIsMobile] = React.useState(false);
  const [isOptionOpen, setIsOptionOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const openOptionHandler = () => {
    setIsOptionOpen(!isOptionOpen);
  };
  const navigateToEdit = () => {
    router.push(`/post/${id}/edit`);
  };
  const deletePostHandler = async () => {
    try {
      const deleteResult = await deletePost(id as string | string[]);
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
  return (
    <Box className="flex gap-3">
      <Box className="w-[66%]">
        <Box className="flex justify-between">
          <Box className="flex items-center justify-center">
            <IoIosArrowBack />
          </Box>
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
                <Box className="hover:bg-gray-100 p-2" onClick={navigateToEdit}>
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
        <Box className="mt-3">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </Box>
        <Box>
          <h1>제목</h1>
          <Box className="flex">
            <Box>아티스트: </Box>
            <Box>아티스트</Box>
          </Box>
          <Box className="flex">
            <Box>좋아요: </Box>
            <Box>좋아요</Box>
          </Box>
          <Box className="flex gap-2 items-center overflow-hidden min-w-0">
            <Box className="flex-shrink-0">{genres}</Box>

            <Box className="w-[1px] h-4 bg-black flex-shrink-0" />

            {/* 태그 묶음 */}
            <Box className="flex-1">
              {tag?.map((t) => (
                <span key={t} className="text-xs text-black mr-2 underline">
                  #{t}
                </span>
              ))}
            </Box>
          </Box>
          <ArtistInfo
            coverArtist="아티스트"
            songName="노래제목"
            albumImage=""
            isMobile={isMobile}
          />
          <CommentSection />
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
