import PlaylistPlayerClient from "./components/PlaylistPlayerClient";

export const dynamic = "force-dynamic";
export default function ActivityPage({
  params,
}: {
  params: { playlistId: string };
}) {
  return <PlaylistPlayerClient playlistId={params.playlistId} />;
}
