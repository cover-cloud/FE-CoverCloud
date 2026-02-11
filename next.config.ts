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
      "storage.googleapis.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i1.sndcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "p16-tiktok-sign-va.tiktokcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "p16-sign-sg.tiktokcdn.com", // ✅ 여기에 추가
        port: "",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/covercloud-bucket/**",
      },
    ],
  },
};

export default nextConfig;
