import MainComponent from "./components/MainComponent";
import { fetchPopularCoverListServer, Period } from "../api/cover/list";

export const dynamic = "force-dynamic";

export default async function MainPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const period = (params.period as Period) ?? "ALL";
  const genres = params.genres ? params.genres.split(",") : [];

  const initialData = await fetchPopularCoverListServer({
    page: page - 1,
    size: 18,
    period,
    genres,
  });

  return <MainComponent initialData={initialData} />;
}
