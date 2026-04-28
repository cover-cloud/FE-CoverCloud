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
import SortablePlaylistItemCard from "../SortablePlaylistItemCard";
import { MoveDirection, Playlist } from "../playlistTypes";

type PlaylistDetailPanelProps = {
  selectedPlaylist?: Playlist;
  onDeleteItem: (itemId: number) => void;
  onMoveItem: (itemId: number, direction: MoveDirection) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

const PlaylistDetailPanel = ({
  selectedPlaylist,
  onDeleteItem,
  onMoveItem,
  onDragEnd,
}: PlaylistDetailPanelProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  return (
    <Box component="section" className="min-h-[300px] rounded-xl border p-4">
      {!selectedPlaylist ? (
        <Box className="flex h-full min-h-[260px] items-center justify-center">
          <Typography className="text-sm text-gray-500">
            재생리스트를 선택하면 곡 목록이 표시됩니다.
          </Typography>
        </Box>
      ) : (
        <>
          <Box className="mb-4">
            <Typography className="text-lg font-semibold">
              {selectedPlaylist.title}
            </Typography>

            {selectedPlaylist.description && (
              <Typography className="mt-1 text-sm text-gray-500">
                {selectedPlaylist.description}
              </Typography>
            )}
          </Box>

          <Box className="max-h-[60vh] overflow-y-auto pr-1 md:max-h-[520px]">
            {selectedPlaylist.items.length === 0 ? (
              <Typography className="text-sm text-gray-500">
                이 재생리스트에 담긴 곡이 없습니다.
              </Typography>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={selectedPlaylist.items.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Box className="flex flex-col gap-3">
                    {selectedPlaylist.items.map((item) => (
                      <SortablePlaylistItemCard
                        key={item.id}
                        item={item}
                        onDelete={() => onDeleteItem(item.id)}
                        onMove={(direction) => onMoveItem(item.id, direction)}
                      />
                    ))}
                  </Box>
                </SortableContext>
              </DndContext>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default PlaylistDetailPanel;
