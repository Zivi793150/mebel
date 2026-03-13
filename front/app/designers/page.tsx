export const dynamic = "force-static";

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
        <DesignersServices />
        <DesignersBenefits />
        <DesignersPortfolio />
        <DesignersContact />
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
