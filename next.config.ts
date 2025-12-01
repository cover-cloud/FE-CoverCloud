import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: [
      "via.placeholder.com",
      "picsum.photos",
      "source.unsplash.com",
      "i.scdn.co",
    ], // 허용할 외부 도메인
  },
};

export default nextConfig;
