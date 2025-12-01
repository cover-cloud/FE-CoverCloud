import { Box } from "@mui/material";
import React, { useRef, useEffect } from "react";
import { SongData } from "../ItemEditor/type";
import ArtistProfile from "../ArtistProfile";
import { useSpotifySearchQuery } from "@/app/hook/useSpotifySearchQuery";

const SelectArtistForm = ({
  searchSongName,
  selectedSongData,
  setSelectedSongData,
}: {
  searchSongName: string;
  selectedSongData: SongData | null;
  setSelectedSongData: (songData: SongData | null) => void;
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSpotifySearchQuery(searchSongName);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastSongRef = (node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  };

  // 모든 페이지의 songs를 flat하게 합치기
  const allSongs = data?.pages.flatMap((page: any) => page.songs) || [];

  if (!searchSongName.trim()) return null;

  return (
    <Box className="mt-3">
      <h3 className="mb-2">아티스트 선택</h3>
      <Box className="max-h-[270px] overflow-y-auto flex flex-col gap-2 border rounded p-2">
        {isLoading && <p className="text-center py-2">검색 중...</p>}

        {allSongs.map((song: any, index: any) => {
          const isLast = index === allSongs.length - 1;

          return (
            <Box
              ref={isLast ? lastSongRef : null}
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
        })}

        {isFetchingNextPage && <p className="text-center py-2">로딩 중...</p>}

        {!hasNextPage && allSongs.length > 0 && (
          <p className="text-center py-2 text-gray-500">
            더 이상 결과가 없습니다
          </p>
        )}

        {allSongs.length === 0 && !isLoading && (
          <p className="text-center py-2 text-gray-500">검색 결과가 없습니다</p>
        )}
      </Box>
    </Box>
  );
};

export default SelectArtistForm;
