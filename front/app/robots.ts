import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/_next/*",
          "/admin/*",
          "/*.json",
          "/*.xml",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/*", "/_next/*"],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: ["/api/*", "/_next/*"],
      },
    ],
    sitemap: "https://koenigroom.ru/sitemap.xml",
    host: "https://koenigroom.ru",
  };
}
