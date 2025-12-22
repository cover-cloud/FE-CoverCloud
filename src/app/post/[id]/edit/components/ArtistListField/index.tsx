import { Box, Typography, Button, alpha, TextField } from "@mui/material";
import React, { useRef, useEffect } from "react";
import { SongData } from "../../../../components/ItemEditor/type";
import ArtistProfile from "../../../../components/ArtistProfile";
import { useSpotifySearchQuery } from "@/app/hook/useSpotifySearchQuery";
import theme from "@/app/lib/theme";
import PostBasicButton from "@/components/PostBasicButton";
import { useSearchQuery } from "@/app/api/spotify/search";

const ArtistListField = ({
  searchSongName,
  selectedSongData,
  setSelectedSongData,
  isSongSearchFocus,
  isManualInput,
  toggleInputMode,
  songNameManualChangeHandler,
}: {
  searchSongName: string;
  selectedSongData: SongData | null;
  setSelectedSongData: (songData: SongData | null) => void;
  isSongSearchFocus: boolean;
  isManualInput: boolean;
  toggleInputMode: () => void;
  songNameManualChangeHandler: (songName: string, artist: string) => void;
}) => {
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  //   useSpotifySearchQuery(searchSongName);

  const { data, isLoading } = useSearchQuery(searchSongName);
  const observer = useRef<IntersectionObserver | null>(null);

  // const lastSongRef = (node: HTMLDivElement | null) => {
  //   if (isFetchingNextPage) return;
  //   if (observer.current) observer.current.disconnect();

  //   observer.current = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting && hasNextPage) {
  //       fetchNextPage();
  //     }
  //   });

  //   if (node) observer.current.observe(node);
  // };

  // 모든 페이지의 songs를 flat하게 합치기
  const allSongs = data?.pages.flatMap((page: any) => page.songs) || [];

  const [songName, setSongName] = React.useState("");
  const [artist, setArtist] = React.useState("");

  React.useEffect(() => {
    songNameManualChangeHandler(songName, artist);
  }, [songName, artist]);

  // if (!searchSongName.trim()) return null;
  if (!isSongSearchFocus) return null;

  const manualStyle = {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.gray.secondary,
      borderRadius: "10px",
      border: "none",
      "& .MuiInputBase-input": {
        padding: "10px",
      },
    },
  };

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          maxHeight: "210px",
          overflowY: "auto",
        }}
        className="flex flex-col gap-2 rounded p-2"
      >
        {!isManualInput || allSongs.length > 0 ? (
          allSongs.map((song: any, index: any) => {
            const isLast = index === allSongs.length - 1;

            return (
              <Box
                // ref={isLast ? lastSongRef : null}
                key={song.key}
                onClick={() => setSelectedSongData(song)}
                className="cursor-pointer"
              >
                <ArtistProfile
                  coverArtist={song.artist}
                  songName={song.songName}
                  albumImage={song.albumImage}
                />
              </Box>
            );
          })
        ) : (
          <Box className="flex flex-col justify-center w-[80%] m-auto h-[210px]">
            <Box className="w-full mb-2">
              <Typography fontWeight={"bold"}>원곡 제목</Typography>
              <TextField
                placeholder="원곡 제목"
                variant="outlined"
                sx={manualStyle}
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
              />
            </Box>
            <Box className="w-full mb-2">
              <Typography fontWeight={"bold"}>원곡 가수</Typography>
              <TextField
                placeholder="원곡 가수"
                variant="outlined"
                sx={manualStyle}
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </Box>
          </Box>
        )}
        {/* 
        {isFetchingNextPage && <p className="text-center py-2">로딩 중...</p>} */}

        {/* {!hasNextPage && allSongs.length > 0 && (
          <p className="text-center py-2 text-gray-500">
            더 이상 결과가 없습니다
          </p>
        )} */}

        {allSongs.length === 0 && !isManualInput && (
          <Box
            className="flex items-center justify-center"
            sx={{
              height: "210px",
              borderRadius: "15px",
              border: "none",
            }}
          >
            <Typography>
              {isLoading ? "검색 중..." : "커버곡의 원곡 정보를 검색해주세요"}
            </Typography>
          </Box>
        )}
      </Box>

      <React.Fragment>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "40px",
            height: "30px",
            display: "flex",
            background: `linear-gradient(
                to top,
                ${theme.palette.gray.tertiary},
                ${theme.palette.gray.tertiary},
                ${alpha(theme.palette.gray.tertiary, 0)}
              )`,
            justifyContent: "center",
            alignItems: "flex-end",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <Box className="flex justify-between ">
          <Box className="flex items-center flex-1 justify-center">
            <Typography
              sx={{
                color: theme.palette.gray.primary,
                textAlign: "center",
              }}
            >
              {isManualInput
                ? "원곡을 검색하고 싶다면 돌아가기를 눌러주세요."
                : "원곡 정보를 찾지 못했다면 직접 입력해주세요."}
            </Typography>
          </Box>
          <Box sx={{ mb: 1, mr: 1 }}>
            <PostBasicButton
              backgroundColor={theme.palette.common.black}
              color={theme.palette.common.white}
              onClick={() => {
                toggleInputMode();
              }}
            >
              {isManualInput ? "돌아가기" : "직접입력"}
            </PostBasicButton>
          </Box>
        </Box>
      </React.Fragment>
    </Box>
  );
};

export default ArtistListField;
