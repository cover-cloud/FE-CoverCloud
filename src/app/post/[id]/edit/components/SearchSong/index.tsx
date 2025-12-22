"use client";
import React from "react";
import { Box } from "@mui/material";
import ArtistProfile from "@/app/post/components/ArtistProfile";
import ArtistListField from "../ArtistListField";
import { SongData } from "@/app/post/components/ItemEditor/type";
import theme from "@/app/lib/theme";

const SearchSong = ({
  selectedSongData,
  selectSongHandler,
  songName,
  isSongSearchFocus,
  toggleInputMode,
  isManualInput = false,
  songNameManualChangeHandler,
  onClickOutside,
}: {
  selectedSongData: SongData | null;
  selectSongHandler: (songData: SongData | null) => void;
  songName: string;
  isSongSearchFocus: boolean;
  toggleInputMode: () => void;
  isManualInput: boolean;
  songNameManualChangeHandler: (songName: string, artist: string) => void;
  onClickOutside: () => void;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClickOutside(); // 박스 밖 클릭 시 함수 실행
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  return (
    <Box ref={containerRef}>
      {selectedSongData && (
        <Box className="mt-6">
          <ArtistProfile
            coverArtist={selectedSongData.artist}
            songName={selectedSongData.songName}
            albumImage={selectedSongData.albumImage}
          />
        </Box>
      )}
      <Box
        className="absolute top-[100px] bg-white w-full z-10 max-h-[260px]"
        sx={{
          backgroundColor: theme.palette.gray.tertiary,
          borderRadius: "15px",
        }}
      >
        <ArtistListField
          searchSongName={songName}
          selectedSongData={selectedSongData}
          setSelectedSongData={selectSongHandler}
          isSongSearchFocus={isSongSearchFocus}
          toggleInputMode={toggleInputMode}
          isManualInput={isManualInput}
          songNameManualChangeHandler={songNameManualChangeHandler}
        />
      </Box>
    </Box>
  );
};

export default SearchSong;
