"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import CreatePlaylistButton from "@/components/playlist/CreatePlaylistButton";
import PlaylistListPanel from "../PlaylistListPanel";
import { PlaylistItem } from "../playlistTypes";
import {
  useCreatePlaylistMutation,
  useMyPlaylistQuery,
  useDeletePlaylistMutation,
  usePatchPlaylistMutation,
} from "@/app/api/mypage/playlist/playlist";

import { useAuthStore } from "@/app/store/useAuthStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { useModalStore } from "@/app/store/useModalStore";
import Modal from "@/components/modal/Modal";

import AddIcon from "@mui/icons-material/Add";
import PlaylistOptionButton from "@/components/playlist/PlaylistOptionButton";

const PlaylistClient = () => {
  const createPlaylistMutation = useCreatePlaylistMutation();
  const deletePlaylistMutation = useDeletePlaylistMutation();
  const patchPlaylistMutation = usePatchPlaylistMutation();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = useAuthStore((state) => state.isLogin);
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  const [selectedPlaylist, setSelectedPlaylist] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [editPlaylistName, setEditPlaylistName] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading, isError } = useMyPlaylistQuery();

  //이름 변경이 같은지 확인
  const trimmedEditPlaylistName = editPlaylistName.trim();

  const isSamePlaylistName =
    selectedPlaylist?.name.trim() === trimmedEditPlaylistName;

  const isEditDisabled =
    !selectedPlaylist || !trimmedEditPlaylistName || isSamePlaylistName;

  const selectedPlaylistHandler = (
    playlistId: number,
    playlistName: string,
  ) => {
    setSelectedPlaylist({
      id: playlistId,
      name: playlistName,
    });

    setEditPlaylistName(playlistName);
  };

  const createNewPlaylistHandler = async (name: string) => {
    if (!isLogin || !accessToken) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 플레이리스트를 생성할 수 있습니다.", "error");

      return;
    }

    const result = await createPlaylistMutation.mutateAsync(name);
    console.log(result, "dd");
    if (result.success) {
      useSnackbarStore
        .getState()
        .show("플레이리스트가 성공적으로 생성되었습니다.", "success");
    } else {
      useSnackbarStore
        .getState()
        .show("플레이리스트 생성에 실패했습니다.", "error");
    }
  };

  const handleDeleteSelectedPlaylist = () => {
    if (!selectedPlaylist) return;

    deletePlaylist(selectedPlaylist.id);
  };

  const deletePlaylist = async (playlistId: number) => {
    if (!isLogin || !accessToken) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 플레이리스트를 삭제할 수 있습니다.", "error");

      return;
    }

    const result = await deletePlaylistMutation.mutateAsync(playlistId);

    if (result.success) {
      useSnackbarStore
        .getState()
        .show("플레이리스트가 성공적으로 삭제되었습니다.", "success");

      setSelectedPlaylist(null);
      setEditPlaylistName("");
      setIsDeleteModalOpen(false);
    } else {
      useSnackbarStore
        .getState()
        .show("플레이리스트 삭제에 실패했습니다.", "error");

      setIsDeleteModalOpen(false);
    }
  };

  const handleEditSelectedPlaylist = async () => {
    if (!selectedPlaylist) return;

    const nextName = editPlaylistName.trim();

    if (!nextName) return;

    if (selectedPlaylist.name.trim() === nextName) return;

    if (!isLogin || !accessToken) {
      openLoginModal();

      useSnackbarStore
        .getState()
        .show("로그인 후 플레이리스트를 수정할 수 있습니다.", "error");

      return;
    }

    const result = await patchPlaylistMutation.mutateAsync({
      playlistId: selectedPlaylist.id,
      name: nextName,
    });

    if (result.success) {
      useSnackbarStore
        .getState()
        .show("플레이리스트가 성공적으로 수정되었습니다.", "success");

      setSelectedPlaylist({
        id: selectedPlaylist.id,
        name: nextName,
      });

      setEditPlaylistName(nextName);
      setIsEditModalOpen(false);
    } else {
      useSnackbarStore
        .getState()
        .show("플레이리스트 수정에 실패했습니다.", "error");

      setIsEditModalOpen(false);
    }
  };

  return (
    <Box>
      <Box className="flex items-center justify-center">
        <Typography variant="h5">내 플레이리스트</Typography>
      </Box>

      <Box className="flex items-center justify-end">
        <CreatePlaylistButton
          onCreate={createNewPlaylistHandler}
          icon={<AddIcon fontSize="large" sx={{ mr: 1 }} />}
        />
      </Box>

      <Box className="mt-6 gap-6">
        <PlaylistListPanel
          playlists={data?.data || []}
          selectedPlaylist={selectedPlaylist?.id ?? null}
          onSelect={selectedPlaylistHandler}
          openDeleteModal={() => setIsDeleteModalOpen(true)}
          navigateToEdit={() => setIsEditModalOpen(true)}
        />

        <PlaylistOptionButton
          isLogin={true}
          openDeleteModal={() => setIsDeleteModalOpen(true)}
          navigateToEdit={() => setIsEditModalOpen(true)}
        />
        {/* {selectedPlaylist && (
          <Box>
            <Box className="flex items-center justify-between">
              <Typography>{selectedPlaylist.name}</Typography>

              <PlaylistOptionButton
                isLogin={true}
                openDeleteModal={() => setIsDeleteModalOpen(true)}
                navigateToEdit={() => setIsEditModalOpen(true)}
              />
            </Box>

            {playlistDetailData && !isPlaylistDetailLoading && (
              <PlaylistDetailPanel
                selectedPlaylistName={selectedPlaylist.name}
                selectedPlaylistId={selectedPlaylist.id}
                selectedPlaylistItems={playlistDetailData.data.items || []}
                onDeleteItem={deletePlaylistItem}
                onMoveItem={movePlaylistItem}
                onDragEnd={handlePlaylistItemDragEnd}
              />
            )}
          </Box>
        )} */}
      </Box>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box
          className="flex flex-col items-center"
          sx={{
            width: "100%",
            bgcolor: "#fff",
            borderRadius: "12px",
            p: "40px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: "8px" }}>
            플레이리스트 삭제
          </Typography>

          <Typography
            sx={{
              fontSize: "20px",
              color: "#666",
              mb: "24px",
            }}
          >
            삭제한 플레이리스트는 다시 복구할 수 없습니다.
            <br />
            정말 삭제하시겠습니까?
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>

            <Button
              variant="contained"
              color="error"
              disabled={!selectedPlaylist}
              onClick={handleDeleteSelectedPlaylist}
            >
              삭제
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box
          className="flex flex-col items-center"
          sx={{
            width: "100%",
            bgcolor: "#fff",
            borderRadius: "12px",
            p: "40px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: "8px" }}>
            플레이리스트 이름 변경
          </Typography>

          <Typography
            sx={{
              fontSize: "16px",
              color: "#666",
              mb: "24px",
              textAlign: "center",
            }}
          >
            변경할 플레이리스트 이름을 입력해주세요.
          </Typography>

          <TextField
            fullWidth
            value={editPlaylistName}
            onChange={(e) => setEditPlaylistName(e.target.value)}
            placeholder="플레이리스트 이름"
            sx={{
              mb: "24px",
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setIsEditModalOpen(false)}
            >
              취소
            </Button>

            <Button
              variant="contained"
              disabled={isEditDisabled}
              onClick={handleEditSelectedPlaylist}
            >
              변경
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PlaylistClient;
