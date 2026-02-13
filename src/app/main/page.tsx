// app/page.tsx
import MainComponent from "./components/MainComponent";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export default async function MainPage() {
  return <MainComponent />;
}
