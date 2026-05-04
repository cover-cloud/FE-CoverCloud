// "use client";

// import { useInfiniteQuery } from "@tanstack/react-query";
// import { SongData } from "../post/components/ItemEditor/type";

// interface SpotifyResponse {
//   tracks: {
//     items: any[];
//   };
// }

// export const useSpotifySearchQuery = (searchQuery: string) => {
//   return useInfiniteQuery({
//     queryKey: ["spotify-infinite", searchQuery],
//     queryFn: async ({ pageParam = 0 }) => {
//       const response = await fetch(
//         `/api/spotify?q=${encodeURIComponent(
//           searchQuery
//         )}&offset=${pageParam}&limit=10`
//       );

//       if (!response.ok) throw new Error("검색 실패");

//       const data: SpotifyResponse = await response.json();
//       const tracks = data.tracks?.items || [];

//       const songs: SongData[] = tracks.map((track: any, index: number) => ({
//         key: `${track.id}-${pageParam}-${index}`,
//         songTitle: track.name,
//         artist: track.artists[0]?.name || "Unknown Artist",
//         coverUrl:
//           track.album?.images[2]?.url || track.album?.images[0]?.url || "",
//       }));

//       return {
//         songs,
//         nextOffset: pageParam + 5,
//         hasMore: tracks.length === 5,
//       };
//     },
//     getNextPageParam: (lastPage) => {
//       return lastPage.hasMore ? lastPage.nextOffset : undefined;
//     },
//     enabled: !!searchQuery.trim(),
//     initialPageParam: 0,
//   });
// };
