// src/app/search/page.tsx
import SearchClient from "./components/SearchClient";
export const dynamic = "force-dynamic";
export default function SearchPage({ params }: { params: { q: string } }) {
  return <SearchClient />;
}
