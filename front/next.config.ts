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
      {
        protocol: "https",
        hostname: "i1.photo.2gis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
