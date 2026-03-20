import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { type CorniceItem, CornicesCatalog } from "@/components/CornicesCatalog";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CONTACTS } from "@/lib/constants";
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
          source: "koenigroom.ru",
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

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main>
        <section className="py-14 sm:py-18">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КОЛЛЕКЦИЯ</div>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                  Металлические карнизы — примеры и фото.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                  >
                    Подобрать под мой интерьер
                  </a>
                  <Link
                    href="/catalog/rails/metallic"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Все подвиды
                  </Link>
                  <Link
                    href="/catalog/rails"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Все виды карнизов
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <CornicesCatalog items={docs} />
            </div>
          </Container>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
