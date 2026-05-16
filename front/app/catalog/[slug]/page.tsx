import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import path from "path";
import { readdir } from "fs/promises";
import { normalizeImageUrl } from "@/lib/encodeUrl";
import { Container } from "@/components/Container";
import { BlindsShowcase } from "@/components/BlindsShowcase";
import { BeddingWhyShowcase } from "@/components/BeddingWhyShowcase";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { PillowsWhyMasonry } from "@/components/PillowsWhyMasonry";
import { BeddingCatalog } from "@/components/BeddingCatalog";
import { BlindsTypesCatalog, type BlindsTypeItem } from "@/components/BlindsTypesCatalog";
import { RailsShowcase } from "@/components/RailsShowcase";
import { RailsVariantsCatalog } from "@/components/RailsVariantsCatalog";
import { RugsStyleCatalog } from "@/components/RugsStyleCatalog";
import { RugsWhyShowcase } from "@/components/RugsWhyShowcase";
import { CurtainTypesCatalog, CurtainTypesList, type CurtainTypeItem } from "@/components/CurtainTypesList";
import { CornicesCatalog, type CorniceItem } from "@/components/CornicesCatalog";
import { DecorCatalog, type DecorItem } from "@/components/DecorCatalog";
import { ContactButton } from "@/components/ContactButton";
import { CONTACTS, CATALOG_CATEGORIES } from "@/lib/constants";
import { getMongoClient } from "@/lib/mongo";


type Params = {
  params: Promise<{
    slug: string;
  }>;
};

// Dynamic rendering to show new images immediately
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return CATALOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  curtains: ["шторы Калининград", "пошив штор", "ткани для штор", "австрийские шторы", "французские шторы", "дизайн штор", "шторы на заказ"],
  blinds: ["жалюзи Калининград", "алюминиевые жалюзи", "деревянные жалюзи", "пластиковые жалюзи", "вертикальные жалюзи", "горизонтальные жалюзи"],
  rails: ["карнизы Калининград", "багетные карнизы", "профильные карнизы", "карнизы для штор", "металлические карнизы"],
  decor: ["декор интерьера", "фурнитура для штор", "подхваты для штор", "кисти для штор", "декор окна"],
  pillows: ["декоративные подушки", "подушки интерьерные", "подушки на диван", "дизайнерские подушки"],
  bedding: ["постельное бельё", "сатиновое бельё", "лен постельное бельё", "бельё на заказ"],
  rugs: ["ковры Калининград", "шерстяные ковры", "современные ковры", "ковры в интерьер"],
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = CATALOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};

  const keywords = CATEGORY_KEYWORDS[slug] || [];
  const url = `https://koenigroom.ru/catalog/${slug}`;

  return {
    title: `${category.title} — Koenig Room (Калининград)`,
    description: `${category.description}. Подбор и монтаж под ключ — Koenig Room, Калининград.`,
    keywords: [...keywords, "Koenig Room", "интерьер Калининград", "текстиль"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${category.title} — Koenig Room`,
      description: category.description,
      url,
      type: "website",
    },
  };
}

type PageCopy = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  kicker: string;
  bullets: { title: string; text: string }[];
  cases: { title: string; goal: string; result: string; imageSrc: string }[];
  faq: FaqItem[];
};

type FaqItem = { q: string; a: string };

type KoenigCatalogItem = {
  index: number;
  large_url: string;
  small_url?: string | null;
  alt?: string | null;
  group?: string | null;
};

type KoenigSubcategory = {
  index: number;
  url: string;
  slug: string;
  title: string;
  thumb_url?: string | null;
};

type KoenigCatalogDoc = {
  source?: string;
  slug: string;
  title?: string | null;
  subcategories?: KoenigSubcategory[];
  items?: KoenigCatalogItem[];
};

type CarpetItemDoc = {
  source?: string;
  kind?: string;
  style?: string;
  collection?: string;
  color?: string;
  url?: string;
  title?: string;
  priceText?: string;
  image?: string;
};

type BeddingItemDoc = {
  source?: string;
  kind?: string;
  variant?: string;
  image?: string;
  images?: string[];
  description?: string;
  priceText?: string;
};

type BedspreadsAndPillowsItemDoc = {
  source?: string;
  kind?: string;
  variant?: string;
  image?: string;
  images?: string[];
  description?: string;
  priceText?: string;
};

type DecorItemDoc = {
  source?: string;
  kind?: string;
  title?: string;
  description?: string;
  image?: string;
  images?: string[];
};

async function getBeddingItems(): Promise<BeddingItemDoc[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<BeddingItemDoc>("bedding_items");
    const docs = await col
      .find({ source: "koenig_room", kind: "bedding_item" }, { projection: { _id: 0 } })
      .toArray();
    return docs ?? [];
  } catch {
    return [];
  }
}

async function getBedspreadsAndPillowsItems(): Promise<BedspreadsAndPillowsItemDoc[]> {
  try {
    const client = await getMongoClient();
    const db = client.db("koenig");
    const col = db.collection<BedspreadsAndPillowsItemDoc>("bedspreads_and_pillows");
    const docs = await col.find({ source: "koenig_room", kind: "bedspreads_and_pillows_item" }, { projection: { _id: 0 } }).toArray();
    return docs ?? [];
  } catch {
    return [];
  }
}

async function getDecorItems(): Promise<DecorItemDoc[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<DecorItemDoc>("decor_items");
    const docs = await col
      .find({ source: "koenig_room", kind: "decor_item" }, { projection: { _id: 0 } })
      .toArray();
    return docs ?? [];
  } catch {
    return [];
  }
}

function dedupePathSegments(url: string): string {
  if (!url || url.startsWith("http")) return url;
  const parts = url.split("/");
  const deduped: string[] = [];
  for (const part of parts) {
    if (part !== deduped[deduped.length - 1]) {
      deduped.push(part);
    }
  }
  return deduped.join("/");
}

async function getCurtainTypes(): Promise<CurtainTypeItem[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<CurtainTypeItem>("curtain_types");
    const docs = await col
      .find({ source: "koenig_room", kind: "curtain_type" }, { projection: { _id: 0 } })
      .toArray();
    // Clean duplicated path segments from MongoDB data
    const cleaned = (docs ?? []).map((doc) => {
      const originalImage = doc.image;
      const cleanedImage = doc.image ? dedupePathSegments(doc.image) : doc.image;
      if (originalImage && originalImage !== cleanedImage) {
        console.log(`[DEDUPE] ${originalImage} -> ${cleanedImage}`);
      }
      return {
        ...doc,
        image: cleanedImage,
        images: doc.images?.map(dedupePathSegments),
      };
    });
    return cleaned;
  } catch {
    return [];
  }
}

async function getBlindsTypes(): Promise<BlindsTypeItem[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<BlindsTypeItem>("blinds_types");
    const docs = await col
      .find({ source: "koenig_room", kind: "blinds_type" }, { projection: { _id: 0 } })
      .toArray();
    // Clean duplicated path segments from MongoDB data
    return (docs ?? []).map((doc) => ({
      ...doc,
      image: doc.image ? dedupePathSegments(doc.image) : doc.image,
      images: doc.images?.map(dedupePathSegments),
    }));
  } catch {
    return [];
  }
}

async function getCornicesItems(): Promise<CorniceItem[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<CorniceItem>("cornices");
    const docs = await col
      .find(
        { source: "koenig_room", kind: { $in: ["cornice_collection", "cornice_item"] } },
        { projection: { _id: 0 } },
      )
      .limit(500)
      .toArray();
    // Clean duplicated path segments from MongoDB data
    return (docs ?? []).map((doc) => ({
      ...doc,
      image: doc.image ? dedupePathSegments(doc.image) : doc.image,
      images: doc.images?.map(dedupePathSegments),
    }));
  } catch {
    return [];
  }
}

const RAILS_SUBCATEGORIES = [
  { subslug: "scaglioni", title: "Scaglioni" },
  { subslug: "winart", title: "Winart" },
  { subslug: "windeco", title: "Windeco" },
] as const;

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

async function getKoenigCatalogDoc(sourceSlug: string): Promise<KoenigCatalogDoc | null> {
  try {
    const client = await getMongoClient();
    const db = client.db("koenig");
    const col = db.collection<KoenigCatalogDoc>("catalog_items");
    const doc = await col.findOne({ source: "koenigroom.ru", slug: sourceSlug }, {
      projection: { _id: 0 },
    });
    return doc ?? null;
  } catch {
    return null;
  }
}

function pickKoenigImages(doc: KoenigCatalogDoc | null): string[] {
  const items = doc?.items ?? [];
  return items
    .slice()
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((it) => dedupePathSegments(normalizeImageUrl(it.large_url)))
    .filter((url) => url.length > 0);
}

function injectImages<T extends { imageSrc: string }>(cards: T[], images: string[]): T[] {
  if (images.length === 0) return cards;
  return cards.map((c, idx) => ({ ...c, imageSrc: images[idx % images.length] }));
}

function pickHeroImageFromDb(
  slug: string,
  images: string[],
  railsSubcatDocs: Array<KoenigCatalogDoc | null>,
  fallback: string,
): string {
  if (images.length > 0) return images[0];
  if (slug === "rails") {
    for (const d of railsSubcatDocs) {
      const first = pickKoenigImages(d)[0];
      if (first) return first;
    }
  }
  return fallback;
}

function injectCaseImages(cases: PageCopy["cases"], images: string[]): PageCopy["cases"] {
  if (images.length === 0) return cases;
  return cases.map((c, idx) => ({ ...c, imageSrc: images[idx % images.length] }));
}

async function pickPublicCatalogCover(appSlug: string): Promise<string | null> {
  // Map slugs to actual folder names in public/catalog/
  const folderBySlug: Record<string, string> = {
    curtains: "1.shtory-i-tkani",
    blinds: "2.zhalyuzi",
    roman: "3.rimskie",
    rails: "4.karnizy",
    decor: "5.-dekor-furnitura",
    rugs: "6.-kovry",
    bedding: "7.postelnoe-bele",
    pillows: "8.dekorativnye-podushki-pokryvala",
  };

  const folder = folderBySlug[appSlug] ?? appSlug;
  const absDir = path.join(process.cwd(), "public", "catalog", folder);
  try {
    const entries = await readdir(absDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.endsWith('.webp'))
      .map((e) => e.name)
      .filter((name) => !name.match(/^\d{3,5}\.webp$/)); // Skip small numbered thumbnails
    files.sort((a, b) => b.length - a.length); // Prefer longer names (likely real photos vs thumbnails)
    const picked = files[0];
    if (!picked) return null;
    return `/catalog/${folder}/${picked}`;
  } catch {
    return null;
  }
}

const CURTAINS_VALUES = [
  "Свет",
  "Фактура",
  "Высота",
  "Складка",
  "Тишина",
  "Blackout",
  "Лён",
  "Бархат",
  "Подкладка",
  "Чистый монтаж",
];

const BLINDS_VALUES = [
  "Геометрия",
  "Свет",
  "Приватность",
  "Блики",
  "Blackout",
  "Кухня",
  "Кабинет",
  "Тихий ход",
  "Монтаж",
  "Аккуратно",
];

const CURTAINS_CATALOG = [
  {
    title: "Портьеры",
    subtitle: "Фактура и объём",
    text: "Дают глубину и “собирают” комнату. Подбираем плотность и посадку под мебель и свет.",
    imageSrc: "/catalog/1.\u0428\u0442\u043e\u0440\u044b \u0438 \u0442\u043a\u0430\u043d\u0438/1.1.\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043a\u0438\u0435/\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043a\u0438\u0435 \u043d\u0430 \u0438\u043a\u043e\u043d\u043a\u0443.webp",
  },
  {
    title: "Тюль и вуаль",
    subtitle: "Мягкий дневной свет",
    text: "Снимают контраст и делают свет спокойнее — без ощущения “витрины”.",
    imageSrc: "/catalog/5. \u0414\u0435\u043a\u043e\u0440, \u0444\u0443\u0440\u043d\u0438\u0442\u0443\u0440\u0430/50007.webp",
  },
  {
    title: "Blackout",
    subtitle: "Сон без бликов",
    text: "Для спальни и гостевых: затемнение, приватность, ровные вертикали на стене.",
    imageSrc: "/2foto_dark.webp",
  },
  {
    title: "Лён и натуральные фактуры",
    subtitle: "Чистый премиум",
    text: "Смотрятся дороже в естественном свете. Хороши для спокойных интерьеров.",
    imageSrc: "/hero.webp",
  },
  {
    title: "Два слоя",
    subtitle: "Сценарии дня",
    text: "Днём — лёгкость и воздух, вечером — приватность. Управление светом без компромиссов.",
    imageSrc: "/hero2.webp",
  },
  {
    title: "Карнизы и фурнитура",
    subtitle: "Детали решают",
    text: "Наконечники, подхваты, ленты — собираем комплект так, чтобы выглядело “дорого”.",
    imageSrc: "/catalog/4.\u041a\u0430\u0440\u043d\u0438\u0437\u044b/\u0411\u0430\u0433\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u043d\u0438\u0437\u044b/1.webp",
  },
];

const PILLOWS_VALUES = [
  "Палитра",
  "Фактура",
  "Баланс",
  "Композиция",
  "Акцент",
  "Отель",
  "Без хаоса",
  "Слои",
  "Уют",
  "Собранно",
];

const PILLOWS_CATALOG = [
  {
    title: "Подушки",
    subtitle: "Композиция",
    text: "Подбираем размеры и количество: чтобы диван/кровать выглядели как в шоуруме — без перегруза.",
    imageSrc: "/catalog/8.\u0414\u0435\u043a\u043e\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u043f\u043e\u0434\u0443\u0448\u043a\u0438-\u043f\u043e\u043a\u0440\u044b\u0432\u0430\u043b\u0430/00509_089_\u0434\u043e\u043f_@maxiimov.webp",
  },
  {
    title: "Покрывала",
    subtitle: "Собранный вид",
    text: "Один слой, который моментально делает спальню “дороже” и аккуратнее.",
    imageSrc: "/2foto_dark.webp",
  },
  {
    title: "Пледы",
    subtitle: "Тепло и фактура",
    text: "Добавляем тактильность и уют, но держим стиль — чтобы выглядело современно.",
    imageSrc: "/hero.webp",
  },
  {
    title: "Нейтральная палитра",
    subtitle: "Цвет без риска",
    text: "Спокойные оттенки + разные фактуры дают “тихий премиум” без ярких принтов.",
    imageSrc: "/catalog/1.\u0428\u0442\u043e\u0440\u044b \u0438 \u0442\u043a\u0430\u043d\u0438/1.1.\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043a\u0438\u0435/\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043a\u0438\u0435 \u043d\u0430 \u0438\u043a\u043e\u043d\u043a\u0443.webp",
  },
  {
    title: "Акцент",
    subtitle: "Один сильный",
    text: "Добавляем один акцентный цвет и повторяем его 2 раза — так выглядит дорого и логично.",
    imageSrc: "/catalog/5. \u0414\u0435\u043a\u043e\u0440, \u0444\u0443\u0440\u043d\u0438\u0442\u0443\u0440\u0430/50007.webp",
  },
  {
    title: "В связке",
    subtitle: "Со шторами/ковром",
    text: "Собираем текстиль как комплект: чтобы всё “разговаривало” между собой.",
    imageSrc: "/catalog/4.\u041a\u0430\u0440\u043d\u0438\u0437\u044b/\u0411\u0430\u0433\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u043d\u0438\u0437\u044b/1.webp",
  },
];

const BEDDING_VALUES = [
  "Сон",
  "Прохлада",
  "Мягкость",
  "Тактильность",
  "Отельный вид",
  "Без логотипов",
  "Уход",
  "Плотность",
  "Палитра",
  "Комплект",
];

const BEDDING_CATALOG = [
  {
    title: "Сатин / гладкие",
    subtitle: "Свежо и чисто",
    text: "Когда важно “не жарко” и хочется гостиничного ощущения: гладко, аккуратно, спокойно.",
    imageSrc: "/2foto_dark.webp",
  },
  {
    title: "Мягкие фактуры",
    subtitle: "Уют и расслабление",
    text: "Если хочется мягче и спокойнее: фактура, которая визуально и тактильно делает спальню дороже.",
    imageSrc: "/2foto_dark.webp",
  },
  {
    title: "Практичные",
    subtitle: "Без лишней возни",
    text: "Под регулярную стирку, детей/питомцев и быстрый порядок — чтобы красиво каждый день.",
    imageSrc: "/catalog/8.\u0414\u0435\u043a\u043e\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u043f\u043e\u0434\u0443\u0448\u043a\u0438-\u043f\u043e\u043a\u0440\u044b\u0432\u0430\u043b\u0430/00509_089_\u0434\u043e\u043f_@maxiimov.webp",
  },
  {
    title: "Нейтральная палитра",
    subtitle: "Цвет без риска",
    text: "Подбираем спокойные оттенки под стены/шторы — спальня выглядит цельно и “дорого”.",
    imageSrc: "/catalog/1.\u0428\u0442\u043e\u0440\u044b \u0438 \u0442\u043a\u0430\u043d\u0438/1.1.\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043a\u0438\u0435/\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043a\u0438\u0435 \u043d\u0430 \u0438\u043a\u043e\u043d\u043a\u0443.webp",
  },
  {
    title: "Комплект",
    subtitle: "Собранный вид",
    text: "Наволочки, пододеяльник, простынь — чтобы всё выглядело как единая композиция.",
    imageSrc: "/catalog/5. \u0414\u0435\u043a\u043e\u0440, \u0444\u0443\u0440\u043d\u0438\u0442\u0443\u0440\u0430/50007.webp",
  },
  {
    title: "В подарок",
    subtitle: "Беспроигрышно",
    text: "Собираем универсальный премиум: приятная фактура, спокойный цвет, понятный уход.",
    imageSrc: "/hero.webp",
  },
];

const RUGS_VALUES = [
  "Акустика",
  "Тепло",
  "Масштаб",
  "Фактура",
  "Зонирование",
  "Уход",
  "Питомцы",
  "Дети",
  "Цвет",
  "Комфорт",
];

const RUGS_CATALOG = [
  {
    title: "Гостиная",
    subtitle: "Собрать зону",
    text: "Правильный размер и посадка под мебель: комната выглядит цельной и спокойной.",
    imageSrc: "/hero.webp",
  },
  {
    title: "Спальня",
    subtitle: "Тепло утром",
    text: "Тактильность, мягкость и тишина — чтобы день начинался комфортнее.",
    imageSrc: "/2foto_dark.webp",
  },
  {
    title: "Детская",
    subtitle: "Безопасно и практично",
    text: "Подбираем ворс и состав под игры, уборку и ежедневную нагрузку.",
    imageSrc: "/catalog/8.\u0414\u0435\u043a\u043e\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u043f\u043e\u0434\u0443\u0448\u043a\u0438-\u043f\u043e\u043a\u0440\u044b\u0432\u0430\u043b\u0430/00509_089_\u0434\u043e\u043f_@maxiimov.webp",
  },
  {
    title: "Фактура",
    subtitle: "Материальность",
    text: "Букле, шерсть, короткий ворс — чтобы “дорого” читалось в вашем свете.",
    imageSrc: "/catalog/5. \u0414\u0435\u043a\u043e\u0440, \u0444\u0443\u0440\u043d\u0438\u0442\u0443\u0440\u0430/50007.webp",
  },
  {
    title: "Нейтральная палитра",
    subtitle: "Цвет без риска",
    text: "Подбираем оттенок так, чтобы он связал мебель и текстиль, а не спорил с ними.",
    imageSrc: "/catalog/1.\u0428\u0442\u043e\u0440\u044b \u0438 \u0442\u043a\u0430\u043d\u0438/1.1.\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043a\u0438\u0435/\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043a\u0438\u0435 \u043d\u0430 \u0438\u043a\u043e\u043d\u043a\u0443.webp",
  },
  {
    title: "Уход",
    subtitle: "Под ваш ритм",
    text: "Сразу учитываем детей/питомцев и объясняем, как ухаживать — без сюрпризов.",
    imageSrc: "/catalog/4.\u041a\u0430\u0440\u043d\u0438\u0437\u044b/\u0411\u0430\u0433\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u043d\u0438\u0437\u044b/1.webp",
  },
];

const DECOR_VALUES = [
  "Металл",
  "Кисти",
  "Подхваты",
  "Лента",
  "Карниз",
  "Тон",
  "Фактура",
  "Сдержанно",
  "Акцент",
  "Комплект",
];

const DECOR_CATALOG = [
  {
    title: "Кисти и подхваты",
    subtitle: "Аккуратная форма",
    text: "Дают композицию и “держат” складку. Подбираем под металл и стиль комнаты.",
    imageSrc: "/catalog/5.Furnitura/2.Kisty i podhvaty/3c7a83f8-f03a-11ef-a8ae-3497f65a19e0_1.png",
  },
  {
    title: "Бахрома",
    subtitle: "Тактильный премиум",
    text: "Когда нужен мягкий, но дорогой акцент. Главное — пропорции и один сильный штрих.",
    imageSrc: "/catalog/5.Furnitura/3.bahroma/71661d6857f3e74a366c65c6b1ee38f9.jpg",
  },
  {
    title: "Тесьма",
    subtitle: "Сборка складки",
    text: "Форма складки и высота посадки: то, что отличает “просто шторы” от комплекта.",
    imageSrc: "/catalog/5.Furnitura/4.Tesmya/54ffa9d94c06dc588c85db948a3fe240.jpg",
  },
];

const ROMAN_VALUES = [
  "Геометрия",
  "Практично",
  "Кухня",
  "Кабинет",
  "Soft",
  "Blackout",
  "Ткань",
  "Посадка",
  "Механика",
  "Чистый монтаж",
];

const ROMAN_CATALOG = [
  {
    title: "Light filtering",
    subtitle: "Мягкий дневной свет",
    text: "Снимают контраст и блики, оставляя воздух. Идеально для кухни и гостиной.",
    imageSrc: "/catalog/3.\u0420\u0438\u043c\u0441\u043a\u0438\u0435/\u041d\u0430 \u044d\u043b\u0435\u043a\u0442\u0440\u043e\u043f\u0440\u0438\u0432\u043e\u0434\u0435/\u0424\u043e\u0442\u043e \u043d\u0430 \u0438\u043a\u043e\u043d\u043a\u0443 .webp",
  },
  {
    title: "Screen / anti-glare",
    subtitle: "Комфорт для экрана",
    text: "Для кабинета и ТВ: меньше бликов, стабильнее свет, интерьер выглядит спокойнее.",
    imageSrc: "/catalog/2.\u0416\u0430\u043b\u044e\u0437\u0438/\u0410\u043b\u043b\u044e\u043c\u0438\u043d\u0438\u0435\u0432\u044b\u0435/\u0424\u043e\u0442\u043e \u043d\u0430 \u0438\u043a\u043e\u043d\u043a\u0443 1 .webp",
  },
  {
    title: "Blackout",
    subtitle: "Сон без света",
    text: "Для спальни и детской: затемнение, приватность, аккуратная геометрия без тяжёлых штор.",
    imageSrc: "/2foto_dark.webp",
  },
  {
    title: "Натуральные фактуры",
    subtitle: "Чистый премиум",
    text: "Лён, хлопок, спокойные оттенки. Ровный объём и тактильность — без перегруза.",
    imageSrc: "/hero2.webp",
  },
  {
    title: "Кассетные системы",
    subtitle: "Аккуратно на раме",
    text: "Когда важно, чтобы всё выглядело встроенным и максимально чистым по линии окна.",
    imageSrc: "/catalog/5. \u0414\u0435\u043a\u043e\u0440, \u0444\u0443\u0440\u043d\u0438\u0442\u0443\u0440\u0430/50007.webp",
  },
  {
    title: "Управление",
    subtitle: "Цепь / мотор",
    text: "Подберём механику под сценарий: удобно каждый день, тихий ход, стабильная посадка.",
    imageSrc: "/hero.webp",
  },
];

const RAILS_VALUES = [
  "Линия",
  "Материал",
  "Металл",
  "Наконечники",
  "Вылет",
  "Высота",
  "Крепёж",
  "Эркер",
  "Потолок",
  "Чистый монтаж",
];

const RAILS_CATALOG = [
  {
    title: "Однорядные",
    subtitle: "Минимализм",
    text: "Чистая линия и аккуратный вылет под вашу ткань. Хорошо смотрится в современных интерьерах.",
    imageSrc: "/catalog/4.karnizy/bagetnye-karnizy/1.webp",
  },
  {
    title: "Двухрядные",
    subtitle: "Тюль + портьера",
    text: "Правильная глубина и расстояние между рядами, чтобы слои не спорили и всё двигалось легко.",
    imageSrc: "/catalog/1.\u0428\u0442\u043e\u0440\u044b \u0438 \u0442\u043a\u0430\u043d\u0438/1.1.\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043a\u0438\u0435/\u0410\u0432\u0441\u0442\u0440\u0438\u0439\u0441\u043a\u0438\u0435 \u043d\u0430 \u0438\u043a\u043e\u043d\u043a\u0443.webp",
  },
  {
    title: "Потолочные",
    subtitle: "Визуальная высота",
    text: "Поднимают пропорции стены и помогают “вытянуть” окно. Подбираем крепёж под потолок.",
    imageSrc: "/catalog/4.\u041a\u0430\u0440\u043d\u0438\u0437\u044b/\u0411\u0430\u0433\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u043d\u0438\u0437\u044b/1.webp",
  },
  {
    title: "С наконечниками",
    subtitle: "Акцент",
    text: "Металл, форма, пропорции — под стиль комнаты и вашу фурнитуру. Дают эффект “дорого”.",
    imageSrc: "/catalog/5. \u0414\u0435\u043a\u043e\u0440, \u0444\u0443\u0440\u043d\u0438\u0442\u0443\u0440\u0430/50007.webp",
  },
  {
    title: "Эркеры и углы",
    subtitle: "Сложная геометрия",
    text: "Собираем линию без “ломаного” вида: повороты, соединители, крепёж — всё заранее просчитываем.",
    imageSrc: "/hero.webp",
  },
  {
    title: "Комбо-комплект",
    subtitle: "Сразу под ткань",
    text: "Подбираем карниз, ленту/крючки и ткань вместе, чтобы посадка и линия совпали.",
    imageSrc: "/2foto_dark.webp",
  },
];

const COPY_BY_SLUG: Record<string, PageCopy> = {
  curtains: {
    kicker: "ШТОРЫ",
    heroTitle: "Шторы, которые гармонично сочетаются с интерьером как визуально, так и функционально",
    heroSubtitle:
      "Подберём ткань под комнату и окна, рассчитаем посадку, сошьём и установим. Аккуратно, без лишних слоёв и случайных решений.",
    heroImage: "/main_page.webp",
    bullets: [
      { title: "Свет", text: "Плотность и подкладка — чтобы было комфортно днём и вечером." },
      { title: "Высота", text: "Правильная длина и складка дают ощущение “дорого”." },
      { title: "Сборка", text: "Карнизы, ленты, подхваты — соберём всё в единый стиль." },
    ],
    cases: [
      {
        title: "Спальня",
        goal: "Сон без бликов и света с улицы.",
        result: "Тишина, затемнение и визуально лёгкая стена — без тяжёлых штор.",
        imageSrc: "/primery/spalnya-.webp",
      },
      {
        title: "Гостиная / панорамные окна",
        goal: "Сохранить воздух и сделать красиво в кадре.",
        result: "Мягкий свет, ровная геометрия, интерьер смотрится собранно.",
        imageSrc: "/primery/gostinaya-panoramnye-okna.webp",
      },
      {
        title: "Кухня-гостиная",
        goal: "Чтобы не пачкалось и легко управлялось.",
        result: "Практичная ткань + понятная механика — без лишней “декорации”.",
        imageSrc: "/primery/kuhnya-gostinaya-.webp",
      },
    ],
    faq: [
      {
        q: "Как быстро понять, какая ткань подойдёт?",
        a: "Пришлите фото окна и комнаты + цель (blackout/рассеять/приватность). Мы предложим 2–3 ткани с объяснением простыми словами.",
      },
      {
        q: "Это будет выглядеть “дорого”, а не “как у всех”?",
        a: "Да: премиум‑эффект дают высота, складка, правильная ширина и аккуратная фурнитура — мы это контролируем.",
      },
      {
        q: "Сколько времени занимает пошив и установка?",
        a: "Обычно несколько дней на пошив + один визит на монтаж. Точные сроки зависят от ткани и карнизов.",
      },
      {
        q: "Можно ли без лишних слоёв?",
        a: "Да. Часто достаточно 1–2 слоёв, если правильно выбрать плотность и фактуру.",
      },
    ],
  },
  blinds: {
    kicker: "ЖАЛЮЗИ",
    heroTitle: "Свет под контролем — без тяжёлых штор",
    heroSubtitle:
      "Подберём жалюзи под сценарий комнаты: блики, приватность, перегрев. Тихий ход, чистый монтаж, точная геометрия.",
    heroImage: "/catalog/2.zhalyuzi/derevyannye/SVM05621.webp",
    bullets: [
      {
        title: "Снять блики",
        text: "Комфортный свет для кухни, кабинета и ТВ — без раздражающего солнца.",
      },
      {
        title: "Добавить приватность",
        text: "Закрыто от взглядов вечером — при этом днём сохраняется свет и ощущение воздуха.",
      },
      {
        title: "Сделать аккуратно",
        text: "Ровные линии, чистые крепления и точные размеры — чтобы выглядело дорого.",
      },
    ],
    cases: [
      {
        title: "Кухня / южная сторона",
        goal: "Убрать перегрев и блики на столешнице — без ощущения темноты.",
        result: "Глаза не устают, комната выглядит спокойнее и дороже.",
        imageSrc: "/catalog/2.zhalyuzi/allyuminievye/foto-na-ikonku-1-.webp",
      },
      {
        title: "Кабинет / рабочее место",
        goal: "Сделать свет комфортным для монитора и встреч.",
        result: "Стабильный свет, аккуратные линии, ощущение порядка.",
        imageSrc: "/catalog/2.zhalyuzi/rimskie/3072x2304_0xac120003_10276485311610530759.webp",
      },
      {
        title: "Первый этаж",
        goal: "Приватность вечером, но без плотных штор.",
        result: "Комфорт и безопасность — визуально минималистично.",
        imageSrc: "/catalog/2.zhalyuzi/rimskie/IMG_20251121_172456_846.webp",
      },
    ],
    faq: [
      {
        q: "С чего начать подбор жалюзи?",
        a: "Напишите в Telegram: комната + цель (блики/приватность/blackout) и 1–2 фото окна. Мы предложим 2–3 варианта и объясним разницу простыми словами.",
      },
      {
        q: "Какие лучше для кухни?",
        a: "Обычно — алюминиевые или рулонные, потому что проще в уходе. Но лучше уточнить: сторона света и режим готовки.",
      },
      {
        q: "Будет ли это выглядеть “офисно”?",
        a: "Нет, если правильно выбрать фактуру/цвет и поставить аккуратно. Премиум‑ощущение здесь дают чистые линии, правильная геометрия и монтаж.",
      },
      {
        q: "Сколько времени занимает установка?",
        a: "Как правило — один визит. Точное время зависит от количества окон и типа системы.",
      },
    ],
  },
  roman: {
    kicker: "РИМСКИЕ ШТОРЫ",
    heroTitle: "Римские шторы — аккуратная геометрия без перегруза",
    heroSubtitle:
      "Идеальны для кухни, кабинета и минималистичных интерьеров. Подберём ткань, уровень прозрачности и посадку на окно.",
    heroImage: "/catalog/roman.webp",
    bullets: [
      { title: "Чисто", text: "Собирают окно в аккуратный объём — без “слоёв ради слоёв”." },
      { title: "Практично", text: "Удобно на кухне: ткань проще обслуживать, ничего не мешает." },
      { title: "Точно", text: "Подбор прозрачности под сценарий света — от soft до blackout." },
    ],
    cases: [
      {
        title: "Кухня",
        goal: "Снять блики и оставить дневной свет.",
        result: "Комфортно готовить, интерьер смотрится дороже и спокойнее.",
        imageSrc: "/catalog/3.rimskie/na-elektroprivode/foto-na-ikonku-.webp",
      },
      {
        title: "Кабинет",
        goal: "Стабильный свет для монитора.",
        result: "Нет бликов — работать проще, вид окна остаётся чистым.",
        imageSrc: "/catalog/2.zhalyuzi/allyuminievye/foto-na-ikonku-1-.webp",
      },
      {
        title: "Детская",
        goal: "Уют и мягкое затемнение.",
        result: "Тёплее по ощущению, чем жалюзи, и проще в управлении.",
        imageSrc: "/2foto_dark.webp",
      },
    ],
    faq: [
      {
        q: "Чем римские лучше рулонных?",
        a: "Римские дают более “тканевый”, интерьерный объём и выглядят мягче, при этом остаются минималистичными.",
      },
      {
        q: "Можно ли сделать blackout?",
        a: "Да, подберём ткань и подкладку под нужную степень затемнения.",
      },
      {
        q: "Подходят ли для кухни?",
        a: "Да — это один из лучших вариантов по практичности и виду.",
      },
      {
        q: "Какой нужен замер?",
        a: "Достаточно фото окна и размеры — дальше уточним посадку и крепление.",
      },
    ],
  },
  rails: {
    kicker: "КАРНИЗЫ",
    heroTitle: "Декоративный карниз — тот самый “акцент”, который собирает окно",
    heroSubtitle:
      "Подберём карниз и наконечники под стиль комнаты: от спокойной классики до современного минимализма. С монтажом и чистой геометрией.",
    heroImage: "/catalog/carnis.webp",
    bullets: [
      { title: "Линия", text: "Карниз задаёт архитектуру окна и делает композицию цельной." },
      { title: "Детали", text: "Наконечники и крепёж — мелочи, которые дают “дорого”." },
      { title: "Монтаж", text: "Ровно, крепко, без сюрпризов — чтобы не переделывать." },
    ],
    cases: [
      {
        title: "Гостиная",
        goal: "Сделать окно главным элементом стены.",
        result: "Карниз подчёркивает высоту и собирает интерьер.",
        imageSrc: "/catalog/4.karnizy/bagetnye-karnizy/1.webp",
      },
      {
        title: "Спальня",
        goal: "Спокойная геометрия без лишнего декора.",
        result: "Чистая линия, “дорого” без заметности.",
        imageSrc: "/2foto_dark.webp",
      },
      {
        title: "Классика / неоклассика",
        goal: "Поддержать стиль и фурнитуру.",
        result: "Наконечники и крепёж попадают в тон и материал.",
        imageSrc: "/catalog/5.-dekor-furnitura/50007.webp",
      },
    ],
    faq: [
      {
        q: "Карниз лучше брать до выбора ткани или после?",
        a: "Можно и так и так, но идеальный вариант — выбирать вместе, чтобы линия и посадка совпали.",
      },
      {
        q: "Сможете смонтировать на сложные стены?",
        a: "Да, подбираем крепёж и решение под конкретную стену/потолок.",
      },
      {
        q: "Какая длина/вылет правильные?",
        a: "Зависит от ширины окна и “пакета” ткани. Подскажем по фото и замерам.",
      },
      {
        q: "Будет ли это выглядеть аккуратно?",
        a: "Да — чистота монтажа и ровность линии у нас в приоритете.",
      },
    ],
  },
  decor: {
    kicker: "АКСЕССУАРЫ",
    heroTitle: "Декор и фурнитура - финальный штрих, который показывает премиум",
    heroSubtitle:
      "Декор и фурнитура создают ощущение целостности и завершенности, а порой и сами становятся главными героями в интерьере.",
    heroImage: "/фурнитура .jpg",
    bullets: [
      { title: "Цельность", text: "Фурнитура связывает ткань, карниз и мебель в один тон." },
      { title: "Тактильность", text: "Фактура и материал ощущаются “дорого” даже без слов." },
      { title: "Акцент", text: "Добавляем акцент там, где он реально нужен — без перегруза." },
    ],
    cases: [
      {
        title: "Кисточки",
        goal: "Сделать мягче и спокойнее.",
        result: "Тёплые фактуры и тактильные детали “успокаивают” интерьер.",
        imageSrc: "/catalog/5.-dekor-furnitura/80003.png",
      },
      {
        title: "Наконечники",
        goal: "Чтобы всё выглядело как комплект.",
        result: "Подбираем металл/цвета — чтобы попадало “в тон”.",
        imageSrc: "/catalog/4.karnizy/latunnye-karnizy/kristallo/3-.webp",
      },
    ],
    faq: [
      {
        q: "Можно подобрать аксессуары к моим шторам?",
        a: "Да. Пришлите фото ткани и карниза — предложим 2–3 варианта, которые точно подойдут.",
      },
      {
        q: "Это не будет “слишком”?",
        a: "Нет. Мы подбираем аккуратно: один сильный акцент вместо множества мелких.",
      },
      {
        q: "Как понять цвет/металл?",
        a: "Выбираем оттенок глядя на фурнитуру мебели и светильники.",
      },
      {
        q: "Можно ли сделать быстро?",
        a: "Часто — да, особенно если аксессуары в наличии.",
      },
    ],
  },
  rugs: {
    kicker: "КОВРЫ",
    heroTitle: "Ковер — самый быстрый способ сделать комнату тише, теплее и дороже",
    heroSubtitle:
      "Подберём размер, фактуру и цвет под мебель и свет. Чтобы ковер не спорил с интерьером, а собирал его.",
    heroImage: "/image1.webp",
    bullets: [
      { title: "Тепло", text: "По ощущениям и по акустике: меньше эха, больше уюта." },
      { title: "Масштаб", text: "Правильный размер делает пространство пропорциональным." },
      { title: "Цвет", text: "Собираем палитру комнаты: ковер связывает диван, стены и текстиль." },
    ],
    cases: [
      {
        title: "Гостиная",
        goal: "Собрать зону дивана.",
        result: "Комната выглядит цельной, визуально “дороже”.",
        imageSrc: "/vendor/koenigroom/kovry/large/_53FB6520-08C9-8BB8-2CD4-6316E6624070_.webp",
      },
      {
        title: "Спальня",
        goal: "Тепло под ногами утром.",
        result: "Комфорт каждый день + мягкая акустика.",
        imageSrc: "/vendor/koenigroom/kovry/large/_9C7954D1-CAA3-9A8A-5959-DF339E4CAEA5_.webp",
      },
      {
        title: "Детская",
        goal: "Практично и безопасно.",
        result: "Фактура приятная, уход понятный.",
        imageSrc: "/vendor/koenigroom/kovry/large/_D49124E5-525A-1054-FB45-58D61F79DFCE_.webp",
      },
    ],
    faq: [
      {
        q: "Как выбрать размер?",
        a: "Пришлите фото комнаты и примерные габариты мебели — предложим 1–2 правильные схемы.",
      },
      {
        q: "Как понять, что ковер не будет “мелким”?",
        a: "Мы ориентируемся на диван/кровать и оставляем правильные поля по периметру.",
      },
      {
        q: "Можно ли подобрать цвет под шторы?",
        a: "Да — подберём в связке, чтобы палитра была цельной.",
      },
      {
        q: "Уход сложный?",
        a: "Уход простой, наши ковры можно стирать",
      },
    ],
  },
  bedding: {
    kicker: "ПОСТЕЛЬНОЕ",
    heroTitle: "Финальный штрих",
    heroSubtitle:
      "Один необычный материал способен преобразить комнату и придать ей ощущение роскоши.",
    heroImage: "/банер покрывала.webp",
    bullets: [
      { title: "Палитра", text: "Возьмите нейтральный цвет, добавьте к нему один тёплый оттенок и объедините их связующим тоном." },
      { title: "Фактуры", text: "Подушки из букле, льна и велюра обладают такой объёмной фактурой, что их рельеф заметен даже в пасмурную погоду." },
      { title: "Баланс", text: "Количество и размер подушек — чтобы выглядело аккуратно." },
    ],
    cases: [
      {
        title: "Спальня",
        goal: "Комфорт без компромиссов.",
        result: "Сон спокойнее, ощущение “дорого” каждый день.",
        imageSrc: "/catalog/7.postelnoe-bele/SVM05681.webp",
      },
      {
        title: "Гостевая",
        goal: "Чтобы гостям было приятно.",
        result: "Впечатление как в хорошем отеле.",
        imageSrc: "/catalog/7.postelnoe-bele/144a5631-.webp",
      },
      {
        title: "Комплект под интерьер",
        goal: "Попасть в цвет и фактуру комнаты.",
        result: "Спальня выглядит собранно и спокойно.",
        imageSrc: "/catalog/7.postelnoe-bele/dsc08092-.webp",
      },
    ],
    faq: [
      {
        q: "Как выбрать состав?",
        a: "Скажите, что для вас важнее: мягкость/прохлада/плотность — мы подберём ткань.",
      },
      {
        q: "Комплект можно в качестве подарка?",
        a: "Да — мы соберём комплект по бюджету и стилю.",
      },
      {
        q: "Сколько комплектов нужно?",
        a: "Обычно 2: один в использовании, второй в стирке — но всё зависит от вашего ритма.",
      },
    ],
  },
  pillows: {
    kicker: "ПОДУШКИ",
    heroTitle: "Финальный штрих",
    heroSubtitle:
      "Один необычный материал способен преобразить комнату и придать ей ощущение роскоши.",
    heroImage: "/ikonki-katalog/podushki-.webp",
    bullets: [
      { title: "Палитра", text: "Возьмите нейтральный цвет, добавьте к нему один тёплый оттенок и объедините их связующим тоном." },
      { title: "Фактуры", text: "Подушки из букле, льна и велюра обладают такой объёмной фактурой, что их рельеф заметен даже в пасмурную погоду." },
      { title: "Баланс", text: "Количество и размер подушек — чтобы выглядело аккуратно." },
    ],
    cases: [
      {
        title: "Диван",
        goal: "Создать в зоне отдыха атмосферу изысканности и комфорта.",
        result: "Интерьер выглядит продуманно, как в шоуруме.",
        imageSrc: "/catalog/8.dekorativnye-podushki-pokryvala/144A0592.webp",
      },
      {
        title: "Спальня",
        goal: "Создать ощущение спокойствия.",
        result: "Покрывало + подушки собирают гармоничную композицию.",
        imageSrc: "/catalog/8.dekorativnye-podushki-pokryvala/144A4918.webp",
      },
      {
        title: "В связке с шторами",
        goal: "Элементы текстиля поддерживают друг друга.",
        result: "Гармония в простоте — один стиль, одна гамма.",
        imageSrc: "/catalog/8.dekorativnye-podushki-pokryvala/00509_089_dop_-maxiimov.webp",
      },
    ],
    faq: [
      {
        q: "Сколько подушек нужно?",
        a: "Зависит от дивана. Обычно 3–5, но важнее — размер и пропорции.",
      },
      {
        q: "Можно подобрать под мой интерьер по фото?",
        a: "Да. Пришлите фото комнаты/дивана — предложим палитру и 2–3 сочетания фактур.",
      },
      {
        q: "Это будет практично?",
        a: "Да — подберём ткань по сценарию: дети/питомцы/частая стирка.",
      },
      {
        q: "Можно ли сделать “как на картинке” из Pinterest?",
        a: "Да. Пришлите референсы — мы адаптируем под вашу комнату.",
      },
    ],
  },
};

function getCopy(slug: string, fallbackTitle: string, fallbackImage: string): PageCopy {
  const base = COPY_BY_SLUG[slug];
  if (base) return base;

  return {
    kicker: "КАТЕГОРИЯ",
    heroTitle: fallbackTitle,
    heroSubtitle:
      "Макетная страница категории. Здесь будет продающий сценарий: задачи → варианты → кейсы → быстрый расчёт в Telegram.",
    heroImage: fallbackImage,
    bullets: [
      { title: "Смысл", text: "Сначала цель и сценарий, потом материал и монтаж." },
      { title: "Результат", text: "Финальный вид важнее отдельных элементов." },
      { title: "Сервис", text: "Замер, подбор, пошив и монтаж — в одном процессе." },
    ],
    cases: [
      {
        title: "Пример 1",
        goal: "Коротко: задача комнаты.",
        result: "Коротко: результат и эффект в интерьере.",
        imageSrc: fallbackImage,
      },
      {
        title: "Пример 2",
        goal: "Коротко: задача комнаты.",
        result: "Коротко: результат и эффект в интерьере.",
        imageSrc: fallbackImage,
      },
      {
        title: "Пример 3",
        goal: "Коротко: задача комнаты.",
        result: "Коротко: результат и эффект в интерьере.",
        imageSrc: fallbackImage,
      },
    ],
    faq: [
      {
        q: "С чего начать?",
        a: "Напишите в Telegram: 1) цель 2) фото окна/комнаты. Мы предложим 2–3 решения и объясним разницу.",
      },
      {
        q: "Сколько это стоит?",
        a: "Зависит от ткани/материала, размеров, сложности, и типа монтажа. Дадим ориентир после 1–2 фото и замера.",
      },
      {
        q: "Сколько времени занимает?",
        a: "Обычно один визит на замер и один на монтаж/установку, сроки зависят от категории.",
      },
      {
        q: "Можно без “перегруза”?",
        a: "Да. Мы за чистый премиум: минимум лишнего, максимум эффекта.",
      },
    ],
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  if (slug === "roman") {
    redirect("/catalog/curtains?t=римские");
  }
  const category = CATALOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const copy = getCopy(slug, category.title, category.imageSrc);
  const isBlinds = slug === "blinds";
  const isCurtains = slug === "curtains";
  const isRails = slug === "rails";
  const isRoman = slug === "roman";
  const isDecor = slug === "decor";
  const isRugs = slug === "rugs";
  const isBedding = slug === "bedding";
  const isPillows = slug === "pillows";

  const sourceSlug = KOENIG_SOURCE_SLUG_BY_APP_SLUG[slug];
  const koenigDoc = sourceSlug ? await getKoenigCatalogDoc(sourceSlug) : null;
  const koenigImages = pickKoenigImages(koenigDoc);

  const railsSubcatDocs = isRails
    ? await Promise.all(RAILS_SUBCATEGORIES.map((s) => getKoenigCatalogDoc(s.subslug)))
    : [];

  const rugsCatalog = injectImages(RUGS_CATALOG, koenigImages);
  const decorCatalog = injectImages(DECOR_CATALOG, koenigImages);
  const romanCatalog = injectImages(ROMAN_CATALOG, koenigImages);
  const curtainsCatalog = injectImages(CURTAINS_CATALOG, koenigImages);

  const decorItems: DecorItemDoc[] = isDecor
    ? await getDecorItems()
    : [];

  const decorVariantCards = decorItems.length
    ? decorItems.map((item) => ({
        title: item.title || "Вариант",
        imageSrc: normalizeImageUrl(item.image) || "/catalog/5.-dekor-furnitura/50007.webp",
        images: item.images?.map(normalizeImageUrl).filter((s) => s.length > 0) || [],
        description: item.description || "",
      }))
    : Array.from({ length: 24 }).map((_, idx) => ({
        title: `Вариант ${idx + 1}`,
        imageSrc: "/catalog/5.-dekor-furnitura/50007.webp",
        images: [] as string[],
        description: "",
      }));

  const beddingItems: BeddingItemDoc[] = isBedding
    ? await getBeddingItems()
    : [];

  const bedspreadsAndPillowsItems: BedspreadsAndPillowsItemDoc[] = isPillows
    ? await getBedspreadsAndPillowsItems()
    : [];

  const beddingVariantCards = beddingItems.length
    ? beddingItems.map((item) => ({
        imageSrc: normalizeImageUrl(item.image) || "/2foto_dark.webp",
        images: item.images?.map(normalizeImageUrl).filter((s) => s.length > 0) || [],
        description: item.description || "",
      }))
    : Array.from({ length: 6 }).map(() => ({
        imageSrc: "/2foto_dark.webp",
        images: [],
        description: "",
      }));

  const bedspreadsAndPillowsVariantCards = bedspreadsAndPillowsItems.length
    ? bedspreadsAndPillowsItems.map((item) => ({
        imageSrc: normalizeImageUrl(item.image) || "/catalog/8.dekorativnye-podushki-pokryvala/00509_089_dop_-maxiimov.webp",
        images: item.images?.map(normalizeImageUrl).filter((s) => s.length > 0) || [],
        description: item.description || "",
      }))
    : [];

  const pillowsVariantCards = (koenigImages.length
    ? koenigImages
    : Array.from({ length: 24 }).map(() => "/catalog/8.dekorativnye-podushki-pokryvala/00509_089_dop_-maxiimov.webp")
  )
    .slice(0, 72)
    .map((src, idx) => ({
      title: `Вариант ${idx + 1}`,
      imageSrc: src || "/catalog/8.dekorativnye-podushki-pokryvala/00509_089_dop_-maxiimov.webp",
    }));

  const railsCatalogCards = RAILS_CATALOG;

  const carpetItems: CarpetItemDoc[] = isRugs
    ? await (async () => {
        try {
          const client = await getMongoClient();
          const col = client.db("koenig").collection<CarpetItemDoc>("carpet_items");
          const docs = await col
            .find({ source: "koenigcarpet.ru", kind: "rug" }, { projection: { _id: 0 } })
            .limit(180)
            .toArray();
          // Fix image URLs: replace .webp with .jpg
          return (docs ?? []).map((d) => ({
            ...d,
            image: d.image?.replace(/\.webp$/i, ".jpg") || d.image,
          }));
        } catch {
          return [];
        }
      })()
    : [];

  const curtainTypes: CurtainTypeItem[] = isCurtains ? await getCurtainTypes() : [];
  const blindsTypes: BlindsTypeItem[] = isBlinds ? await getBlindsTypes() : [];
  const cornicesItems: CorniceItem[] = isRails ? await getCornicesItems() : [];
  const decorItemsList: DecorItem[] = isDecor ? await getDecorItems() : [];

  const heroImageFromDb = pickHeroImageFromDb(slug, koenigImages, railsSubcatDocs, copy.heroImage);
  const publicHeroCover = await pickPublicCatalogCover(slug);
  // Prioritize explicitly set heroImage from COPY, fallback to auto-selected
  const heroImage = copy.heroImage || publicHeroCover || heroImageFromDb;

  const examplesImages = isCurtains
    ? ["/primery/spalnya-.webp", "/primery/gostinaya-panoramnye-okna.webp", "/primery/kuhnya-gostinaya-.webp"]
    : isBlinds
      ? ["/Кухня .jpg", "/Кабинет .jpg", "/Первый этаж .jpg"]
      : koenigImages.map(dedupePathSegments);

  const derivedCopy: PageCopy = {
    ...copy,
    heroImage,
    cases: isBedding ? copy.cases : injectCaseImages(copy.cases, examplesImages),
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] pb-20 text-[color:var(--fg)] sm:pb-0">
      <Header />

      <main>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            <div className={isBlinds ? "absolute inset-0 kr-blinds-hero-pan" : "absolute inset-0"}>
              {isBedding && (
                <Image
                  src={derivedCopy.heroImage}
                  alt=""
                  fill
                  className="object-cover blur-xl saturate-[0.8] opacity-50"
                  aria-hidden="true"
                />
              )}
              <Image
                src={derivedCopy.heroImage}
                alt={category.title}
                fill
                sizes="100vw"
                quality={100}
                className={
                  isBlinds
                    ? "object-cover object-center brightness-[0.98] contrast-[1.06] saturate-[1.02]"
                    : isBedding
                      ? "object-contain object-[50%_98%] scale-[1.15] brightness-[1.05]"
                      : "object-cover object-center brightness-[0.95]"
                }
                priority
              />
            </div>

            <div
              className={
                isBlinds
                  ? "absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.88),rgba(255,255,255,0.18))] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72),rgba(0,0,0,0.12))]"
                  : isBedding
                    ? "absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45),rgba(0,0,0,0.05))]"
                    : "absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72),rgba(0,0,0,0.08))]"
              }
            />
          </div>

          <Container>
            <div className="relative z-10 grid min-h-[78svh] items-end py-14 sm:py-18">
              <div className="max-w-3xl">
                <div className="mb-5">
                  <a
                    href="/#catalog"
                    className={
                      isBlinds
                        ? "inline-flex h-10 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 text-xs font-medium tracking-wide text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                        : "inline-flex h-10 items-center justify-center border border-white/25 bg-transparent px-4 text-xs font-medium tracking-wide text-white/80 transition hover:bg-white/10 hover:text-white"
                    }
                  >
                    <span aria-hidden="true">←</span>
                    <span className="ml-2">Назад в каталог</span>
                  </a>
                </div>

                <h1
                  className={
                    isBlinds
                      ? "mt-4 text-balance text-4xl font-medium tracking-tight text-black dark:text-white sm:text-6xl"
                      : "mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-6xl"
                  }
                >
                  {derivedCopy.heroTitle}
                </h1>
                <p
                  className={
                    isBlinds
                      ? "mt-4 max-w-2xl text-sm leading-6 text-black/65 dark:text-white/75 sm:text-base"
                      : "mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base"
                  }
                >
                  {derivedCopy.heroSubtitle}
                </p>

                {isBlinds ? (
                  <div className="mt-7 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 py-3 text-black dark:text-white">
                      <div className="text-sm font-medium">от 3 900 ₽</div>
                      <div className="mt-0.5 text-xs text-black/55 dark:text-white/65">
                        за окно (ориентир)
                      </div>
                    </div>
                    <div className="border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 py-3 text-black dark:text-white">
                      <div className="text-sm font-medium">срок от 3 дней</div>
                      <div className="mt-0.5 text-xs text-black/55 dark:text-white/65">
                        по наличию / ткани
                      </div>
                    </div>
                    <div className="border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 py-3 text-black dark:text-white">
                      <div className="text-sm font-medium">монтаж — 1 визит</div>
                      <div className="mt-0.5 text-xs text-black/55 dark:text-white/65">
                        чисто и аккуратно
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ContactButton className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-5 text-sm font-medium text-white transition hover:opacity-90">
                    Связаться
                  </ContactButton>
                  <a
                    href="#cases"
                    className={
                      isBlinds
                        ? "inline-flex h-12 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-5 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                        : "inline-flex h-12 items-center justify-center border border-white/25 bg-transparent px-5 text-sm font-medium text-white transition hover:bg-white/10"
                    }
                  >
                    {isBlinds ? "Смотреть примеры" : "Смотреть примеры"}
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {isRails ? null : null}

        {isPillows ? (
          <section id="pillows-catalog" className="py-14 sm:py-18">
            <Container>
              <div className="mt-12 grid gap-6 text-center">
                <div>
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КАТАЛОГ ТЕКСТИЛЯ</div>
                  <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-6xl">
                    Варианты под задачу
                  </h2>
                </div>

                <div className="flex justify-center">
                  <ContactButton className="inline-flex h-12 items-center justify-center border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                    Собрать под мой интерьер
                  </ContactButton>
                </div>
              </div>

              <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                Покрывала и декоративные подушки любых форм и размеров — от простых до эксклюзивных вариантов.
              </p>

              <BeddingCatalog
                cards={bedspreadsAndPillowsVariantCards}
                contextBase={{
                  source: "koenigroom.ru",
                  kind: "bedspreads_and_pillows",
                  url: "/catalog/pillows",
                  category: "Интерьерные покрывала и подушки",
                  title: "Интерьерные покрывала и подушки",
                }}
                productType="bedspreads_and_pillows_variant"
              />
            </Container>
          </section>
        ) : null}

        {isRugs ? (
          <section id="rugs-all" className="py-14 sm:py-18">
            {/* Partner block about koenigcarpet.ru - full width */}
            <div className="bg-[color:var(--card)]">
              <Container>
                <div className="py-12 lg:py-16">
                  <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-8">
                      <div className="inline-flex items-center gap-2 bg-[color:var(--accent)]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[color:var(--accent)]">
                        НАШ САЙТ
                      </div>
                      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
                        Koenig Carpet — ковры премиум-класса
                      </h2>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                        Наш сайт посвящён исключительно выбору и покупке качественных ковров. В то время как на "Koenig Room" представлен весь ассортимент продукции, здесь вы найдёте только ковры.
                      </p>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                        Мы собрали для вас коллекцию, где важны три вещи: тактильность, тепло и завершенность. Для каждого изделия доступны фото, название и цена.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center bg-[color:var(--accent)]/10 text-[color:var(--accent)]">✓</span>
                          <span className="text-[color:var(--fg)]">Доставка по Калининграду</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center bg-[color:var(--accent)]/10 text-[color:var(--accent)]">✓</span>
                          <span className="text-[color:var(--fg)]">Подбор по фото интерьера</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center bg-[color:var(--accent)]/10 text-[color:var(--accent)]">✓</span>
                          <span className="text-[color:var(--fg)]">Гарантия качества</span>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-4 lg:flex lg:justify-end">
                      <div className="flex flex-col gap-3">
                        <a
                          href="https://koenigcarpet.ru"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-14 items-center justify-center bg-[color:var(--accent)] px-6 text-base font-semibold text-[color:var(--accent-contrast)] transition hover:opacity-95"
                        >
                          Перейти в каталог →
                        </a>
                        <a
                          href="https://koenigcarpet.ru/ru/all-rugs"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-12 items-center justify-center border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                        >
                          Все ковры на сайте
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            </div>

            <div className="mt-12">
              <Container>
                <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                    {category.title}
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                    {category.description} Внутри — фото, название и цена.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <a
                      href="https://koenigcarpet.ru"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center justify-center bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    >
                      Еще больше наших ковров
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <RugsStyleCatalog
                  items={carpetItems.map((d) => ({
                    title: d.title,
                    priceText: d.priceText,
                    image: d.image?.startsWith("http") ? d.image : `https://koenigcarpet.ru${d.image}`,
                    url: d.url,
                    style: d.style,
                    collection: d.collection,
                    color: d.color,
                  }))}
                />
              </div>
            </Container>
            </div>
          </section>
        ) : null}

        {isBedding ? (
          <section id="bedding-catalog" className="py-14 sm:py-18">
            <Container>
              <div className="mt-12 grid gap-6 text-center">
                <div>
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КАТАЛОГ БЕЛЬЯ</div>
                  <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-6xl">
                    Варианты по ощущению
                  </h2>
                </div>

                <div className="flex justify-center">
                  <ContactButton className="inline-flex h-12 items-center justify-center border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                    Подобрать по ощущениям
                  </ContactButton>
                </div>
              </div>

              <BeddingCatalog
                cards={beddingVariantCards}
                contextBase={{
                  source: "koenigroom.ru",
                  kind: "bedding",
                  url: "/catalog/bedding",
                  category: "Постельное бельё",
                  title: "Постельное бельё",
                }}
                intro="Индивидуальный пошив постельного белья по вашим размерам. Используем только натуральные и смесовые ткани."
              />
            </Container>
          </section>
        ) : null}

        {isRoman ? null : null}

        {isBlinds ? (
          <section id="blinds-catalog" className="py-14 sm:py-18">
            <Container>
              <div className="mb-8">
                <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  Каталог жалюзи
                </span>
              </div>

              <div className="mt-10">
                <BlindsTypesCatalog items={blindsTypes} />
              </div>
            </Container>
          </section>
        ) : null}

        {isBlinds ? (
          <BlindsShowcase
            images={[
              "/фон на 02 и 03/-5334905485867554782_121 (1).jpg",
              "/фон на 02 и 03/-5354925664169039299_121.jpg",
              "/фон на 02 и 03/photo_2026-03-03_13-08-18.jpg",
            ]}
          />
        ) : null}

        {isRails ? <RailsShowcase images={koenigImages} /> : null}

        {isDecor ? (
          <section id="decor-catalog" className="py-14 sm:py-18">
            <Container>
              <div className="mt-10">
                <DecorCatalog items={decorItemsList} />
              </div>
            </Container>
          </section>
        ) : null}

        {isRoman ? (
          <section id="roman-catalog" className="py-14 sm:py-18">
            <Container>
              <div className="mb-8">
                <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  Римские шторы
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {romanCatalog.map((it) => (
                  <a key={it.title} href="#cta" className="block" aria-label={it.title}>
                    <div className="group h-full overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)] transition duration-300 hover:bg-[color:var(--bg)]">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={it.imageSrc}
                          alt={it.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_70%)]" />
                      </div>
                      <div className="p-5">
                        <div className="text-lg font-medium text-[color:var(--fg)]">{it.title}</div>
                        <div className="mt-1 text-xs text-[color:var(--muted)]">{it.subtitle}</div>
                        <div className="mt-2 text-sm text-[color:var(--muted)]">{it.text}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {isCurtains ? (
          <section id="curtains-catalog" className="py-14 sm:py-18">
            <Container>
              <div className="mb-8">
                <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  Каталог штор
                </span>
              </div>

              <div className="mt-10">
                <CurtainTypesCatalog items={curtainTypes} />
              </div>
            </Container>
          </section>
        ) : null}

        {isRails ? (
          <section id="rails-catalog" className="py-14 sm:py-18">
            <Container>
              <div className="mb-8">
                <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  Карнизы
                </span>
              </div>

              <div className="mt-10">
                <CornicesCatalog items={cornicesItems} />
              </div>
            </Container>
          </section>
        ) : null}

        {isCurtains ? (
          <section
            id="why"
            className="w-full bg-[color:var(--bg)] py-16 text-[color:var(--fg)] sm:py-20"
          >
            <Container>
              <div className="mb-8">
                <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  Почему важно
                </span>
                <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  качество посадки
                </span>
              </div>

              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-6">
                  <div className="grid gap-6">
                    <div className="border-b border-[color:var(--gray-lines)] pb-6">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-light text-[color:var(--muted)]">01</span>
                        <div>
                          <h3 className="text-lg font-medium text-[color:var(--fg)]">
                            Свет и приватность
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                            Подбираем прозрачность и слойность, чтобы днём было светло, а вечером — комфортно.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-[color:var(--gray-lines)] pb-6">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-light text-[color:var(--muted)]">02</span>
                        <div>
                          <h3 className="text-lg font-medium text-[color:var(--fg)]">
                            Высота и пропорции
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                            Рассчитываем длину, ширину и складку — чтобы шторы «держали» стену и выглядели собранно.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-[color:var(--gray-lines)] pb-6">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-light text-[color:var(--muted)]">03</span>
                        <div>
                          <h3 className="text-lg font-medium text-[color:var(--fg)]">
                            Фактура и цвет
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                            Ткань должна читаться в вашем свете. Подбираем так, чтобы интерьер становился теплее и глубже.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="pb-6">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-light text-[color:var(--muted)]">04</span>
                        <div>
                          <h3 className="text-lg font-medium text-[color:var(--fg)]">
                            Пошив и монтаж
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                            Важно не только выбрать ткань, но и сделать финальный вид: ровная линия, чистые узлы, аккуратная установка.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <div className="relative aspect-[4/3] overflow-hidden border border-[color:var(--gray-lines)]">
                    <Image
                      src="/posadka-1-.webp"
                      alt="Шторы в интерьере"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : isBlinds ? (
          <section
            id="why"
            className="w-full bg-[color:var(--bg)] py-16 text-[color:var(--fg)] sm:py-20"
          >
            <Container>
              <div className="mb-8">
                <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  Почему важно
                </span>
                <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  качество жалюзи
                </span>
              </div>

              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-6">
                  <div className="grid gap-6">
                    <div className="border-b border-[color:var(--gray-lines)] pb-6">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-light text-[color:var(--muted)]">01</span>
                        <div>
                          <h3 className="text-lg font-medium text-[color:var(--fg)]">
                            Контроль света
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                            Точная настройка угла наклона ламелей — комфорт для кухни, кабинета и ТВ без бликов.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-[color:var(--gray-lines)] pb-6">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-light text-[color:var(--muted)]">02</span>
                        <div>
                          <h3 className="text-lg font-medium text-[color:var(--fg)]">
                            Приватность
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                            Закрыто от взглядов вечером — при этом днём сохраняется свет и ощущение воздуха.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-[color:var(--gray-lines)] pb-6">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-light text-[color:var(--muted)]">03</span>
                        <div>
                          <h3 className="text-lg font-medium text-[color:var(--fg)]">
                            Аккуратный монтаж
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                            Ровные линии, чистые крепления и точные размеры — премиум-ощущение без офисного вида.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="pb-6">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl font-light text-[color:var(--muted)]">04</span>
                        <div>
                          <h3 className="text-lg font-medium text-[color:var(--fg)]">
                            Быстрый старт
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                            Напишите: комната + цель (блики/приватность/blackout) и 1–2 фото окна. Мы предложим 2–3 варианта.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <div className="relative aspect-[4/3] overflow-hidden border border-[color:var(--gray-lines)]">
                    <Image
                      src="/catalog/2.zhalyuzi/allyuminievye/foto-na-ikonku-1-.webp"
                      alt="Жалюзи в интерьере"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : isRails ? (
          <section id="why" className="relative overflow-hidden bg-[color:var(--bg)] py-18 sm:py-24">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(#00000014_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:18px_18px]" />
              <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
              <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
            </div>

            <Container>
              <div className="relative z-10">
                <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-7">
                    <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ЗАЧЕМ</div>
                    <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                      Карниз решает 3 задачи — эстетику, практичность и энергосбережение
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                      Даже небольшой промах с выбором карниза, высотой или крепежом может полностью испортить представление о тканях. Мы поможем вам сделать правильный выбор!
                    </p>
                  </div>
                  <div className="lg:col-span-5 lg:flex lg:justify-end">
                    <ContactButton className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]">
                      Подобрать карниз
                    </ContactButton>
                  </div>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch">
                  <div className="lg:col-span-4">
                    <div className="group h-full rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                      <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">01</div>
                      <div className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--fg)]">Линия окна</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Высота установки и вылет под ткань — чтобы складка не цепляла и вертикали были ровными.
                      </div>
                      <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                        Правильный вылет →
                      </div>
                    </div>
                  </div>

                  <div className="order-first lg:order-none lg:col-span-4">
                    <a href="#rails-catalog" className="block" aria-label="Каталог карнизов">
                      <div className="group relative h-full min-h-[420px] overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-white/5 dark:hover:shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
                        <Image
                          src="/catalog/4.karnizy/bagetnye-karnizy/1.webp"
                          alt="Карнизы"
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.06] group-hover:saturate-[1.10]"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.30),rgba(0,0,0,0.72))] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22),rgba(0,0,0,0.36),rgba(0,0,0,0.78))]" />

                        <div className="relative z-10 flex h-full flex-col justify-end p-7">
                          <div className="text-xs font-semibold tracking-[0.28em] text-white/75">БЫСТРО</div>
                          <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
                            {isBlinds ? "Rimskie shtory na zakaz" : "Posmotret' varianty"}
                          </div>
                          <div className="mt-3 text-sm leading-6 text-white/80">
                            Однорядные, двухрядные, потолочные, эркеры — сразу видно, что подходит под задачу.
                          </div>
                          <div className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black shadow-sm transition group-hover:shadow-md">
                            Каталог <span aria-hidden="true" className="ml-2">→</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="group h-full rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                      <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">02</div>
                      <div className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--fg)]">Детали “дорого”</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Наконечники и металл — это визуальный “ювелирный” слой. Попадаем в тон под интерьер.
                      </div>
                      <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                        Под стиль комнаты →
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-6">
                    <div className="rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                      <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">03</div>
                      <div className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--fg)]">Монтаж без сюрпризов</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Держим уровень, симметрию и крепёж под вашу стену/потолок — чтобы не переделывать и не “гуляло”.
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                      <div className="text-sm font-semibold text-[color:var(--fg)]">Быстрый старт</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Пришлите 2 фото: окно и общий вид стены. Мы предложим 2–3 карниза и объясним разницу.
                      </div>
                      <ContactButton className="mt-5 inline-flex h-12 w-full items-center justify-center bg-[color:var(--green)] px-5 text-sm font-medium text-white transition hover:opacity-90">
                        Связаться
                      </ContactButton>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : isRoman ? (
          <section id="why" className="relative overflow-hidden bg-[color:var(--bg)] py-18 sm:py-24">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(#00000014_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:18px_18px]" />
              <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
              <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
            </div>

            <Container>
              <div className="relative z-10">
                <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-8">
                    <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ЗАЧЕМ</div>
                    <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                      Римские шторы — когда хочется чисто и практично
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                      Это “архитектурное” решение: ровная геометрия, понятный контроль света и минимум визуального шума.
                    </p>
                  </div>
                  <div className="lg:col-span-4 lg:flex lg:justify-end">
                    <a
                      href="#roman-catalog"
                      className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    >
                      Смотреть варианты
                    </a>
                  </div>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <div className="group h-full rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                      <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">01</div>
                      <div className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--fg)]">Геометрия</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Ровные горизонтали и аккуратный объём. Окно выглядит собранно и “дороже”.
                      </div>
                      <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                        Без перегруза →
                      </div>
                    </div>
                  </div>

                  <div className="order-first lg:order-none lg:col-span-4">
                    <a href="#cta" className="block" aria-label="Быстрый расчёт">
                      <div className="group relative h-full min-h-[420px] overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-white/5 dark:hover:shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
                        <Image
                          src="/catalog/3.rimskie/na-elektroprivode/foto-na-ikonku-.webp"
                          alt="Римские шторы"
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.06] group-hover:saturate-[1.10]"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.30),rgba(0,0,0,0.72))] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22),rgba(0,0,0,0.36),rgba(0,0,0,0.78))]" />

                        <div className="relative z-10 flex h-full flex-col justify-end p-7">
                          <div className="text-xs font-semibold tracking-[0.28em] text-white/75">БЫСТРО</div>
                          <div className="mt-2 text-2xl font-semibold tracking-tight text-white">Подбор за 2 фото</div>
                          <div className="mt-3 text-sm leading-6 text-white/80">
                            Окно + общий вид стены. Мы предложим 2–3 ткани и объясним разницу по свету.
                          </div>
                          <div className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black shadow-sm transition group-hover:shadow-md">
                            Рассчитать <span aria-hidden="true" className="ml-2">→</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="group h-full rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                      <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">02</div>
                      <div className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--fg)]">Практичность</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Отлично для кухни: легко обслуживать, ничего не мешает на подоконнике.
                      </div>
                      <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                        Для кухни →
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-6">
                    <div className="rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                      <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">03</div>
                      <div className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--fg)]">Контроль света</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Подбираем прозрачность под сценарий: soft для дневного света или blackout для сна.
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                      <div className="text-sm font-semibold text-[color:var(--fg)]">Спросить совет</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Напишите: комната + цель (блики/приватность/blackout) — мы ответим конкретно и без лишнего.
                      </div>
                      <ContactButton className="mt-5 inline-flex h-12 w-full items-center justify-center bg-[color:var(--green)] px-5 text-sm font-medium text-white transition hover:opacity-90">
                        Связаться
                      </ContactButton>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : isDecor ? (
          <section id="why" className="bg-[color:var(--bg)] py-16 sm:py-20">
            <Container>
              <div className="mb-8">
                <span className="inline-block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  Декор
                </span>
                <span className="ml-2 inline-block font-['Rozovii_Chulok',cursive] text-xl tracking-normal text-[color:var(--green)] sm:ml-4 sm:text-3xl lg:text-4xl" style={{ transform: 'rotate(-6deg)' }}>
                  и фурнитура
                </span>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <article className="group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)]">
                  <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                    <div className="text-xl font-medium text-[color:var(--fg)]">01</div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                    Цельность
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    Связываем ткань, карниз и мебель: один металл, один тон, одна логика.
                  </p>
                </article>

                <article className="group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)]">
                  <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                    <div className="text-xl font-medium text-[color:var(--fg)]">02</div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                    Один сильный штрих
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    Вместо множества мелких — одна точная деталь: подхват или кисть, правильная по масштабу.
                  </p>
                </article>

                <article className="group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)]">
                  <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                    <div className="text-xl font-medium text-[color:var(--fg)]">03</div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                    Металл и тон
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    Выбираем оттенок глядя на фурнитуру мебели и светильники.
                  </p>
                </article>
              </div>

              <div className="mt-10 text-center">
                <ContactButton className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]">
                  Получить консультацию
                </ContactButton>
              </div>
            </Container>
          </section>
        ) : isRugs ? (
          <section id="why">
            <RugsWhyShowcase images={koenigImages} />
          </section>
        ) : isBedding ? (
          <section id="why">
            <BeddingWhyShowcase images={koenigImages} />
          </section>
        ) : isPillows ? (
          <section id="why">
            <PillowsWhyMasonry images={koenigImages} />
          </section>
        ) : !isBlinds ? (
          <section id="why" className="py-14 sm:py-18">
            <Container>
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                    ЗАЧЕМ
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
                    Текстиль покупают ради ощущения. Мы собираем его в решение.
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    Минимум лишнего, максимум эффекта: свет, пропорции, фактура и чистый монтаж.
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {copy.bullets.map((b) => (
                      <div
                        key={b.title}
                        className="rounded-3xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="text-sm font-semibold text-[color:var(--fg)]">
                          {b.title}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                          {b.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        <section id="cases" className="py-14 sm:py-18">
          <Container>
              <div className="mb-8">
                <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  Примеры
                </span>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {derivedCopy.cases.map((c) => (
                <a key={c.title} href="#cta" aria-label={c.title} className="block">
                  <div className="group h-full overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)] transition duration-300 hover:bg-[color:var(--bg)]">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={c.imageSrc}
                        alt={c.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="eager"
                      />
                    </div>

                    <div className="p-5">
                      <div className="text-lg font-medium text-[color:var(--fg)]">
                        {c.title}
                      </div>
                      <div className="mt-2 text-sm text-[color:var(--muted)]">
                        <span className="font-medium text-[color:var(--fg)]">Задача:</span> {c.goal}
                      </div>
                      <div className="mt-1 text-sm text-[color:var(--muted)]">
                        <span className="font-medium text-[color:var(--fg)]">Итог:</span> {c.result}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>

        <section id="faq" className="py-14 sm:py-18">
          <Container>
              <div className="mb-8">
                <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                  Частые вопросы
                </span>
              </div>

              <div className="grid gap-3">
                {copy.faq.map((it) => (
                  <details
                    key={it.q}
                    className="group border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-5 open:bg-[color:var(--bg)]"
                  >
                    <summary className="cursor-pointer list-none text-base font-medium text-[color:var(--fg)] outline-none">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          {it.q}
                          <div className="mt-3 grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
                            <div className="overflow-hidden">
                              <div className="text-sm font-normal leading-6 text-[color:var(--muted)] opacity-0 transition-[opacity,transform] duration-300 ease-out -translate-y-1 group-open:opacity-100 group-open:translate-y-0">
                                {it.a}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-auto mt-0.5 text-[color:var(--muted)] transition-transform duration-300 ease-out group-open:rotate-45">
                          +
                        </div>
                      </div>
                    </summary>
                  </details>
                ))}
              </div>

              <div className="mt-6">
                <ContactButton className="inline-flex h-12 w-full items-center justify-center bg-[color:var(--accent)] px-5 text-sm font-medium text-[color:var(--accent-contrast)] transition hover:opacity-90">
                  Задать вопрос в Telegram
                </ContactButton>
                {isRugs ? (
                  <a
                    href="https://koenigcarpet.ru/ru/vr"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex h-12 w-full items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-5 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                  >
                    Виртуальная примерка ковра
                  </a>
                ) : null}
              </div>
          </Container>
        </section>

        <section id="cta" className="py-14 sm:py-18">
          <Container>
            <div className="border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-6 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <h2 className="text-3xl font-medium tracking-tight text-[color:var(--fg)] sm:text-4xl">
                    Напишите 2 сообщения — и мы предложим 2–3 решения
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    1) Комната и цель (блики/приватность/blackout) 2) фото окна и общий вид стены.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <ContactButton className="inline-flex h-12 w-full items-center justify-center bg-[color:var(--green)] px-5 text-sm font-medium text-white transition hover:opacity-90 lg:w-auto">
                    Связаться
                  </ContactButton>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
