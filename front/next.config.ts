import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "koenigroom.ru",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "koenigcarpet.ru",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
