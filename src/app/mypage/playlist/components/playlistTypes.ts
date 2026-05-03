export type MoveDirection = "up" | "down" | "top" | "bottom";

export type PlaylistItem = {
  id: number;
  title: string;
  artist?: string;
};

export type Playlist = {
  playlistId: number;
  name: string;
  itemCount: number;
  thumbnailUrl: string;
  createdAt: string;
};
