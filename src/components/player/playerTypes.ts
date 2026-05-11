import { MediaUrlResult } from "@/app/utils/youtube";

export type PlayerViewData = {
  id: number;
  link: string;
  coverTitle: string;
  coverArtist: string;
  originalTitle: string;
  originalArtist: string;
  originalCoverImageUrl: string;
  coverGenre?: string;
  tags?: string[];
  createdAt?: string;
  likeCount?: number;
  viewCount: number;
  isLiked?: boolean;
  userId?: number | null;
};

export type PlayerViewerProps = {
  data: PlayerViewData;
  currentUserId?: number;
  userProfileImage?: string;
  isMobile: boolean;
  isLoading?: boolean;

  showComments?: boolean;
  showAddPlaylistButton?: boolean;
  showOptions?: boolean;
  showPopularVideos?: boolean;
  showLikeCount?: boolean;

  onBack?: () => void;
  onLikeToggle: () => void;
  onVideoEnded: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;

  getAspectRatio: (videoData: MediaUrlResult | null) => string;
};
