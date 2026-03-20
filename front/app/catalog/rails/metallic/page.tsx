import Link from "next/link";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CONTACTS } from "@/lib/constants";
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
            source: "koenigroom.ru",
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
        <section className="py-14 sm:py-18">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КАТАЛОГ</div>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                  Металлические карнизы
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                  Выберите коллекцию — откроются карточки с примерами и фото.
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
                    Все виды карнизов
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(collections.length ? collections : []).map((s) => {
                const title = String(s.title || s.collectionSlug || "").trim() || s.collectionSlug;
                return (
                  <Link
                    key={s.collectionSlug}
                    href={`/catalog/rails/metallic/${encodeURIComponent(s.collectionSlug)}`}
                    className="block"
                  >
                    <div className="group h-full overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
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
          </Container>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
