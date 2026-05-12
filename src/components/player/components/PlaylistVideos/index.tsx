"use client";

import React from "react";
import { Box, Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import PostCard from "@/components/PostCard";
import {
  Playlist,
  PlaylistItem,
} from "@/app/mypage/playlist/components/playlistTypes";
import { useMyPlaylistQuery } from "@/app/api/mypage/playlist/playlist";
import { useRouter } from "next/navigation";

const PlaylistVideos = ({
  isViewer,
  playlistId,
  data,
  isVideolistLoading,
}: {
  isViewer: boolean;
  playlistId: number;
  data: PlaylistItem[];
  isVideolistLoading: boolean;
}) => {
  const router = useRouter();
  const { data: playlists, isLoading, isError } = useMyPlaylistQuery();

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchor);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };
  const handleSelectPlaylist = (playlistId: number) => {
    router.push(`/mypage/playlist/${playlistId}/play`);
  };
  const currentPlaylistName = playlists?.data?.find(
    (playlist: Playlist) => playlist.playlistId === playlistId,
  )?.name;
  return (
    <Box>
      <Button variant="contained" onClick={handleOpenMenu}>
        {currentPlaylistName ?? "플레이리스트"}
      </Button>
      <Menu
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            width: 280,
            maxHeight: 360,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: 360,
          }}
        >
          <Box
            sx={{
              maxHeight: 280,
              overflowY: "auto",
            }}
          >
            {isLoading && (
              <MenuItem disabled>
                <Typography fontSize={14}>불러오는 중...</Typography>
              </MenuItem>
            )}

            {isError && (
              <MenuItem disabled>
                <Typography fontSize={14}>
                  목록을 불러오지 못했습니다.
                </Typography>
              </MenuItem>
            )}

            {!isLoading && playlists?.data?.length === 0 && (
              <MenuItem disabled>
                <Typography fontSize={14}>플레이리스트가 없습니다.</Typography>
              </MenuItem>
            )}

            {playlists?.data?.map((playlist: Playlist) => {
              const isCurrentPlaylist = playlist.playlistId === playlistId;

              return (
                <MenuItem
                  key={playlist.playlistId}
                  selected={isCurrentPlaylist}
                  disabled={isCurrentPlaylist}
                  onClick={() => {
                    if (isCurrentPlaylist) return;

                    handleSelectPlaylist(playlist.playlistId);
                    handleCloseMenu();
                  }}
                  sx={{
                    fontWeight: isCurrentPlaylist ? 700 : 400,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                >
                  <Box className="flex w-full items-center justify-between gap-2">
                    <Typography fontSize={14} noWrap>
                      {playlist.name}
                    </Typography>

                    {isCurrentPlaylist && (
                      <Typography
                        fontSize={12}
                        color="primary"
                        sx={{ flexShrink: 0 }}
                      >
                        재생 중
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
              );
            })}
          </Box>
        </Box>
      </Menu>
      <Grid container spacing={2}>
        {isVideolistLoading
          ? // 로딩 중일 때 보여줄 스켈레톤 (10개)
            Array.from(new Array(10)).map((_, idx) => (
              <Grid
                key={`skeleton-${idx}`}
                size={isViewer ? { xs: 12 } : { xs: 12, sm: 6, md: 4 }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4 mb-4">
                    <div className="w-32 h-20 bg-gray-200 animate-pulse rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </Grid>
            ))
          : data?.map((post: PlaylistItem, idx: number) => (
              <Grid
                key={idx}
                size={
                  isViewer
                    ? { xs: 12 } // 뷰어 모드 → 항상 한 줄
                    : { xs: 12, sm: 6, md: 4 } // 일반 모드
                }
              >
                <PostCard
                  isViewer
                  isPlaylistPlayer
                  playlistId={playlistId}
                  playlistItemId={post.itemId}
                  coverId={post.coverId}
                  coverTitle={post.coverTitle}
                  coverArtist={post.coverArtist}
                  coverGenre={post.coverGenre ?? ""}
                  createdAt={""}
                  likeCount={post.likeCount ?? 0}
                  link={post.link}
                  musicId={0}
                  tags={post.tags ?? []}
                  userId={0}
                  viewCount={post.viewCount ?? 0}
                  commentCount={0}
                />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

export default PlaylistVideos;
