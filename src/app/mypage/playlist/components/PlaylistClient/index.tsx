"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import CreatePlaylistButton, {
  CreatePlaylistPayload,
} from "@/components/playlist/CreatePlaylistButton";
import PlaylistListPanel from "../PlaylistListPanel";
import PlaylistDetailPanel from "../PlaylistDetailPanel";
import { getMovedIndex } from "../playlistUtils";
import { MoveDirection, PlaylistItem } from "../playlistTypes";
import {
  useCreatePlaylistMutation,
  useMyPlaylistQuery,
  useDeletePlaylistMutation,
  usePatchPlaylistMutation,
  usePlaylistDetailQuery,
} from "@/app/api/mypage/playlist/playlist";
import { useCreatePlaylistItemMutation } from "@/app/api/mypage/playlist/playlistItem";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useSnackbarStore } from "@/app/store/useSnackbar";
import { useModalStore } from "@/app/store/useModalStore";
import Modal from "@/components/modal/Modal";
import PlaylistOptionButton from "@/components/PlaylistOptionButton";
import { is } from "zod/v4/locales";

const PlaylistClient = () => {
  const createPlaylistMutation = useCreatePlaylistMutation();
  const deletePlaylistMutation = useDeletePlaylistMutation();
  const patchPlaylistMutation = usePatchPlaylistMutation();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLogin = useAuthStore((state) => state.isLogin);
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  const [playlistItemsById, setPlaylistItemsById] = useState<
    Record<number, PlaylistItem[]>
  >({});

  const [selectedPlaylist, setSelectedPlaylist] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [editPlaylistName, setEditPlaylistName] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading, isError } = useMyPlaylistQuery();
  const {
    data: playlistDetailData,
    isLoading: isPlaylistDetailLoading,
    error: playlistDetailError,
  } = usePlaylistDetailQuery(selectedPlaylist?.id ?? null);
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
  };

  const handleDeleteSelectedPlaylist = () => {
    if (!selectedPlaylist) return;

    deletePlaylist(selectedPlaylist.id);
  };

  const deletePlaylist = async (playlistId: number) => {
    if (!isLogin && !accessToken) {
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

    if (!isLogin && !accessToken) {
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

  const deletePlaylistItem = (itemId: number) => {
    if (!selectedPlaylist) return;

    setPlaylistItemsById((prev) => ({
      ...prev,
      [selectedPlaylist.id]: (prev[selectedPlaylist.id] ?? []).filter(
        (item) => item.id !== itemId,
      ),
    }));
  };

  const movePlaylistItem = (itemId: number, direction: MoveDirection) => {
    if (!selectedPlaylist) return;

    setPlaylistItemsById((prev) => {
      const items = prev[selectedPlaylist.id] ?? [];
      const currentIndex = items.findIndex((item) => item.id === itemId);

      if (currentIndex === -1) return prev;

      const targetIndex = getMovedIndex(items, currentIndex, direction);

      if (
        targetIndex < 0 ||
        targetIndex >= items.length ||
        targetIndex === currentIndex
      ) {
        return prev;
      }

      return {
        ...prev,
        [selectedPlaylist.id]: arrayMove(items, currentIndex, targetIndex),
      };
    });
  };

  const handlePlaylistItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !selectedPlaylist) return;

    setPlaylistItemsById((prev) => {
      const items = prev[selectedPlaylist.id] ?? [];
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;

      return {
        ...prev,
        [selectedPlaylist.id]: arrayMove(items, oldIndex, newIndex),
      };
    });
  };

  return (
    <Box>
      <CreatePlaylistButton onCreate={createNewPlaylistHandler} />

      <Box className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[420px_1fr]">
        <PlaylistListPanel
          playlists={data?.data || []}
          selectedPlaylist={selectedPlaylist?.id ?? null}
          playlistItemsById={playlistItemsById}
          onSelect={selectedPlaylistHandler}
        />

        {selectedPlaylist && (
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
                selectedPlaylistItems={playlistDetailData.data.items || []}
                onDeleteItem={deletePlaylistItem}
                onMoveItem={movePlaylistItem}
                onDragEnd={handlePlaylistItemDragEnd}
              />
            )}
          </Box>
        )}
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
