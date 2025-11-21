"use client";

import React, { useState } from "react";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import "./PostCard.module.css";
import Box from "@mui/material/Box";

interface PostCardProps {
  imageSrc?: string;
  title?: string;
  likes?: number;
  date?: string;
  genres?: string;
  tag?: string[];
}

const DEFAULT_IMAGE = "https://via.placeholder.com/150";

const PostCard: React.FC<PostCardProps> = ({
  imageSrc = DEFAULT_IMAGE,
  title,
  likes,
  date,
  tag,
  genres,
}) => {
  const [loading, setLoading] = useState(true);

  // 빈 문자열 체크 추가
  const imgSrc = imageSrc && imageSrc.trim() !== "" ? imageSrc : DEFAULT_IMAGE;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full h-40">
        {loading && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        )}
        <Image
          src={imgSrc}
          alt={title || "Post Image"}
          fill
          className={`object-cover ${loading ? "hidden" : ""}`}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <Box className="flex justify-between items-center">
        {title && <h3 className="text-sm font-medium">{title}</h3>}
        {likes !== undefined && (
          <p className="text-xs text-gray-500">👍 {likes}</p>
        )}
        {/* {date && <p className="text-xs text-gray-400">{date}</p>} */}
      </Box>
      <Box className="flex gap-2 items-center overflow-hidden min-w-0">
        <Box className="flex-shrink-0">{genres}</Box>

        <Box className="w-[1px] h-4 bg-black flex-shrink-0" />

        {/* 태그 묶음 */}
        <Box className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1">
          {tag?.map((t) => (
            <span key={t} className="text-xs text-black mr-2 underline">
              #{t}
            </span>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default PostCard;
