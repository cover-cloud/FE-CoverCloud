"use client";
import React from "react";
import Image from "next/image";
import { ArtistProfileProps } from "./type";
import { Box, Typography, Skeleton } from "@mui/material";

const ArtistProfile = ({
  coverArtist,
  songName,
  albumImage,
}: ArtistProfileProps) => {
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  console.log(albumImage);
  return (
    <Box className="flex gap-2">
      <Box className="relative w-12 h-12 flex-shrink-0">
        {isImageLoading || !albumImage ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            className="absolute inset-0"
          />
        ) : (
          <Image
            src={albumImage}
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
        <Typography>{songName}</Typography>
        <Typography>{coverArtist}</Typography>
      </Box>
    </Box>
  );
};

export default ArtistProfile;
