"use client";

import React from "react";
import { Box } from "@mui/material";
import { getYoutubeVideoId } from "@/app/utils/youtube";
import ArtistInfo from "./components/ArtistInfo";
import CommentSection from "./components/CommentSection";

const PostViewPage = () => {
  const youtubeVideoId = getYoutubeVideoId(
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // 원본url
  );

  const genres = "장르";
  const tag = ["태그1", "태그2", "태그3"];
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
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
    </div>
  );
};

export default PostViewPage;
