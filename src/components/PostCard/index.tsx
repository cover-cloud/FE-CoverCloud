"use client";

import React, { useState } from "react";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import "./PostCard.module.css";
import Box from "@mui/material/Box";
import router from "next/router";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import { contentData } from "../../app/main/type";
import { getMediaThumbnail, getYoutubeVideoId } from "../../app/utils/youtube";
import { useTheme } from "@mui/material/styles";
import { detectAndValidateMediaUrl } from "../../app/utils/youtube";

const DEFAULT_IMAGE = "/asset/image/default-image.png";
const genres = [
  { title: "K-POP", value: "K_POP" },
  { title: "J-POP", value: "J_POP" },
  { title: "POP", value: "POP" },
  { title: "기타", value: "OTHER" },
];
const PostCard: React.FC<contentData & { isViewer?: boolean }> = ({
  coverArtist,
  coverGenre,
  coverId,
  coverTitle,
  createdAt,
  likeCount,
  link,
  musicId,
  tags,
  userId,
  viewCount,
  isViewer,
}) => {
  const theme = useTheme();
  const videoId = detectAndValidateMediaUrl(link);

  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ useEffect 안에서 async 처리
  React.useEffect(() => {
    const fetchThumbnail = async () => {
      if (!videoId) {
        setImageSrc(DEFAULT_IMAGE);
        return;
      }

      try {
        const thumbnail = await getMediaThumbnail(videoId);
        setImageSrc(thumbnail);
      } catch (error) {
        console.error("Thumbnail fetch failed:", error);
        setImageSrc(DEFAULT_IMAGE);
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnail();
  }, [videoId]);
  return (
    <Link href={`/post/${coverId}/view`}>
      <Box
        className={` ${isViewer ? "flex" : "flex-col"}`}
        sx={{
          padding: isViewer ? "0px" : "12px 20px 14px 20px",
          borderRadius: "12px",
          "&:hover": {
            backgroundColor: theme.palette.gray.tertiary,
          },
        }}
      >
        <Box
          className={`relative flex-shrink-0 ${isViewer ? "w-[148px] h-[107px]" : "w-full h-40"}`}
        >
          {/* Skeleton: 로딩 중이거나 이미지 소스가 없을 때 표시 */}
          {(loading || !imageSrc) && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{ position: "absolute", inset: 0, zIndex: 1 }}
            />
          )}

          {/* Image: 소스가 있을 때만 렌더링 */}
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={coverTitle || "Post Image"}
              fill
              sizes={isViewer ? "148px" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover"
              style={{
                opacity: loading ? 0 : 1,
                transition: "opacity 0.3s ease",
              }}
              onLoad={() => setLoading(false)}
              onError={() => {
                setImageSrc(DEFAULT_IMAGE);
                setLoading(false);
              }}
            />
          )}
        </Box>
        <Box
          className="flex flex-col flex-1 min-w-0"
          sx={{
            marginTop: isViewer ? "8px" : "20px",
            marginBottom: isViewer ? "10px" : "0",
            marginLeft: isViewer ? "16px" : "0",
            gap: "8px",
          }}
        >
          <Box className="flex justify-between items-center">
            {coverTitle && (
              <h3 className="text-sm font-medium S2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1">
                {coverTitle}
              </h3>
            )}
            {!isViewer && (
              <Box className="flex items-center gap-1 ">
                <FaRegHeart /> <Box className="S4">{likeCount}</Box>
              </Box>
            )}
          </Box>

          <Box className="flex gap-2 items-center overflow-hidden min-w-0">
            <Box className="flex-shrink-0 S4">
              {genres.find((g) => g.value === coverGenre)?.title || "기타"}
            </Box>

            <Box className="w-[1px] h-4 bg-black flex-shrink-0" />

            {/* 태그 묶음 */}
            <Box
              className={`overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1 S4`}
              sx={{
                color: theme.palette.genre.primary,
              }}
            >
              {tags?.map((t) => (
                <span key={t} className="text-xs  mr-2">
                  #{t}
                </span>
              ))}
            </Box>
          </Box>
          {isViewer && (
            <Box className="flex items-center gap-1">
              <FaRegHeart />
              {likeCount}
            </Box>
          )}
        </Box>
      </Box>
    </Link>
  );
};

export default PostCard;
