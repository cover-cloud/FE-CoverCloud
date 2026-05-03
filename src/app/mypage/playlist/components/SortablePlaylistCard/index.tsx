"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlaylistMoveButtons from "../PlaylistMoveButtons";
import { MoveDirection, Playlist } from "../playlistTypes";

type SortablePlaylistCardProps = {
  playlist: Playlist;
  itemCount: number;
  isSelected: boolean;
  onClick: () => void;
  // onDelete: () => void;
  // onMove: (direction: MoveDirection) => void;
};

const SortablePlaylistCard = ({
  playlist,
  itemCount,
  isSelected,
  onClick,
  // onDelete,
  // onMove,
}: SortablePlaylistCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: playlist.playlistId,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
        isSelected ? "border-black bg-gray-100" : "bg-white"
      }`}
    >
      {/* <Button
        type="button"
        size="small"
        variant="outlined"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="min-w-0 cursor-grab active:cursor-grabbing"
      >
        ≡
      </Button> */}
      <Box className="min-w-0 flex-1">
        <Typography className="truncate font-semibold">
          {playlist.name}
        </Typography>

        {/* {playlist.description && (
            <Typography className="mt-1 truncate text-sm text-gray-500">
              {playlist.description}
            </Typography>
          )} */}

        <Typography className="mt-1 text-xs text-gray-400">
          {itemCount}곡
        </Typography>
        <Typography className="mt-1 text-xs text-gray-400">
          {playlist.createdAt}
        </Typography>
        <Typography className="mt-1 text-xs text-gray-400">
          {playlist.thumbnailUrl}
        </Typography>
      </Box>
      {/* <PlaylistMoveButtons onDelete={onDelete} /> */}
    </Box>
  );
};

export default SortablePlaylistCard;
