import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { ArtistProfileProps } from "./type";

const ArtistProfile = ({
  coverArtist,
  songName,
  albumImage,
}: ArtistProfileProps) => {
  return (
    <Box className="flex gap-2">
      <Box className="relative w-12 h-12 flex-shrink-0">
        <Image
          src={albumImage}
          alt={coverArtist}
          fill
          sizes="(max-width: 768px) 48px, 52px"
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
      </Box>
      <Box className="flex flex-col gap-1">
        <Typography>{songName}</Typography>
        <Typography>{coverArtist}</Typography>
      </Box>
    </Box>
  );
};

export default ArtistProfile;
