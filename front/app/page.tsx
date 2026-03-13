import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Cases } from "@/sections/Cases";
import { Catalog } from "@/sections/Catalog";
import { CTA } from "@/sections/CTA";
import { FAQ } from "@/sections/FAQ";
import { Hero } from "@/sections/Hero";
import { PreCatalogTeaser } from "@/sections/PreCatalogTeaser";
import { PremiumCurtainsAd } from "@/sections/PremiumCurtainsAd";
import { Reviews } from "@/sections/Reviews";
import { ScrollStory } from "@/sections/ScrollStory";
import { WorkOrder } from "@/sections/WorkOrder";
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
  const [case1, case2, case3] = ["/ph1.jpg", "/ph2.jpg", "/ph3.jpg"];
  const reviewImages = pickStable(portfolio, [6, 20, 34]);
  const workOrderImages = pickStable(portfolio, [2, 16, 30, 44, 58]);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] pb-20 text-[color:var(--fg)] sm:pb-0">
      <Header />

      <main>
        <Hero />
        <PreCatalogTeaser />
        <div className="bg-black/[0.02] dark:bg-white/[0.03]">
          <Catalog />
        </div>
        <Cases images={[case1, case2, case3].filter(Boolean)} />
        <PremiumCurtainsAd />
        <div className="kr-dark-section">
          <ScrollStory />
        </div>
        <WorkOrder images={workOrderImages} />
        <div className="kr-bw-section">
          <Reviews images={reviewImages} />
        </div>
        <FAQ />
        <CTA />
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
