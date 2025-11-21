"use client";

import { useQuery } from "@tanstack/react-query";

export const useSpotifySearchQuery = (query: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["spotify-search", query],
    queryFn: async () => {
      const res = await fetch(`/api/spotify?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Spotify 검색 실패");
      return res.json();
    },
    enabled, // 버튼 눌렀을 때만 실행
  });
};
