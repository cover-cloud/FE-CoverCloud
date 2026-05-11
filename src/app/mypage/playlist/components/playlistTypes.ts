export type MoveDirection = "up" | "down" | "top" | "bottom";

export interface PlaylistItem {
  itemId: number;
  coverId: number;
  coverTitle: string;
  coverGenre: "KPOP" | "JPOP" | "POP" | "OTHER";
  coverArtist: string;
  originalTitle: string;
  originalArtist: string;
  originalCoverImageUrl: string;
  link: string;
  position: number;
  likeCount: number;
  viewCount: number;
  tags: string[];
}
export type Playlist = {
  playlistId: number;
  name: string;
  itemCount: number;
  thumbnailUrl: string;
  createdAt: string;
};
