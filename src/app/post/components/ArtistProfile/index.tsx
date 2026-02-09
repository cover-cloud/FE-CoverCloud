"use client";
import React from "react";
import Image from "next/image";
import { ArtistProfileProps } from "./type";
import { Box, Typography, Skeleton } from "@mui/material";
import theme from "@/app/lib/theme";

const ArtistProfile = ({
  coverArtist,
  songTitle,
  coverUrl,
}: ArtistProfileProps) => {
  const [isImageLoading, setIsImageLoading] = React.useState(false);

  return (
    <Box className="flex gap-4">
      <Box className="relative w-12 h-12 flex-shrink-0">
        {isImageLoading || !coverUrl ? (
          // <Skeleton
          //   variant="rectangular"
          //   width="100%"
          //   height="100%"
          //   className="absolute inset-0"
          // />
          <img
            src={"/asset/image/defaultProfile.png"}
            alt="Default Profile"
            width={48}
            height={48}
          />
        ) : (
          <Image
            src={coverUrl}
            alt={coverArtist}
            fill
            sizes="(max-width: 768px) 48px, 52px"
            style={{ objectFit: "cover", borderRadius: 4 }}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(true)}
          />
        )}
      </Box>
      <Box className="flex flex-col gap-1">
        <Box className="C1">{songTitle}</Box>
        <Box className="C3" color={theme.palette.gray.primary}>
          {coverArtist}
        </Box>
      </Box>
    </Box>
  );
};

export default ArtistProfile;
