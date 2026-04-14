import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";

export const metadata: Metadata = {
  title: "Koenig Room — премиальные шторы, жалюзи и декор в Калининграде",
  description: "Премиальные шторы, жалюзи и интерьерный декор в Калининграде. Подбор тканей, профессиональный пошив и монтаж. Работаем с 2018 года. Более 500 реализованных проектов.",
  keywords: [
    "шторы Калининград",
    "жалюзи Калининград",
    "карнизы Калининград",
    "пошив штор",
    "римские шторы",
    "рулонные шторы",
    "пластиковые жалюзи",
    "деревянные жалюзи",
    "интерьерный текстиль",
    "декор окна",
    "шторы на заказ",
    "koenig room",
    "ковры Калининград",
    "подушки декоративные",
    "постельное бельё",
  ],
  alternates: {
    canonical: "https://koenigroom.ru",
  },
  openGraph: {
    title: "Koenig Room — премиальные шторы, жалюзи и декор в Калининграде",
    description: "Подбор тканей, профессиональный пошив и монтаж. Работаем с 2018 года. Более 500 реализованных проектов.",
    url: "https://koenigroom.ru",
    siteName: "Koenig Room",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://koenigroom.ru/Фоновая на главную 1.webp",
        width: 1920,
        height: 1080,
        alt: "Koenig Room — премиальные шторы и декор в Калининграде",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Koenig Room — премиальные шторы, жалюзи и декор",
    description: "Подбор тканей, профессиональный пошив и монтаж в Калининграде.",
    images: ["https://koenigroom.ru/Фоновая на главную 1.webp"],
  },
};
import { Advantages } from "@/sections/Advantages";
import { Catalog } from "@/sections/Catalog";
import { CTA } from "@/sections/CTA";
import { FAQ } from "@/sections/FAQ";
import { Hero } from "@/sections/Hero";
import { PortfolioSlider } from "@/sections/PortfolioSlider";
import { PremiumCurtainsAd } from "@/sections/PremiumCurtainsAd";
import { Reviews } from "@/sections/Reviews";
import { Services } from "@/sections/Services";
import { Team } from "@/sections/Team";
import { WorkSteps } from "@/sections/WorkSteps";
import { getMongoClient } from "@/lib/mongo";

type KoenigCatalogItem = {
  index: number;
  large_url: string;
};

type KoenigCatalogDoc = {
  source?: string;
  slug: string;
  items?: KoenigCatalogItem[];
};

async function getPortfolioImages(): Promise<string[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<KoenigCatalogDoc>("catalog_items");
    const doc = await col.findOne({ source: "koenigroom.ru", slug: "portfolio" }, {
      projection: { _id: 0, items: 1 },
    });
    const items = doc?.items ?? [];
    return items
      .slice()
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((it) => it.large_url)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function pickStable(images: string[], indexes: number[]): string[] {
  if (images.length === 0) return [];
  return indexes.map((i) => images[i % images.length]);
}

export default async function Home() {
  const portfolio = await getPortfolioImages();
  const reviewImages = pickStable(portfolio, [6, 20, 34]);
  const workStepsImages = pickStable(portfolio, [2, 16, 30, 44, 58]);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] pb-20 text-[color:var(--fg)] sm:pb-0">
      <Header />

      <main>
        {/* Hero section with banners */}
        <Hero />
        
        {/* Advantages section with videos */}
        <Advantages />
        
        {/* Services section */}
        <Services />
        
        {/* Catalog section */}
        <div className="bg-black/[0.02] dark:bg-white/[0.03]">
          <Catalog />
        </div>
        
        {/* Portfolio slider */}
        <PortfolioSlider />
        
        {/* Team section */}
        <Team />
        
        {/* Work steps */}
        <WorkSteps />
        
        {/* Premium curtains ad - video section */}
        <PremiumCurtainsAd />
        
        {/* Reviews section */}
        <Reviews />
        
        {/* FAQ section */}
        <FAQ />
        
        {/* CTA section */}
        <CTA />
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
