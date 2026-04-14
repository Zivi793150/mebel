import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactButton } from "@/components/ContactButton";
import { Container } from "@/components/Container";
import { type CorniceItem, CornicesCatalog } from "@/components/CornicesCatalog";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getMongoClient } from "@/lib/mongo";
import { CTA } from "@/sections/CTA";

export const dynamic = "force-dynamic";

async function getMetallicCollectionDocs(collectionSlug: string): Promise<CorniceItem[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<CorniceItem>("cornices");

    const docs = await col
      .find(
        {
          source: "koenig_room",
          kind: { $in: ["cornice_collection", "cornice_item"] },
          type: "металлические",
          collectionSlug,
        },
        { projection: { _id: 0 } },
      )
      .limit(500)
      .toArray();

    return docs ?? [];
  } catch {
    return [];
  }
}

export default async function RailsMetallicSubtypePage({
  params,
}: {
  params: Promise<{ subtype: string }>;
}) {
  const { subtype } = await params;
  const collectionSlug = decodeURIComponent(subtype);

  const docs = await getMetallicCollectionDocs(collectionSlug);
  const hasCollection = docs.some((d) => d.kind === "cornice_collection");
  if (!docs.length || !hasCollection) notFound();

  const maybeTitle =
    docs.find((d) => d.kind === "cornice_collection")?.title ||
    docs.find((d) => d.kind === "cornice_collection")?.collectionTitle;
  const title = String(maybeTitle || "").trim() || collectionSlug;

  const heroImage = docs.find((d) => d.kind === "cornice_item")?.image || "/catalog/rails-metallic.webp";

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main>
        {/* Hero Banner - Full width slider style */}
        <section className="relative min-h-[50vh] overflow-hidden sm:min-h-[60vh]">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover"
              loading="eager"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 flex min-h-[50vh] items-center sm:min-h-[60vh]">
            <Container>
              <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {title}: металлические карнизы
                </h1>
                <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                  Металлические карнизы — примеры и фото.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ContactButton
                    className="inline-flex h-11 items-center justify-center bg-[color:var(--accent)] px-6 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                    imageSrc={heroImage}
                  >
                    Получить консультацию
                  </ContactButton>
                </div>
              </div>
            </Container>
          </div>
        </section>

        <section className="py-14 sm:py-18">
          <Container>
            <div className="text-center">
              <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КОЛЛЕКЦИЯ</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                {title}
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                Металлические карнизы — примеры и фото.
              </p>
            </div>

            <div className="mt-12">
              <CornicesCatalog items={docs} />
            </div>

            <div className="mt-10 text-center">
              <ContactButton
                className="inline-flex h-11 items-center justify-center rounded-sm bg-[color:var(--accent)] px-6 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                imageSrc={heroImage}
              >
                Получить консультацию
              </ContactButton>
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
                imageSrc={heroImage}
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
