"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlaylistMoveButtons from "../PlaylistMoveButtons";
import { MoveDirection, PlaylistItem } from "../playlistTypes";

type SortablePlaylistItemCardProps = {
  item: PlaylistItem;
  onDelete: () => void;
  onMove: (direction: MoveDirection) => void;
};

const SortablePlaylistItemCard = ({
  item,
  onDelete,
  onMove,
}: SortablePlaylistItemCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
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
      className="flex items-center gap-3 rounded-lg border bg-white p-4"
    >
      <Button
        type="button"
        size="small"
        variant="outlined"
        {...attributes}
        {...listeners}
        className="min-w-0 cursor-grab active:cursor-grabbing"
      >
        ≡
      </Button>

      <Box className="min-w-0 flex-1">
        <Typography className="truncate font-medium">{item.title}</Typography>

        {item.artist && (
          <Typography className="mt-1 truncate text-sm text-gray-500">
            {item.artist}
          </Typography>
        )}
      </Box>

      <PlaylistMoveButtons onMove={onMove} onDelete={onDelete} />
    </Box>
  );
};

export default SortablePlaylistItemCard;
