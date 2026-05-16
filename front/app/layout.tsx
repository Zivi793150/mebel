import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Koenig Room — премиальные шторы, жалюзи и декор",
    template: "%s — Koenig Room",
  },
  description:
    "Премиальные шторы, жалюзи и интерьерный декор в Калининграде. Подбор, пошив и установка — Koenig Room.",
  keywords: ["шторы", "жалюзи", "карнизы", "интерьер", "Калининград", "пошив штор", "римские шторы"],
  authors: [{ name: "Koenig Room" }],
  creator: "Koenig Room",
  metadataBase: new URL("https://koenigroom.ru"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Koenig Room — премиальные шторы, жалюзи и декор",
    description: "Премиальные шторы, жалюзи и интерьерный декор в Калининграде. Подбор, пошив и установка.",
    url: "/",
    siteName: "Koenig Room",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/fonovaya-na-glavnuyu-1.webp",
        width: 1200,
        height: 630,
        alt: "Koenig Room — премиальные шторы и декор",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Koenig Room — премиальные шторы, жалюзи и декор",
    description: "Премиальные шторы, жалюзи и интерьерный декор в Калининграде.",
    images: ["/fonovaya-na-glavnuyu-1.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    yandex: "YOUR_YANDEX_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}",
          }}
        />
      </head>
      <body
        className="antialiased bg-[color:var(--bg)] text-[color:var(--fg)]"
        style={{
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif",
        }}
      >
        {children}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
