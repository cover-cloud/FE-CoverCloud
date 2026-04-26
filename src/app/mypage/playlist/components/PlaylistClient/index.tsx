"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { useModalStore } from "@/app/store/useModalStore";
import { useRouter, useSearchParams } from "next/navigation";

const PlaylistClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openLoginModal } = useModalStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  return <div>PlaylistClient</div>;
};

export default PlaylistClient;
