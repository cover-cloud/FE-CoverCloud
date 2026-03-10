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
  songTitle,
  isSongSearchFocus,
  toggleInputMode,
  isManualInput = false,
  songTitleManualChangeHandler,
  onClickOutside,
}: {
  selectedSongData: SongData;
  selectSongHandler: (
    songData: SongData & { title: string; itunesTrackId: string },
  ) => void;
  songTitle: string;
  isSongSearchFocus: boolean;
  toggleInputMode: () => void;
  isManualInput: boolean;
  songTitleManualChangeHandler: (songTitle: string, artist: string) => void;
  onClickOutside: () => void;
}) => {
  // const containerRef = React.useRef<HTMLDivElement>(null);

  // React.useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       containerRef.current &&
  //       !containerRef.current.contains(event.target as Node)
  //     ) {
  //       onClickOutside(); // 박스 밖 클릭 시 함수 실행
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [onClickOutside]);

  return (
    <Box>
      {selectedSongData &&
        (selectedSongData.artist !== "" ||
          selectedSongData.songTitle !== "") && (
          <Box className="mt-6">
            <ArtistProfile
              coverArtist={selectedSongData.artist}
              songTitle={selectedSongData.songTitle}
              coverUrl={selectedSongData.coverUrl}
              isSearch
            />
          </Box>
        )}
      <Box
        tabIndex={-1}
        className="absolute top-[70px] bg-white w-full z-10 max-h-[260px]"
        sx={{
          backgroundColor: theme.palette.gray.tertiary,
          borderRadius: "15px",
        }}
      >
        <ArtistListField
          searchsongTitle={songTitle}
          selectedSongData={selectedSongData}
          setSelectedSongData={selectSongHandler}
          isSongSearchFocus={isSongSearchFocus}
          toggleInputMode={toggleInputMode}
          isManualInput={isManualInput}
          songTitleManualChangeHandler={songTitleManualChangeHandler}
        />
      </Box>
    </Box>
  );
};

export default SearchSong;
