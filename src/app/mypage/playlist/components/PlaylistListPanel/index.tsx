"use client";

import { Box, Typography } from "@mui/material";
import SortablePlaylistCard from "../SortablePlaylistCard";
import { Playlist, PlaylistItem } from "../playlistTypes";

type PlaylistListPanelProps = {
  playlists: Playlist[];
  selectedPlaylist: number | null;
  playlistItemsById: Record<number, PlaylistItem[]>;
  onSelect: (playlistId: number, playlistName: string) => void;
  // onDelete: (playlistId: number, playlistName: string) => void;
};

const PlaylistListPanel = ({
  playlists,
  selectedPlaylist,
  playlistItemsById,
  onSelect,
  // onDelete,
}: PlaylistListPanelProps) => {
  return (
    <Box component="section" className="rounded-xl border p-4">
      <Typography className="mb-4 text-lg font-semibold">재생리스트</Typography>

      <Box className="max-h-[60vh] overflow-y-auto pr-1 md:max-h-[520px]">
        {playlists.length === 0 ? (
          <Typography className="text-sm text-gray-500">
            아직 만든 재생리스트가 없습니다.
          </Typography>
        ) : (
          <Box className="flex flex-col gap-3">
            {playlists.map((playlist) => (
              <SortablePlaylistCard
                key={playlist.playlistId}
                playlist={playlist}
                itemCount={playlist.itemCount}
                isSelected={playlist.playlistId === selectedPlaylist}
                onClick={() => onSelect(playlist.playlistId, playlist.name)}
                // onDelete={() => onDelete(playlist.playlistId, playlist.name)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PlaylistListPanel;
