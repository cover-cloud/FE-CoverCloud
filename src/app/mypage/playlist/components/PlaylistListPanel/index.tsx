"use client";

import { Box, Typography } from "@mui/material";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortablePlaylistCard from "../SortablePlaylistCard";
import { MoveDirection, Playlist } from "../playlistTypes";

type PlaylistListPanelProps = {
  playlists: Playlist[];
  selectedPlaylistId: number | null;
  onSelect: (playlistId: number) => void;
  onDelete: (playlistId: number) => void;
  onMove: (playlistId: number, direction: MoveDirection) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

const PlaylistListPanel = ({
  playlists,
  selectedPlaylistId,
  onSelect,
  onDelete,
  onMove,
  onDragEnd,
}: PlaylistListPanelProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  return (
    <Box component="section" className="rounded-xl border p-4">
      <Typography className="mb-4 text-lg font-semibold">재생리스트</Typography>

      <Box className="max-h-[60vh] overflow-y-auto pr-1 md:max-h-[520px]">
        {playlists.length === 0 ? (
          <Typography className="text-sm text-gray-500">
            아직 만든 재생리스트가 없습니다.
          </Typography>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={playlists.map((playlist) => playlist.id)}
              strategy={verticalListSortingStrategy}
            >
              <Box className="flex flex-col gap-3">
                {playlists.map((playlist) => (
                  <SortablePlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    isSelected={playlist.id === selectedPlaylistId}
                    onClick={() => onSelect(playlist.id)}
                    onDelete={() => onDelete(playlist.id)}
                    onMove={(direction) => onMove(playlist.id, direction)}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        )}
      </Box>
    </Box>
  );
};

export default PlaylistListPanel;
