import Image from "next/image";
import Link from "next/link";

import { ContactButton } from "@/components/ContactButton";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getMongoClient } from "@/lib/mongo";
import { CTA } from "@/sections/CTA";

export const dynamic = "force-dynamic";

type CornicesCollectionRow = {
  collectionSlug: string;
  title?: string | null;
  count: number;
};

async function getMetallicCollections(): Promise<CornicesCollectionRow[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection("cornices");

    const rows = await col
      .aggregate<CornicesCollectionRow>([
        {
          $match: {
            source: "koenig_room",
            kind: "cornice_collection",
            type: "металлические",
            collectionSlug: { $type: "string", $ne: "" },
          },
        },
        {
          $lookup: {
            from: "cornices",
            let: { slug: "$collectionSlug" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$source", "koenigroom.ru"] },
                      { $eq: ["$kind", "cornice_item"] },
                      { $eq: ["$type", "металлические"] },
                      { $eq: ["$collectionSlug", "$$slug"] },
                    ],
                  },
                },
              },
              { $count: "count" },
            ],
            as: "itemsCount",
          },
        },
        {
          $addFields: {
            count: { $ifNull: [{ $first: "$itemsCount.count" }, 0] },
          },
        },
        { $sort: { title: 1, collectionSlug: 1 } },
        { $project: { _id: 0, collectionSlug: 1, title: 1, count: 1 } },
      ])
      .toArray();

    return rows ?? [];
  } catch {
    return [];
  }
}

export default async function RailsMetallicIndexPage() {
  const collections = await getMetallicCollections();

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main>
        {/* Hero Banner - Full width slider style */}
        <section className="relative min-h-[50vh] overflow-hidden sm:min-h-[60vh]">
          <div className="absolute inset-0">
            <Image
              src="/catalog/4.karnizy/elektrokarnizy/8d5895d5a388b3482a148445333db28f-optimized.webp"
              alt="Металлические карнизы"
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
                  Металлические карнизы: стиль и надёжность
                </h1>
                <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                  Выберите коллекцию — откроются карточки с примерами и фото.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ContactButton
                    className="inline-flex h-11 items-center justify-center bg-[color:var(--accent)] px-6 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                    imageSrc="/catalog/4.karnizy/elektrokarnizy/8d5895d5a388b3482a148445333db28f-optimized.webp"
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
              <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КОЛЛЕКЦИИ</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                Выберите коллекцию
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(collections.length ? collections : []).map((s) => {
                const title = String(s.title || s.collectionSlug || "").trim() || s.collectionSlug;
                return (
                  <Link
                    key={s.collectionSlug}
                    href={`/catalog/rails/metallic/${encodeURIComponent(s.collectionSlug)}`}
                    className="block"
                  >
                    <div className="group h-full overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                      <div className="p-6">
                        <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">{title}</div>
                        <div className="mt-2 text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">
                          {s.count} шт.
                        </div>
                        <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                          Открыть →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <ContactButton
                className="inline-flex h-11 items-center justify-center rounded-sm bg-[color:var(--accent)] px-6 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                imageSrc="/catalog/4.karnizy/elektrokarnizy/8d5895d5a388b3482a148445333db28f-optimized.webp"
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
                imageSrc="/catalog/4.karnizy/elektrokarnizy/8d5895d5a388b3482a148445333db28f-optimized.webp"
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
