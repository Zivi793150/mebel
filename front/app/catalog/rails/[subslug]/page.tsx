import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactButton } from "@/components/ContactButton";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RailsVariantsCatalog } from "@/components/RailsVariantsCatalog";
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
    const doc = await col.findOne({ source: "koenig_room", slug }, { projection: { _id: 0 } });
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

  const hero = images[0] || "/catalog/4.karnizy/bagetnye-karnizy/1.webp";
  const cards = (images.length ? images : Array.from({ length: 12 }).map(() => "/catalog/4.karnizy/bagetnye-karnizy/1.webp"))
    .slice(0, 24)
    .map((src, idx) => ({
      title: `Вариант ${idx + 1}`,
      imageSrc: src,
    }));

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main>
        {/* Hero Banner - Full width slider style */}
        <section className="relative min-h-[60vh] overflow-hidden sm:min-h-[70vh]">
          <div className="absolute inset-0">
            <Image
              src={hero}
              alt={meta.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 flex min-h-[60vh] items-center sm:min-h-[70vh]">
            <Container>
              <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {meta.title}: карнизы для вашего интерьера
                </h1>
                <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                  Коллекция карнизов премиум-класса. Точные замеры и профессиональный монтаж.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ContactButton
                    className="inline-flex h-11 items-center justify-center bg-[color:var(--accent)] px-6 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                    imageSrc={hero}
                  >
                    Получить консультацию
                  </ContactButton>
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* Parallax Image Slider */}
        <section className="overflow-hidden bg-black/5 py-8">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
            {(images.length ? images : Array.from({ length: 12 }).map(() => "/catalog/4.karnizy/bagetnye-karnizy/1.webp")).slice(0, 12).map((src, idx) => (
              <div
                key={`parallax-${idx}`}
                className="relative h-[200px] w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl"
              >
                <Image
                  src={src}
                  alt={`Карнизы ${idx + 1}`}
                  fill
                  sizes="300px"
                  className="object-cover"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Variants Section */}
        <section className="py-16 sm:py-20">
          <Container>
            <div className="text-center">
              <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ВАРИАНТЫ</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                Подборки и примеры
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                Выберите вариант — и мы подскажем решение и рассчитаем комплект.
              </p>
            </div>

            <div className="mt-12">
              <RailsVariantsCatalog
                cards={cards}
                contextBase={{
                  source: "koenig_room",
                  kind: "rail",
                  url: `/catalog/rails/${subslug}`,
                  category: meta.title,
                  title: meta.title,
                }}
              />
            </div>
          </Container>
        </section>

        {/* Guarantee Section */}
        <section className="bg-[color:var(--bg)] py-16 sm:py-20">
          <Container>
            <div className="mb-8">
              <span className="inline-block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Гарантия
              </span>
              <span className="ml-2 inline-block font-['Rozovii_Chulok',cursive] text-xl tracking-normal text-[color:var(--green)] sm:ml-4 sm:text-3xl lg:text-4xl" style={{ transform: 'rotate(-6deg)' }}>
                качества
              </span>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article className="group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)]">
                <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                  <div className="text-xl font-medium text-[color:var(--fg)]">01</div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                  Только проверенные материалы
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Используем комплектующие, которые обеспечивают долговечность и комфорт в использовании.
                </p>
              </article>

              <article className="group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)]">
                <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                  <div className="text-xl font-medium text-[color:var(--fg)]">02</div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                  Точные замеры и монтаж
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Каждый заказ проходит тщательную обработку: от точных замеров до профессиональной установки.
                </p>
              </article>

              <article className="group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)]">
                <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                  <div className="text-xl font-medium text-[color:var(--fg)]">03</div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                  Гарантия 5 лет
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Постгарантийное обслуживание и поддержка на всех этапах эксплуатации.
                </p>
              </article>
            </div>

            <div className="mt-10 text-center">
              <ContactButton
                className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]"
                imageSrc={hero}
              >
                Получить консультацию
              </ContactButton>
            </div>
          </Container>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
