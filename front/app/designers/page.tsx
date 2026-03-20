export const dynamic = "force-dynamic";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { DesignersHero } from "./sections/DesignersHero";
import { DesignersServices } from "./sections/DesignersServices";
import { DesignersBenefits } from "./sections/DesignersBenefits";
import { DesignersPortfolio } from "./sections/DesignersPortfolio";
import { DesignersContact } from "./sections/DesignersContact";

export default function DesignersPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main>
        <DesignersHero />
        <div className="bg-[#ede6de] dark:bg-white/[0.06]">
          <DesignersServices />
        </div>
        <DesignersBenefits />
        <div className="bg-[#ede6de] dark:bg-white/[0.06]">
          <DesignersPortfolio />
        </div>
        <DesignersContact />
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
