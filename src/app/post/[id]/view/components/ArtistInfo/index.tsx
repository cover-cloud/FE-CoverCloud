import React from "react";
import { Box } from "@mui/material";
import ArtistProfile from "../../../../components/ArtistProfile";
import { ArtistProfileMobileProps } from "../../../../components/ArtistProfile/type";

const ArtistInfo = ({
  coverArtist = "아티스트",
  songName = "노래제목",
  albumImage = "",
  isMobile = false,
}: ArtistProfileMobileProps) => {
  const [isArtistInfoOpen, setIsArtistInfoOpen] = React.useState(false);
  const openArtistInfoHandler = () => {
    setIsArtistInfoOpen((prev) => !prev);
  };
  return (
    <section>
      {isMobile ? (
        <Box>
          <Box className="mt-3" onClick={openArtistInfoHandler}>
            원곡정보 보기
          </Box>
          <Box
            className={`
              overflow-hidden transition-all duration-300
              ${
                isArtistInfoOpen
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }
              border border-black
            `}
          >
            <ArtistProfile
              coverArtist={coverArtist}
              songName={songName}
              albumImage={albumImage}
            />
          </Box>
        </Box>
      ) : (
        <ArtistProfile
          coverArtist={coverArtist}
          songName={songName}
          albumImage={albumImage}
        />
      )}
    </section>
  );
};

export default ArtistInfo;
