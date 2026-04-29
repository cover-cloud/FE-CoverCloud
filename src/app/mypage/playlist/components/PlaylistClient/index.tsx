"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import CreatePlaylistButton, {
  CreatePlaylistPayload,
} from "@/components/playlist/CreatePlaylistButton";
import PlaylistListPanel from "../PlaylistListPanel";
import PlaylistDetailPanel from "../PlaylistDetailPanel";
import { getMovedIndex } from "../playlistUtils";
import { MoveDirection, Playlist, PlaylistItem } from "../playlistTypes";

const PlaylistClient = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistItemsById, setPlaylistItemsById] = useState<
    Record<number, PlaylistItem[]>
  >({});
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null,
  );

  const selectedPlaylist = playlists.find(
    (playlist) => playlist.id === selectedPlaylistId,
  );
  const selectedPlaylistItems = selectedPlaylistId
    ? (playlistItemsById[selectedPlaylistId] ?? [])
    : [];

  const createPlaylist = async (payload: CreatePlaylistPayload) => {
    const now = Date.now();

    const newPlaylist: Playlist = {
      id: now,
      title: payload.title,
      description: payload.description,
    };

    setPlaylists((prev) => [newPlaylist, ...prev]);
    setPlaylistItemsById((prev) => ({
      ...prev,
      [newPlaylist.id]: [
        {
          id: now + 1,
          title: "테스트 곡 1",
          artist: "아티스트 1",
        },
        {
          id: now + 2,
          title: "테스트 곡 2",
          artist: "아티스트 2",
        },
      ],
    }));
    setSelectedPlaylistId(newPlaylist.id);
  };

  const deletePlaylist = (playlistId: number) => {
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId),
    );
    setPlaylistItemsById((prev) => {
      const next = { ...prev };
      delete next[playlistId];
      return next;
    });
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
    }
  };

  const movePlaylist = (playlistId: number, direction: MoveDirection) => {
    setPlaylists((prev) => {
      const currentIndex = prev.findIndex(
        (playlist) => playlist.id === playlistId,
      );

      if (currentIndex === -1) return prev;

      const targetIndex = getMovedIndex(prev, currentIndex, direction);

      if (
        targetIndex < 0 ||
        targetIndex >= prev.length ||
        targetIndex === currentIndex
      ) {
        return prev;
      }

      return arrayMove(prev, currentIndex, targetIndex);
    });
  };

  const deletePlaylistItem = (itemId: number) => {
    if (!selectedPlaylistId) return;

    setPlaylistItemsById((prev) => ({
      ...prev,
      [selectedPlaylistId]: (prev[selectedPlaylistId] ?? []).filter(
        (item) => item.id !== itemId,
      ),
    }));
  };

  const movePlaylistItem = (itemId: number, direction: MoveDirection) => {
    if (!selectedPlaylistId) return;

    setPlaylistItemsById((prev) => {
      const items = prev[selectedPlaylistId] ?? [];
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
        [selectedPlaylistId]: arrayMove(items, currentIndex, targetIndex),
      };
    });
  };

  const handlePlaylistDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setPlaylists((prev) => {
      const oldIndex = prev.findIndex((playlist) => playlist.id === active.id);
      const newIndex = prev.findIndex((playlist) => playlist.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handlePlaylistItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !selectedPlaylistId) return;

    setPlaylistItemsById((prev) => {
      const items = prev[selectedPlaylistId] ?? [];
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;

      return {
        ...prev,
        [selectedPlaylistId]: arrayMove(items, oldIndex, newIndex),
      };
    });
  };

  return (
    <Box>
      <CreatePlaylistButton onCreate={createPlaylist} />

      <Box className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[420px_1fr]">
        <PlaylistListPanel
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          playlistItemsById={playlistItemsById}
          onSelect={setSelectedPlaylistId}
          onDelete={deletePlaylist}
          onMove={movePlaylist}
          onDragEnd={handlePlaylistDragEnd}
        />

        <PlaylistDetailPanel
          selectedPlaylist={selectedPlaylist}
          selectedPlaylistItems={selectedPlaylistItems}
          onDeleteItem={deletePlaylistItem}
          onMoveItem={movePlaylistItem}
          onDragEnd={handlePlaylistItemDragEnd}
        />
      </Box>
    </Box>
  );
};

export default PlaylistClient;
