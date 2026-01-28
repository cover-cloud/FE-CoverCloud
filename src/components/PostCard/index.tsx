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
import { getYoutubeVideoId } from "../../app/utils/youtube";
import { useTheme } from "@mui/material/styles";

const DEFAULT_IMAGE = "https://via.placeholder.com/150";

const PostCard: React.FC<contentData & { isViewer?: boolean }> = ({
  coverArtist,
  coverGenre,
  coverId,
  coverTitle,
  createdAt,
  likeIncrement,
  link,
  musicId,
  tags,
  userId,
  viewCount,
  isViewer,
}) => {
  const videoId = getYoutubeVideoId(link);
  const imgSrc = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : DEFAULT_IMAGE;

  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(imgSrc);
  React.useEffect(() => {
    setImageSrc(imgSrc);
    setLoading(true);
  }, [imgSrc]);
  return (
    <Link href={`/post/${coverId}/view`}>
      <Box
        className={` ${isViewer ? "flex" : "flex-col"}`}
        sx={{
          padding: "12px 8px 14px 8px",
          borderRadius: "12px",
          "&:hover": {
            backgroundColor: theme.palette.gray.tertiary,
          },
        }}
      >
        <Box
          className={`relative flex-shrink-0 ${
            isViewer ? "w-[148px] h-[107px]" : "w-full h-40"
          }`}
          sx={{ zIndex: 10 }}
        >
          {loading && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              style={{ position: "absolute", inset: 0 }}
            />
          )}

          <Image
            src={imageSrc}
            alt={coverTitle || "Post Image"}
            fill
            sizes={isViewer ? "148px" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover"
            loading="eager"
            onLoad={() => setLoading(false)}
            onError={() => {
              setImageSrc(DEFAULT_IMAGE);
              setLoading(false);
            }}
          />
        </Box>

        <Box
          className="flex flex-col flex-1 min-w-0"
          sx={{
            marginLeft: isViewer ? "16px" : "0",
          }}
        >
          <Box className="flex justify-between items-center">
            {coverTitle && (
              <h3 className="text-sm font-medium">{coverTitle}</h3>
            )}
            {!isViewer && (
              <Box className="flex items-center gap-1">
                <FaRegHeart /> {likeIncrement}
              </Box>
            )}
          </Box>

          <Box className="flex gap-2 items-center overflow-hidden min-w-0">
            <Box className="flex-shrink-0">{coverGenre}</Box>

            <Box className="w-[1px] h-4 bg-black flex-shrink-0" />

            {/* 태그 묶음 */}
            <Box
              className={`overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1`}
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
              {likeIncrement}
            </Box>
          )}
        </Box>
      </Box>
    </Link>
  );
};

export default PostCard;
