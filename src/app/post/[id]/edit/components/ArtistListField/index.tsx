import {
  Box,
  Typography,
  Button,
  alpha,
  TextField,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import React, { useRef, useEffect } from "react";
import { SongData } from "../../../../components/ItemEditor/type";
import ArtistProfile from "../../../../components/ArtistProfile";
import { useSpotifySearchQuery } from "@/app/hook/useSpotifySearchQuery";
import theme from "@/app/lib/theme";
import PostBasicButton from "@/components/PostBasicButton";
import { useSearchQuery } from "@/app/api/spotify/search";
import { useAuthStore } from "@/app/store/useAuthStore";
import { is } from "zod/v4/locales";

const ArtistListField = ({
  searchsongTitle,
  selectedSongData,
  setSelectedSongData,
  isSongSearchFocus,
  isManualInput,
  toggleInputMode,
  songTitleManualChangeHandler,
  onComplete,
}: {
  searchsongTitle: string;
  selectedSongData: SongData;
  setSelectedSongData: (
    songData: SongData & { title: string; itunesTrackId: string },
  ) => void;
  isSongSearchFocus: boolean;
  isManualInput: boolean;
  toggleInputMode: () => void;
  songTitleManualChangeHandler: (songTitle: string, artist: string) => void;
  onComplete: () => void;
}) => {
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  //   useSpotifySearchQuery(searchsongTitle);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data, isLoading } = useSearchQuery(searchsongTitle);
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
  // const allSongs = data?.pages.flatMap((page: any) => page.songs) || [];

  const [songTitle, setsongTitle] = React.useState("");
  const [artist, setArtist] = React.useState("");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  React.useEffect(() => {
    songTitleManualChangeHandler(songTitle, artist);
  }, [songTitle, artist]);
  const toggleInputHandler = () => {
    setArtist("");
    setsongTitle("");
    toggleInputMode();
  };
  // if (!searchsongTitle.trim()) return null;
  if (!isSongSearchFocus) return null;

  const manualStyle = {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.gray.secondary,
      borderRadius: "10px",
      border: "none",
      "& .MuiInputBase-input": {
        padding: "10px",
        fontSize: "20px",
        fontWeight: 400,
      },
    },
  };

  return (
    <Box sx={{ backgroundColor: "#F2F2F2", borderRadius: "15px" }}>
      <Box
        sx={{
          position: "relative",
          maxHeight: "320px",
          overflowY: "auto",
        }}
        className="flex flex-col gap-2  p-2"
      >
        {!isManualInput || data?.length > 0 ? (
          data?.map((song: any, index: any) => {
            const isLast = index === data?.length - 1;

            return (
              <Box
                // ref={isLast ? lastSongRef : null}
                key={`${song.itunesTrackId}-${index}`}
                onClick={() => setSelectedSongData(song)}
                className="cursor-pointer"
              >
                <ArtistProfile
                  coverArtist={song.artist}
                  songTitle={song.title}
                  coverUrl={song.coverUrl}
                  isSearch
                />
              </Box>
            );
          })
        ) : (
          <Box className="flex flex-col justify-center w-[95%] m-auto h-[230px] gap-5">
            <Box className="w-full mb-2">
              <Typography fontSize={16} fontWeight={"bold"}>
                원곡 제목
              </Typography>
              <TextField
                placeholder="원곡 제목"
                variant="outlined"
                slotProps={{ htmlInput: { className: "B1" } }}
                sx={manualStyle}
                value={songTitle}
                onChange={(e) => setsongTitle(e.target.value)}
              />
            </Box>
            <Box className="w-full mb-2">
              <Typography fontSize={16} fontWeight={"bold"}>
                원곡 가수
              </Typography>
              <TextField
                placeholder="원곡 가수"
                variant="outlined"
                slotProps={{ htmlInput: { className: "B1" } }}
                sx={manualStyle}
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </Box>
          </Box>
        )}

        {!isManualInput && (
          <Box
            className="flex items-center justify-center B1"
            sx={{
              height: "310px",
              borderRadius: "15px",
              border: "none",
            }}
          >
            {searchsongTitle === "" ? (
              "커버곡의 원곡 정보를 검색해주세요"
            ) : isLoading ? (
              <Box
                className="mt-8"
                sx={{
                  minHeight: "60vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress
                  size={40}
                  sx={{ color: theme.palette.orange.primary }}
                />
              </Box>
            ) : data?.length === 0 ? (
              `"${searchsongTitle}" 의 검색 결과가 없습니다.`
            ) : (
              ""
            )}
          </Box>
        )}
      </Box>

      <React.Fragment>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "-70px",
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
        {isManualInput && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              paddingRight: 1,
              marginBottom: "26px",
            }}
          >
            <PostBasicButton
              backgroundColor={theme.palette.gray.primary}
              color={theme.palette.common.white}
              hoverBGColor={theme.palette.gray.fourth}
              hoverColor={theme.palette.common.white}
              onClick={onComplete}
              postClass="H3"
              postRadius="40px"
            >
              원곡정보 입력완료
            </PostBasicButton>
          </Box>
        )}
        <Box className="flex justify-between " sx={{ height: 70 }}>
          <Box className="flex items-center flex-1 justify-center">
            <Box
              className="B1"
              sx={{
                color: theme.palette.gray.primary,
                textAlign: "center",
              }}
            >
              {isManualInput ? (
                isMobile ? (
                  <>
                    원곡을 검색하고 싶다면
                    <br />
                    돌아가기를 눌러주세요.
                  </>
                ) : (
                  "원곡을 검색하고 싶다면 돌아가기를 눌러주세요."
                )
              ) : isMobile ? (
                <>
                  원곡 정보를 찾지 못했다면
                  <br />
                  직접 입력해주세요.
                </>
              ) : (
                "원곡 정보를 찾지 못했다면 직접 입력해주세요."
              )}
            </Box>
          </Box>

          <Box
            sx={{ mb: 1, mr: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            <PostBasicButton
              backgroundColor={theme.palette.common.black}
              color={theme.palette.common.white}
              hoverBGColor={theme.palette.gray.secondary}
              hoverColor={theme.palette.common.black}
              onClick={toggleInputHandler}
              postClass="B1"
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
