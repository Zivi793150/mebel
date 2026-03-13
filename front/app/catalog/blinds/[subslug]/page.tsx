import Image from "next/image";
import Link from "next/link";
import path from "path";
import { readdir } from "fs/promises";

import { BlindsTypesCatalog, type BlindsTypeItem } from "@/components/BlindsTypesCatalog";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CONTACTS } from "@/lib/constants";
import { getMongoClient } from "@/lib/mongo";
import { CTA } from "@/sections/CTA";

type KoenigCatalogItem = {
  index: number;
  large_url: string;
};

type KoenigCatalogDoc = {
  source?: string;
  slug: string;
  items?: KoenigCatalogItem[];
};

type KoenigBlindsSubcatalogVariant = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  images?: string[];
};

type KoenigBlindsSubcatalogDoc = {
  source?: string;
  kind?: string;
  subslug: string;
  title?: string;
  description?: string;
  variantsIntro?: string;
  variants?: KoenigBlindsSubcatalogVariant[];
};

async function getBlindsImages(): Promise<string[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<KoenigCatalogDoc>("catalog_items");
    const doc = await col.findOne(
      { source: "koenigroom.ru", slug: "zhalyuzi" },
      { projection: { _id: 0, items: 1 } },
    );
    const items = doc?.items ?? [];
    return items
      .slice()
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .map((it) => it.large_url)
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function getKoenigBlindsSubcatalog(subslug: string): Promise<KoenigBlindsSubcatalogDoc | null> {
  try {
    const client = await getMongoClient();
    const col = client
      .db("koenig")
      .collection<KoenigBlindsSubcatalogDoc>("blinds_subcatalogs");

    const doc = await col.findOne(
      { source: "koenigroom.ru", kind: "blinds_subcatalog", subslug },
      { projection: { _id: 0 } },
    );

    return doc ?? null;
  } catch {
    return null;
  }
}

function matchSubslug(subslug: string, item: BlindsTypeItem) {
  const s = `${subslug}`.toLowerCase();
  const t = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  if (s === "wood") return /(дерев|бамбук)/i.test(t);
  if (s === "aluminum") return /(алюм|металл)/i.test(t);
  if (s === "pleated") return /(плиссе|plisse|pliss|плис)/i.test(t);
  if (s === "roller") return /(рулон|рол|кассет|зебра|день\s*ночь)/i.test(t);
  if (s === "roman") return /(римск)/i.test(t);
  return false;
}

async function getBlindsTypesForSubslug(subslug: string): Promise<BlindsTypeItem[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<BlindsTypeItem>("blinds_types");
    const docs = await col
      .find({ source: "centrshtor.ru", kind: "blinds_type" }, { projection: { _id: 0 } })
      .toArray();
    const items = docs ?? [];
    const matched = items.filter((it) => matchSubslug(subslug, it));
    return (matched.length ? matched : items).slice();
  } catch {
    return [];
  }
}

function pickWindow(images: string[], start: number, count: number): string[] {
  if (images.length === 0) return [];
  return Array.from({ length: count }).map((_, i) => images[(start + i) % images.length]);
}

async function pickPublicRomanImage(query: RegExp): Promise<string | null> {
  const folder = "Римские";
  const absDir = path.join(process.cwd(), "public", "catalog", folder);
  try {
    const entries = await readdir(absDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, "ru"));
    const match = files.find((f) => query.test(f));
    if (!match) return null;
    return encodeURI(`/catalog/${folder}/${match}`);
  } catch {
    return null;
  }
}

async function pickPublicRomanLastFiles(count: number): Promise<string[]> {
  const folder = "Римские";
  const absDir = path.join(process.cwd(), "public", "catalog", folder);
  try {
    const entries = await readdir(absDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, "ru"));
    const picked = files.slice(Math.max(0, files.length - count));
    return picked.map((f) => encodeURI(`/catalog/${folder}/${f}`));
  } catch {
    return [];
  }
}

const SUBCATS = [
  {
    subslug: "aluminum",
    title: "Алюминиевые жалюзи",
    description:
      "Практичное и долговечное решение для точной светорегуляции и защиты от солнца.",
    startIndex: 0,
  },
  {
    subslug: "wood",
    title: "Деревянные жалюзи",
    description:
      "Натуральная эстетика и контроль света — тёплый акцент, который собирает интерьер.",
    startIndex: 24,
  },
  {
    subslug: "pleated",
    title: "Жалюзи плиссе",
    description:
      "Для окон любой формы. Аккуратный силуэт, комфортная приватность и мягкий свет.",
    startIndex: 48,
  },
  {
    subslug: "roman",
    title: "Римские шторы",
    description:
      "Лаконичная геометрия и ткань в центре внимания — для спокойных интерьеров.",
    startIndex: 72,
  },
  {
    subslug: "roller",
    title: "Рулонные шторы",
    description:
      "Современное решение: минимализм, удобство и предсказуемый сценарий света.",
    startIndex: 96,
  },
] as const;

export default async function BlindsSubcatalogPage({
  params,
}: {
  params: Promise<{ subslug: string }>;
}) {
  const { subslug } = await params;
  const koenigSubcat = await getKoenigBlindsSubcatalog(subslug);
  const fallbackMeta = SUBCATS.find((s) => s.subslug === subslug) ?? SUBCATS[0];
  const meta = {
    subslug: fallbackMeta.subslug,
    title: koenigSubcat?.title || fallbackMeta.title,
    description: koenigSubcat?.description || fallbackMeta.description,
    startIndex: fallbackMeta.startIndex,
  };

  const images = await getBlindsImages();
  const blindsTypes = (koenigSubcat?.variants || []).length
    ? (koenigSubcat?.variants || []).map(
        (v): BlindsTypeItem => ({
          source: "koenigroom.ru",
          kind: "blinds_type",
          url: v.url,
          title: v.title,
          description: v.description,
          image: v.image,
          images: v.images,
        }),
      )
    : await getBlindsTypesForSubslug(subslug);
  const publicRomanHero = meta.subslug === "roman" ? await pickPublicRomanImage(/^Однорядные\.jpg$/i) : null;
  const publicRomanSingle = meta.subslug === "roman" ? await pickPublicRomanImage(/Однорядн/i) : null;
  const publicRomanDouble = meta.subslug === "roman" ? await pickPublicRomanImage(/Двухрядн/i) : null;
  const publicRomanClassicRaw = meta.subslug === "roman" ? await pickPublicRomanImage(/Классич/i) : null;
  const publicRomanClassic = publicRomanClassicRaw || publicRomanSingle;
  const publicRomanElectroMedia = meta.subslug === "roman" ? await pickPublicRomanLastFiles(4) : [];
  const publicRomanElectroCover = publicRomanElectroMedia.find((s) => /\.(jpe?g|png|webp)(\?.*)?$/i.test(s)) || null;

  const patchedBlindsTypes = meta.subslug === "roman"
    ? blindsTypes.map((it) => {
        const t = `${it.title || ""} ${it.description || ""}`.toLowerCase();
        if (/(электро|привод|мотор)/.test(t) && publicRomanElectroMedia.length) {
          const merged = Array.from(new Set([...(publicRomanElectroCover ? [publicRomanElectroCover] : []), ...publicRomanElectroMedia, ...(it.images || [])].filter(Boolean)));
          return {
            ...it,
            image: publicRomanElectroCover || it.image,
            images: merged,
          };
        }
        if (/классич/.test(t) && publicRomanClassic) return { ...it, image: publicRomanClassic };
        if (/двухряд/.test(t) && publicRomanDouble) return { ...it, image: publicRomanDouble };
        if (/одноряд/.test(t) && publicRomanSingle) return { ...it, image: publicRomanSingle };
        return it;
      })
    : blindsTypes;

  const hero = publicRomanHero || images[meta.startIndex % Math.max(1, images.length)] || "/catalog/blinds.jpg";
  const popularImages = pickWindow(images, meta.startIndex + 9, 7);
  const variantsIntro =
    koenigSubcat?.variantsIntro ||
    (subslug === "roman"
      ? "Римские шторы — ровное полотно ткани, разделённое на секции жёсткими горизонтальными планками. Поднимаются вверх как жалюзи — вручную или на электроприводе. Можно выбрать лёгкую или плотную ткань, добавить декоративный низ или ламбрекен — и получить интерьерный акцент без перегруза."
      : "Выберите вариант — откроется карточка с описанием и фотографиями.");

  const isRoman = meta.subslug === "roman";

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main>
        <section className="py-14 sm:py-18">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className={`lg:col-span-6 ${isRoman ? "text-center lg:text-left" : ""}`}>
                <div
                  className={`text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)] ${
                    isRoman ? "justify-center lg:justify-start" : ""
                  }`}
                >
                  ПОДКАТАЛОГ
                </div>
                <h1
                  className={`mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl ${
                    isRoman ? "sm:text-6xl" : ""
                  }`}
                >
                  {meta.title}
                </h1>
                <p
                  className={`mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg ${
                    isRoman ? "mx-auto max-w-2xl lg:mx-0" : "max-w-xl"
                  }`}
                >
                  {meta.description}
                </p>

                <div className={`mt-7 flex flex-wrap gap-3 ${isRoman ? "justify-center lg:justify-start" : ""}`}>
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                  >
                    Подобрать под мой интерьер
                  </a>
                  <Link
                    href="/catalog/blinds"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Все категории жалюзи
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
            <div className={`grid gap-6 lg:grid-cols-12 lg:items-end ${isRoman ? "text-center" : ""}`}>
              <div className={isRoman ? "lg:col-span-12" : "lg:col-span-8"}>
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                  ВАРИАНТЫ
                </div>
                <h2 className={`mt-4 font-semibold tracking-tight text-[color:var(--fg)] ${isRoman ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}>
                  Выберите систему
                </h2>
                <p className={`mt-4 text-sm leading-6 text-[color:var(--muted)] sm:text-base ${isRoman ? "mx-auto max-w-3xl" : "max-w-2xl"}`}>
                  {variantsIntro}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <BlindsTypesCatalog items={patchedBlindsTypes} showDescriptions={!isRoman} />
            </div>
          </Container>
        </section>

        <section className="pb-14 sm:pb-18">
          <Container>
            <div className="rounded-3xl border border-black/5 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.03] sm:p-10">
              <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                    ПОПУЛЯРНЫЕ ТОВАРЫ
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-3xl">
                    Часто выбирают вместе
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    Быстрый ряд для вдохновения. Нажмите — и мы рассчитаем вариант под ваши размеры.
                  </p>
                </div>
                <div className="lg:col-span-5 lg:flex lg:justify-end">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                  >
                    Рассчитать стоимость
                  </a>
                </div>
              </div>

              <div className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                {(popularImages.length > 0 ? popularImages : Array.from({ length: 7 }).map(() => "/catalog/blinds.jpg")).map(
                  (src, idx) => (
                    <a
                      key={`${src}-${idx}`}
                      href="#cta"
                      className="group relative h-[120px] w-[180px] shrink-0 snap-start overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
                      aria-label={`Популярный вариант ${idx + 1}`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="180px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.18),rgba(0,0,0,0.56))]" />
                      <div className="absolute bottom-3 left-3 text-xs font-semibold tracking-[0.20em] text-white/85">
                        #{idx + 1}
                      </div>
                    </a>
                  ),
                )}
              </div>
            </div>
          </Container>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
