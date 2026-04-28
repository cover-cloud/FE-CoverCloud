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
import { MoveDirection, Playlist } from "../playlistTypes";

const PlaylistClient = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null,
  );

  const selectedPlaylist = playlists.find(
    (playlist) => playlist.id === selectedPlaylistId,
  );

  const createPlaylist = async (payload: CreatePlaylistPayload) => {
    const now = Date.now();

    const newPlaylist: Playlist = {
      id: now,
      title: payload.title,
      description: payload.description,
      items: [
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
    };

    setPlaylists((prev) => [newPlaylist, ...prev]);
    setSelectedPlaylistId(newPlaylist.id);
  };

  const deletePlaylist = (playlistId: number) => {
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId),
    );

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

    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== selectedPlaylistId) return playlist;

        return {
          ...playlist,
          items: playlist.items.filter((item) => item.id !== itemId),
        };
      }),
    );
  };

  const movePlaylistItem = (itemId: number, direction: MoveDirection) => {
    if (!selectedPlaylistId) return;

    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== selectedPlaylistId) return playlist;

        const currentIndex = playlist.items.findIndex(
          (item) => item.id === itemId,
        );

        if (currentIndex === -1) return playlist;

        const targetIndex = getMovedIndex(
          playlist.items,
          currentIndex,
          direction,
        );

        if (
          targetIndex < 0 ||
          targetIndex >= playlist.items.length ||
          targetIndex === currentIndex
        ) {
          return playlist;
        }

        return {
          ...playlist,
          items: arrayMove(playlist.items, currentIndex, targetIndex),
        };
      }),
    );
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

    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== selectedPlaylistId) return playlist;

        const oldIndex = playlist.items.findIndex(
          (item) => item.id === active.id,
        );
        const newIndex = playlist.items.findIndex(
          (item) => item.id === over.id,
        );

        if (oldIndex === -1 || newIndex === -1) return playlist;

        return {
          ...playlist,
          items: arrayMove(playlist.items, oldIndex, newIndex),
        };
      }),
    );
  };

  return (
    <Box>
      <CreatePlaylistButton onCreate={createPlaylist} />

      <Box className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[420px_1fr]">
        <PlaylistListPanel
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          onSelect={setSelectedPlaylistId}
          onDelete={deletePlaylist}
          onMove={movePlaylist}
          onDragEnd={handlePlaylistDragEnd}
        />

        <PlaylistDetailPanel
          selectedPlaylist={selectedPlaylist}
          onDeleteItem={deletePlaylistItem}
          onMoveItem={movePlaylistItem}
          onDragEnd={handlePlaylistItemDragEnd}
        />
      </Box>
    </Box>
  );
};

export default PlaylistClient;
