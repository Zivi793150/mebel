import Link from "next/link";
import Image from "next/image";
import path from "path";
import { readdir } from "fs/promises";

import { Container } from "@/components/Container";
import { CATALOG_CATEGORIES } from "@/lib/constants";
import { getMongoClient } from "@/lib/mongo";

type KoenigCatalogItem = {
  index: number;
  large_url: string;
};

type KoenigSubcategory = {
  index: number;
  slug: string;
  thumb_url?: string | null;
};

type KoenigCatalogDoc = {
  source?: string;
  slug: string;
  subcategories?: KoenigSubcategory[];
  items?: KoenigCatalogItem[];
};

const KOENIG_SOURCE_SLUG_BY_APP_SLUG: Record<string, string> = {
  curtains: "shtory_i_tkani_v_interere",
  blinds: "zhalyuzi",
  rails: "dekorativnye_karnizy",
  decor: "dekor_furnitura_aksessuary",
  bedding: "postelnoe_bele",
  rugs: "kovry",
  pillows: "interernye_pokryvala_i_podushki",
  roman: "rimskie_shtory",
};

async function getKoenigDoc(sourceSlug: string): Promise<KoenigCatalogDoc | null> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<KoenigCatalogDoc>("catalog_items");
    return (
      (await col.findOne({ source: "koenigroom.ru", slug: sourceSlug }, {
        projection: { _id: 0 },
      })) ?? null
    );
  } catch {
    return null;
  }
}

function firstImage(doc: KoenigCatalogDoc | null): string | null {
  const items = doc?.items ?? [];
  if (items.length === 0) return null;
  const sorted = items.slice().sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return sorted[0]?.large_url ?? null;
}

async function pickPublicCatalogCover(appSlug: string): Promise<string | null> {
  const folderBySlug: Record<string, string> = {
    curtains: "Шторы и ткани",
    blinds: "Жалюзи",
    roman: "Римские",
  };

  if (appSlug === "blinds") {
    return encodeURI(`/catalog/${folderBySlug.blinds}/SVM05621.jpg`);
  }

  const folder = folderBySlug[appSlug] ?? appSlug;
  const absDir = path.join(process.cwd(), "public", "catalog", folder);
  try {
    const entries = await readdir(absDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, "ru"));
    const picked = files[1] ?? files[0];
    if (!picked) return null;
    return encodeURI(`/catalog/${folder}/${picked}`);
  } catch {
    return null;
  }
}

export async function Catalog() {
  const sourceSlugs = Object.values(KOENIG_SOURCE_SLUG_BY_APP_SLUG);
  const docs = await Promise.all(sourceSlugs.map((s) => getKoenigDoc(s)));

  const imgBySourceSlug = new Map<string, string>();
  for (let i = 0; i < sourceSlugs.length; i += 1) {
    const source = sourceSlugs[i];
    const doc = docs[i];
    const img = firstImage(doc);
    if (img) imgBySourceSlug.set(source, img);
  }

  const railsDoc = docs[sourceSlugs.indexOf("dekorativnye_karnizy")] ?? null;
  const railsSubcats = (railsDoc?.subcategories ?? []).slice().sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  if (!imgBySourceSlug.has("dekorativnye_karnizy") && railsSubcats[0]) {
    const firstSub = railsSubcats[0];
    const subImg = firstSub.thumb_url || firstImage(await getKoenigDoc(firstSub.slug));
    if (subImg) imgBySourceSlug.set("dekorativnye_karnizy", subImg);
  }

  const publicCovers = await Promise.all(
    CATALOG_CATEGORIES.map(async (c) => [c.slug, await pickPublicCatalogCover(c.slug)] as const),
  );
  const publicCoverBySlug = new Map<string, string>();
  for (const [slug, src] of publicCovers) {
    if (src) publicCoverBySlug.set(slug, src);
  }

  return (
    <section id="catalog" className="pb-14 pt-8 sm:pb-18 sm:pt-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
              ЧТО МЫ ПРЕДЛАГАЕМ
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
              Каталог
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Полный ассортимент Koenig Room. Быстро покажем категории и дальше
              сфокусируемся на самом сильном — шторах.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Link
              href="#cta"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            >
              Подобрать решение
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-4 lg:gap-y-14">
          {CATALOG_CATEGORIES.map((c) => {
            const sourceSlug = KOENIG_SOURCE_SLUG_BY_APP_SLUG[c.slug];
            const img = sourceSlug ? imgBySourceSlug.get(sourceSlug) : null;
            const publicCover = publicCoverBySlug.get(c.slug) ?? null;
            const imageSrc = publicCover || img || c.imageSrc;
            return (
              <Link
                key={c.title}
                href={c.slug === "roman" ? "/catalog/blinds/roman" : `/catalog/${c.slug}`}
                className="group block"
              >
                <div
                  className={`relative h-[320px] overflow-hidden rounded-2xl border border-black/10 bg-white/25 shadow-sm transition-[transform,background-color,box-shadow] duration-500 dark:border-white/10 dark:bg-white/[0.03] sm:h-[380px] lg:h-[420px] ${
                    c.emphasis ? "border-[color:var(--accent)]/40" : ""
                  } group-hover:-translate-y-0.5 group-hover:bg-white/35 group-hover:shadow-md dark:group-hover:bg-white/[0.06]`}
                >
                  <Image
                    src={imageSrc}
                    alt={c.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_70%)] opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

                <div className="absolute left-5 top-5 right-5">
                  <div className="inline-flex max-w-full flex-col gap-3">
                    <div className="h-px w-12 bg-white/35" />
                    <div className="inline-flex max-w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                      <div className="text-lg font-semibold leading-tight tracking-tight text-white">
                        {c.title}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex min-h-[176px] flex-col justify-end">
                    <div className="text-sm leading-6 text-white/80 opacity-100 transition-[opacity,transform] duration-500 translate-y-0 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
                      {c.description}
                    </div>

                    <div className="pt-4">
                      <div className="inline-flex h-10 items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition group-hover:opacity-95">
                        Заказать <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
