"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  useMyPlaylistQuery,
  useCreatePlaylistMutation,
} from "@/app/api/mypage/playlist/playlist";
import { useCreatePlaylistItemMutation } from "@/app/api/mypage/playlist/playlistItem";

import { Playlist } from "@/app/mypage/playlist/components/playlistTypes";
import CreatePlaylistButton from "@/components/playlist/CreatePlaylistButton";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useModalStore } from "@/app/store/useModalStore";
import { number } from "zod";

interface AddPlaylistButtonProps {
  postId: number;
}

const AddPlaylistButton = ({ postId }: AddPlaylistButtonProps) => {
  const { data, isLoading, isError } = useMyPlaylistQuery();
  const createPlaylistItemMutation = useCreatePlaylistItemMutation();
  const createPlaylistMutation = useCreatePlaylistMutation();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = useAuthStore((state) => state.isLogin);
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  const isMenuOpen = Boolean(menuAnchor);
  const playlists = data?.data ?? [];

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleSelectPlaylist = async (playlistId: number, coverId: number) => {
    if (!isLogin && !accessToken) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 플레이리스트에 곡을 추가할 수 있습니다.", "error");

      return;
    }
    const result = await createPlaylistItemMutation.mutateAsync({
      playlistId,
      coverId,
    });

    if (result.success) {
      useSnackbarStore
        .getState()
        .show("플레이리스트가 성공적으로 생성되었습니다.", "success");
    } else {
      useSnackbarStore
        .getState()
        .show("플레이리스트 생성에 실패했습니다.", "error");
    }

    // 여기서 나중에 곡 추가 API 실행
    // createPlaylistItemMutation.mutate({ playlistId, coverId });

    handleCloseMenu();
  };

  const handleCreatePlaylist = async (name: string) => {
    if (!isLogin && !accessToken) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 플레이리스트를 생성할 수 있습니다.", "error");

      return;
    }
    const result = await createPlaylistMutation.mutateAsync(name);

    if (result.success) {
      useSnackbarStore
        .getState()
        .show("플레이리스트가 성공적으로 생성되었습니다.", "success");
    } else {
      useSnackbarStore
        .getState()
        .show("플레이리스트 생성에 실패했습니다.", "error");
    }

    // handleCloseMenu();
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Button variant="contained" onClick={handleOpenMenu}>
        플레이리스트 추가
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

            {!isLoading && !isError && playlists.length === 0 && (
              <MenuItem disabled>
                <Typography fontSize={14}>플레이리스트가 없습니다.</Typography>
              </MenuItem>
            )}

            {!isLoading &&
              !isError &&
              playlists.map((playlist: Playlist) => (
                <MenuItem
                  key={playlist.playlistId}
                  onClick={() =>
                    handleSelectPlaylist(playlist.playlistId, postId)
                  }
                >
                  {playlist.name}
                </MenuItem>
              ))}
          </Box>

          <Divider />

          <Box
            sx={{
              p: "8px",
              bgcolor: "#fff",
            }}
          >
            <CreatePlaylistButton
              buttonText="플레이리스트 생성"
              onCreate={handleCreatePlaylist}
            />
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

export default AddPlaylistButton;
