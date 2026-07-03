"use client";

import { Box, Typography } from "@mui/material";
import SortablePlaylistCard from "../SortablePlaylistCard";
import { Playlist, PlaylistItem } from "../playlistTypes";

type PlaylistListPanelProps = {
  playlists: Playlist[];
  selectedPlaylist: number | null;
  onSelect: (playlistId: number, playlistName: string) => void;
  // onDelete: (playlistId: number, playlistName: string) => void;
  openDeleteModal: () => void;
  navigateToEdit: () => void;
};

const PlaylistListPanel = ({
  playlists,
  selectedPlaylist,
  onSelect,
  // onDelete,
  openDeleteModal,
  navigateToEdit,
}: PlaylistListPanelProps) => {
  return (
    <Box component="section" className="rounded-xl border p-4">
      <Typography className="mb-4 text-lg font-semibold">재생리스트</Typography>

      <Box className="">
        {playlists.length === 0 ? (
          <Typography className="text-sm text-gray-500">
            아직 만든 재생리스트가 없습니다.
          </Typography>
        ) : (
          <Box className="grid grid-cols-3 gap-3">
            {playlists.map((playlist) => (
              <SortablePlaylistCard
                key={playlist.playlistId}
                playlist={playlist}
                onClick={() => onSelect(playlist.playlistId, playlist.name)}
                // onDelete={() => onDelete(playlist.playlistId, playlist.name)}
                openDeleteModal={openDeleteModal}
                navigateToEdit={navigateToEdit}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PlaylistListPanel;
