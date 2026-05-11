"use client";

import PlayerViewer from "@/components/player/PlayerViewer";
import { MediaUrlResult } from "@/app/utils/youtube";

type PlaylistPlayerClientProps = {
  playlistId: string;
};

const PlaylistPlayerClient = ({ playlistId }: PlaylistPlayerClientProps) => {
  //여기서 플레이 리스트 가져와서 리스트 별로 페이지 로드하면 될듯
  const mockPlayerData = {
    id: 313,
    userId: 503,
    link: "https://youtu.be/b26bTilmloU?list=RDb26bTilmloU",
    coverTitle: "결혼식 축가 | 주름맞추기 / Vaundy (cover)",
    coverArtist: "Fukuwa Kaz",
    originalTitle: "しわあわせ",
    originalArtist: "Vaundy",
    originalCoverImageUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/8a/eb/75/8aeb7526-6fe4-a81a-5dce-c5d026e7f036/4547366655728.jpg/100x100bb.jpg",
    coverGenre: "J_POP",
    tags: ["Vaundy", "JPOP", "cover"],
    createdAt: "2026-04-30",
    likeCount: 0,
    viewCount: 577,
    isLiked: false,
  };

  const getAspectRatio = (videoData: MediaUrlResult | null) => {
    if (!videoData || !videoData.platform) return "16 / 9";

    switch (videoData.platform) {
      case "soundcloud":
        return "100 / 20";
      default:
        return "16 / 9";
    }
  };

  const handleVideoEnded = () => {
    console.log("다음 곡 재생");
  };

  return (
    <PlayerViewer
      data={mockPlayerData}
      userProfileImage=""
      isMobile={false}
      isLoading={false}
      showComments={false}
      showAddPlaylistButton={false}
      showOptions={false}
      showPopularVideos={true}
      showLikeCount
      onVideoEnded={handleVideoEnded}
      getAspectRatio={getAspectRatio}
      onLikeToggle={() => {}}
      onEdit={() => {}}
      onDelete={() => {}}
      onReport={() => {}}
    />
  );
};

export default PlaylistPlayerClient;
