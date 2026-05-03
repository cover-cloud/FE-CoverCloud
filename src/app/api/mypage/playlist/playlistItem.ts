import { api } from "@/app/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const createPlaylistItem = async ({
  playlistId,
  coverId,
}: {
  playlistId: number;
  coverId: number;
}) => {
  try {
    const res = await api.post(`/api/playlist/${playlistId}/items`, {
      coverId,
    });

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: "플레이리스트에 곡을 추가하지 못했습니다.",
    };
  }
};

export const deletePlaylistItem = async ({
  playlistId,
  coverId,
}: {
  playlistId: number;
  coverId: number;
}) => {
  try {
    const res = await api.delete(`/api/playlist/${playlistId}/items`, {
      data: {
        coverId,
      },
    });

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: "플레이리스트에서 곡을 삭제하지 못했습니다.",
    };
  }
};

export const reorderPlaylistItems = async ({
  playlistId,
  orderedItemIds,
}: {
  playlistId: number;
  orderedItemIds: number[];
}) => {
  try {
    const res = await api.post(`/api/playlist/${playlistId}/items/reorder`, {
      orderedItemIds: orderedItemIds.join(","),
    });

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: "플레이리스트 곡 순서 변경에 실패했습니다.",
    };
  }
};

export const useCreatePlaylistItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlaylistItem,
    onSuccess: (res, variables) => {
      if (!res?.success) return;

      queryClient.invalidateQueries({
        queryKey: ["myPlaylist"],
      });

      queryClient.invalidateQueries({
        queryKey: ["playlistItems", variables.playlistId],
      });
    },
  });
};

export const useDeletePlaylistItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlaylistItem,
    onSuccess: (res, variables) => {
      if (!res?.success) return;

      queryClient.invalidateQueries({
        queryKey: ["myPlaylist"],
      });

      queryClient.invalidateQueries({
        queryKey: ["playlistItems", variables.playlistId],
      });
    },
  });
};

export const useReorderPlaylistItemsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderPlaylistItems,
    onSuccess: (res, variables) => {
      if (!res?.success) return;

      queryClient.invalidateQueries({
        queryKey: ["playlistItems", variables.playlistId],
      });
    },
  });
};
