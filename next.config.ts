import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/main",
        permanent: true, // 301 리다이렉트 (SEO에 유리)
      },
    ];
  },
  images: {
    domains: [
      "via.placeholder.com",
      "picsum.photos",
      "source.unsplash.com",
      "i.scdn.co",
      "img.youtube.com",
    ], // 허용할 외부 도메인
  },
};

export default nextConfig;
