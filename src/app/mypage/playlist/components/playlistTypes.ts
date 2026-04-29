export type MoveDirection = "up" | "down" | "top" | "bottom";

export type PlaylistItem = {
  id: number;
  title: string;
  artist?: string;
};

export type Playlist = {
  id: number;
  title: string;
  description?: string;
};
