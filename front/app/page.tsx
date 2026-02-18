import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Catalog } from "@/sections/Catalog";
import { CTA } from "@/sections/CTA";
import { FAQ } from "@/sections/FAQ";
import { Hero } from "@/sections/Hero";
import { PreCatalogTeaser } from "@/sections/PreCatalogTeaser";
import { PremiumCurtainsAd } from "@/sections/PremiumCurtainsAd";
import { Reviews } from "@/sections/Reviews";
import { ScrollStory } from "@/sections/ScrollStory";
import { WorkOrder } from "@/sections/WorkOrder";

export default function Home() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] pb-20 text-[color:var(--fg)] sm:pb-0">
      <Header />

      <main>
        <Hero />
        <PreCatalogTeaser />
        <div className="bg-black/[0.02] dark:bg-white/[0.03]">
          <Catalog />
        </div>
        <PremiumCurtainsAd />
        <div className="kr-dark-section">
          <ScrollStory />
        </div>
        <WorkOrder />
        <div className="kr-bw-section">
          <Reviews />
        </div>
        <FAQ />
        <CTA />
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
