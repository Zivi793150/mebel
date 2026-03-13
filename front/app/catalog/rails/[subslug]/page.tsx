import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RailsVariantsCatalog } from "@/components/RailsVariantsCatalog";
import { CONTACTS } from "@/lib/constants";
import { getMongoClient } from "@/lib/mongo";
import { CTA } from "@/sections/CTA";

type KoenigCatalogItem = {
  index: number;
  large_url: string;
  small_url?: string | null;
  alt?: string | null;
  group?: string | null;
};

type KoenigCatalogDoc = {
  source?: string;
  slug: string;
  title?: string | null;
  items?: KoenigCatalogItem[];
};

const SUBCATS = [
  { subslug: "scaglioni", title: "Scaglioni" },
  { subslug: "winart", title: "Winart" },
  { subslug: "windeco", title: "Windeco" },
] as const;

function pickKoenigImages(doc: KoenigCatalogDoc | null): string[] {
  const items = doc?.items ?? [];
  return items
    .slice()
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((it) => it.large_url)
    .filter(Boolean);
}

async function getKoenigCatalogDoc(slug: string): Promise<KoenigCatalogDoc | null> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<KoenigCatalogDoc>("catalog_items");
    const doc = await col.findOne({ source: "koenigroom.ru", slug }, { projection: { _id: 0 } });
    return doc ?? null;
  } catch {
    return null;
  }
}

export default async function RailsSubcatalogPage({
  params,
}: {
  params: Promise<{ subslug: string }>;
}) {
  const { subslug } = await params;
  const meta = SUBCATS.find((s) => s.subslug === subslug);
  if (!meta) notFound();

  const doc = await getKoenigCatalogDoc(subslug);
  const images = pickKoenigImages(doc);

  const hero = images[0] || "/catalog/rails.jpg";
  const cards = (images.length ? images : Array.from({ length: 12 }).map(() => "/catalog/rails.jpg"))
    .slice(0, 24)
    .map((src, idx) => ({
      title: `Вариант ${idx + 1}`,
      imageSrc: src,
    }));

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main>
        <section className="py-14 sm:py-18">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ПОДКАТАЛОГ</div>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                  {meta.title}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                  Коллекция карнизов. Ниже — варианты и фото для вдохновения.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                  >
                    Подобрать под мой интерьер
                  </a>
                  <Link
                    href="/catalog/rails"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Все коллекции
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-black/10 bg-white/50 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <Image
                    src={hero}
                    alt={meta.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.10),rgba(0,0,0,0.38))]" />
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="pb-14 sm:pb-18">
          <Container>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ВАРИАНТЫ</div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
                  Подборки и примеры
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                  Выберите вариант — и мы подскажем решение и рассчитаем комплект.
                </p>
              </div>
            </div>

            <RailsVariantsCatalog
              cards={cards}
              contextBase={{
                source: "koenigroom.ru",
                kind: "rail",
                url: `/catalog/rails/${subslug}`,
                category: meta.title,
                title: meta.title,
              }}
            />
          </Container>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
