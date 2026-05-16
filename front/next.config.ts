import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/uploads/:path*",
      destination: "/api/uploads/:path*",
    },
  ],
  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  headers: async () => [
    {
      source: "/:all*(svg|jpg|png|webp|avif|gif|ico|woff|woff2)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/:path*",
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Referrer-Policy",
          value: "origin-when-cross-origin",
        },
      ],
    },
  ],
};

export default nextConfig;
