"use client";
import { useState } from "react";
import { Box, Typography } from "@mui/material";

import PlaylistDetailPanel from "../../../components/PlaylistDetailPanel";
import { usePlaylistDetailQuery } from "@/app/api/mypage/playlist/playlist";
import {
  useDeletePlaylistItemMutation,
  useReorderPlaylistItemsMutation,
} from "@/app/api/mypage/playlist/playlistItem";
import { MoveDirection, PlaylistItem } from "../../../components/playlistTypes";
import { getMovedIndex } from "../../../components/playlistUtils";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { useSnackbarStore } from "@/app/store/useSnackbar";

const PlaylistDitailClient = ({ playlistId }: { playlistId: number }) => {
  const deletePlaylistItemMutation = useDeletePlaylistItemMutation();
  const reorderPlaylistItemsMutation = useReorderPlaylistItemsMutation();

  const {
    data: playlistDetailData,
    isLoading: isPlaylistDetailLoading,
    error: playlistDetailError,
  } = usePlaylistDetailQuery(playlistId ?? null);

  const deletePlaylistItem = async (itemId: number) => {
    if (!playlistId) return;
    await deletePlaylistItemMutation.mutateAsync({
      playlistId: playlistId,
      coverId: itemId,
    });
  };

  const handlePlaylistItemDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !playlistId) return;

    const items: PlaylistItem[] = playlistDetailData?.data?.items ?? [];

    const oldIndex = items.findIndex(
      (item) => item.itemId === Number(active.id),
    );

    const newIndex = items.findIndex((item) => item.itemId === Number(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedItems: PlaylistItem[] = arrayMove<PlaylistItem>(
      items,
      oldIndex,
      newIndex,
    );

    const itemIds = reorderedItems.map((item) => item.itemId);
    const result = await reorderPlaylistItemsMutation.mutateAsync({
      playlistId: playlistId,
      orderedItemIds: itemIds,
    });

    if (result.success) {
      useSnackbarStore
        .getState()
        .show("플레이리스트 순서가 변경되었습니다.", "success");
    } else {
      useSnackbarStore
        .getState()
        .show("플레이리스트 순서 변경에 실패했습니다.", "error");
    }
  };
  return (
    <Box>
      <Box className="flex items-center justify-between">
        <Typography>{playlistDetailData?.data?.name}</Typography>
      </Box>

      {playlistDetailData && !isPlaylistDetailLoading && (
        <PlaylistDetailPanel
          selectedPlaylistName={playlistDetailData.data.name}
          selectedPlaylistId={playlistId}
          selectedPlaylistItems={playlistDetailData.data.items || []}
          onDeleteItem={deletePlaylistItem}
          onDragEnd={handlePlaylistItemDragEnd}
        />
      )}
    </Box>
  );
};

export default PlaylistDitailClient;
