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
            <div className="mb-4">
              <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Каталог
              </span>
            </div>
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
                  className={`relative h-[320px] overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)] transition duration-500 sm:h-[380px] lg:h-[420px]`}
                >
                  <Image
                    src={imageSrc}
                    alt={c.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_70%)] opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

                <div className="absolute inset-x-0 top-0 flex h-16 items-center bg-black/50 px-5">
                  <div className="text-lg font-medium text-white">
                    {c.title}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex min-h-[80px] flex-col justify-end">
                    <div className="text-sm leading-6 text-white/80 opacity-100 transition duration-500">
                      {c.description}
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
