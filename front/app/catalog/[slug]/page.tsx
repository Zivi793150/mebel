import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";
import { readdir } from "fs/promises";
import { Container } from "@/components/Container";
import { BlindsCarousel } from "@/components/BlindsCarousel";
import { BlindsShowcase } from "@/components/BlindsShowcase";
import { BeddingWhyShowcase } from "@/components/BeddingWhyShowcase";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { PillowsWhyMasonry } from "@/components/PillowsWhyMasonry";
import { BeddingCatalog } from "@/components/BeddingCatalog";
import { BlindsCategoriesNav } from "@/components/BlindsCategoriesNav";
import { RailsShowcase } from "@/components/RailsShowcase";
import { RailsVariantsCatalog } from "@/components/RailsVariantsCatalog";
import { RugsStyleCatalog } from "@/components/RugsStyleCatalog";
import { RugsWhyShowcase } from "@/components/RugsWhyShowcase";
import { CurtainTypesCatalog, CurtainTypesList, type CurtainTypeItem } from "@/components/CurtainTypesList";
import type { BlindsTypeItem } from "@/components/BlindsTypesCatalog";
import { CONTACTS, CATALOG_CATEGORIES } from "@/lib/constants";
import { getMongoClient } from "@/lib/mongo";

export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return CATALOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = CATALOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.title} — Koenig Room (Калининград)`,
    description: `${category.description}. Подбор и монтаж под ключ — Koenig Room, Калининград.`,
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

async function getBeddingItems(): Promise<BeddingItemDoc[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<BeddingItemDoc>("bedding_items");
    const docs = await col
      .find({ source: "koenigroom.ru", kind: "bedding_item" }, { projection: { _id: 0 } })
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
    const col = db.collection<BedspreadsAndPillowsItemDoc>("bedspreads_and _illows");
    const docs = await col.find({ source: "koenigroom.ru" }, { projection: { _id: 0 } }).toArray();
    return docs ?? [];
  } catch {
    return [];
  }
}

async function getCurtainTypes(): Promise<CurtainTypeItem[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<CurtainTypeItem>("curtain_types");
    const docs = await col
      .find({ source: "centrshtor.ru", kind: "curtain_type" }, { projection: { _id: 0 } })
      .toArray();
    return docs ?? [];
  } catch {
    return [];
  }
}

async function getBlindsTypes(): Promise<BlindsTypeItem[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<BlindsTypeItem>("blinds_types");
    const docs = await col
      .find({ source: "centrshtor.ru", kind: "blinds_type" }, { projection: { _id: 0 } })
      .toArray();
    return docs ?? [];
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
    .map((it) => it.large_url)
    .filter(Boolean);
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
  return cases.map((c, idx) => ({ ...c, imageSrc: images[(idx + 1) % images.length] }));
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

const CURTAINS_CATALOG = [
  {
    title: "Портьеры",
    subtitle: "Фактура и объём",
    text: "Дают глубину и “собирают” комнату. Подбираем плотность и посадку под мебель и свет.",
    imageSrc: "/catalog/curtains.jpg",
  },
  {
    title: "Тюль и вуаль",
    subtitle: "Мягкий дневной свет",
    text: "Снимают контраст и делают свет спокойнее — без ощущения “витрины”.",
    imageSrc: "/catalog/decor.jpg",
  },
  {
    title: "Blackout",
    subtitle: "Сон без бликов",
    text: "Для спальни и гостевых: затемнение, приватность, ровные вертикали на стене.",
    imageSrc: "/catalog/bed.jpg",
  },
  {
    title: "Лён и натуральные фактуры",
    subtitle: "Чистый премиум",
    text: "Смотрятся дороже в естественном свете. Хороши для спокойных интерьеров.",
    imageSrc: "/hero.jpg",
  },
  {
    title: "Два слоя",
    subtitle: "Сценарии дня",
    text: "Днём — лёгкость и воздух, вечером — приватность. Управление светом без компромиссов.",
    imageSrc: "/hero2.jpg",
  },
  {
    title: "Карнизы и фурнитура",
    subtitle: "Детали решают",
    text: "Наконечники, подхваты, ленты — собираем комплект так, чтобы выглядело “дорого”.",
    imageSrc: "/catalog/rails.jpg",
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
    imageSrc: "/catalog/pillows.jpg",
  },
  {
    title: "Покрывала",
    subtitle: "Собранный вид",
    text: "Один слой, который моментально делает спальню “дороже” и аккуратнее.",
    imageSrc: "/catalog/bed.jpg",
  },
  {
    title: "Пледы",
    subtitle: "Тепло и фактура",
    text: "Добавляем тактильность и уют, но держим стиль — чтобы выглядело современно.",
    imageSrc: "/catalog/rugs.jpg",
  },
  {
    title: "Нейтральная палитра",
    subtitle: "Цвет без риска",
    text: "Спокойные оттенки + разные фактуры дают “тихий премиум” без ярких принтов.",
    imageSrc: "/catalog/curtains.jpg",
  },
  {
    title: "Акцент",
    subtitle: "Один сильный",
    text: "Добавляем один акцентный цвет и повторяем его 2 раза — так выглядит дорого и логично.",
    imageSrc: "/catalog/decor.jpg",
  },
  {
    title: "В связке",
    subtitle: "Со шторами/ковром",
    text: "Собираем текстиль как комплект: чтобы всё “разговаривало” между собой.",
    imageSrc: "/catalog/rails.jpg",
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
    imageSrc: "/2foto_dark.jpg",
  },
  {
    title: "Мягкие фактуры",
    subtitle: "Уют и расслабление",
    text: "Если хочется мягче и спокойнее: фактура, которая визуально и тактильно делает спальню дороже.",
    imageSrc: "/catalog/bed.jpg",
  },
  {
    title: "Практичные",
    subtitle: "Без лишней возни",
    text: "Под регулярную стирку, детей/питомцев и быстрый порядок — чтобы красиво каждый день.",
    imageSrc: "/catalog/pillows.jpg",
  },
  {
    title: "Нейтральная палитра",
    subtitle: "Цвет без риска",
    text: "Подбираем спокойные оттенки под стены/шторы — спальня выглядит цельно и “дорого”.",
    imageSrc: "/catalog/curtains.jpg",
  },
  {
    title: "Комплект",
    subtitle: "Собранный вид",
    text: "Наволочки, пододеяльник, простынь — чтобы всё выглядело как единая композиция.",
    imageSrc: "/catalog/decor.jpg",
  },
  {
    title: "В подарок",
    subtitle: "Беспроигрышно",
    text: "Собираем универсальный премиум: приятная фактура, спокойный цвет, понятный уход.",
    imageSrc: "/catalog/rugs.jpg",
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
    imageSrc: "/catalog/rugs.jpg",
  },
  {
    title: "Спальня",
    subtitle: "Тепло утром",
    text: "Тактильность, мягкость и тишина — чтобы день начинался комфортнее.",
    imageSrc: "/catalog/bed.jpg",
  },
  {
    title: "Детская",
    subtitle: "Безопасно и практично",
    text: "Подбираем ворс и состав под игры, уборку и ежедневную нагрузку.",
    imageSrc: "/catalog/pillows.jpg",
  },
  {
    title: "Фактура",
    subtitle: "Материальность",
    text: "Букле, шерсть, короткий ворс — чтобы “дорого” читалось в вашем свете.",
    imageSrc: "/catalog/decor.jpg",
  },
  {
    title: "Нейтральная палитра",
    subtitle: "Цвет без риска",
    text: "Подбираем оттенок так, чтобы он связал мебель и текстиль, а не спорил с ними.",
    imageSrc: "/catalog/curtains.jpg",
  },
  {
    title: "Уход",
    subtitle: "Под ваш ритм",
    text: "Сразу учитываем детей/питомцев и объясняем, как ухаживать — без сюрпризов.",
    imageSrc: "/catalog/rails.jpg",
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
    title: "Подхваты",
    subtitle: "Аккуратная форма",
    text: "Дают композицию и “держат” складку. Подбираем под металл и стиль комнаты.",
    imageSrc: "/catalog/decor.jpg",
  },
  {
    title: "Кисти и бахрома",
    subtitle: "Тактильный премиум",
    text: "Когда нужен мягкий, но дорогой акцент. Главное — пропорции и один сильный штрих.",
    imageSrc: "/catalog/curtains.jpg",
  },
  {
    title: "Ленты и тесьма",
    subtitle: "Сборка складки",
    text: "Форма складки и высота посадки: то, что отличает “просто шторы” от комплекта.",
    imageSrc: "/hero2.jpg",
  },
  {
    title: "Наконечники",
    subtitle: "Ювелирная деталь",
    text: "Металл и форма связывают карниз с интерьерной фурнитурой — смотрится как комплект.",
    imageSrc: "/catalog/rails.jpg",
  },
  {
    title: "Кольца / крючки",
    subtitle: "Тихий ход",
    text: "Чтобы ткань двигалась легко, а линия выглядела ровной. Подбираем под систему.",
    imageSrc: "/catalog/rugs.jpg",
  },
  {
    title: "Комплект под интерьер",
    subtitle: "Цельность",
    text: "Собираем металл, цвет, фактуры и карниз под вашу мебель и светильники.",
    imageSrc: "/catalog/bed.jpg",
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
    imageSrc: "/catalog/roman.jpg",
  },
  {
    title: "Screen / anti-glare",
    subtitle: "Комфорт для экрана",
    text: "Для кабинета и ТВ: меньше бликов, стабильнее свет, интерьер выглядит спокойнее.",
    imageSrc: "/catalog/blinds.jpg",
  },
  {
    title: "Blackout",
    subtitle: "Сон без света",
    text: "Для спальни и детской: затемнение, приватность, аккуратная геометрия без тяжёлых штор.",
    imageSrc: "/catalog/bed.jpg",
  },
  {
    title: "Натуральные фактуры",
    subtitle: "Чистый премиум",
    text: "Лён, хлопок, спокойные оттенки. Ровный объём и тактильность — без перегруза.",
    imageSrc: "/hero2.jpg",
  },
  {
    title: "Кассетные системы",
    subtitle: "Аккуратно на раме",
    text: "Когда важно, чтобы всё выглядело встроенным и максимально чистым по линии окна.",
    imageSrc: "/catalog/decor.jpg",
  },
  {
    title: "Управление",
    subtitle: "Цепь / мотор",
    text: "Подберём механику под сценарий: удобно каждый день, тихий ход, стабильная посадка.",
    imageSrc: "/catalog/rugs.jpg",
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
    imageSrc: "/catalog/carnis.jpg",
  },
  {
    title: "Двухрядные",
    subtitle: "Тюль + портьера",
    text: "Правильная глубина и расстояние между рядами, чтобы слои не спорили и всё двигалось легко.",
    imageSrc: "/catalog/curtains.jpg",
  },
  {
    title: "Потолочные",
    subtitle: "Визуальная высота",
    text: "Поднимают пропорции стены и помогают “вытянуть” окно. Подбираем крепёж под потолок.",
    imageSrc: "/catalog/rails.jpg",
  },
  {
    title: "С наконечниками",
    subtitle: "Акцент",
    text: "Металл, форма, пропорции — под стиль комнаты и вашу фурнитуру. Дают эффект “дорого”.",
    imageSrc: "/catalog/decor.jpg",
  },
  {
    title: "Эркеры и углы",
    subtitle: "Сложная геометрия",
    text: "Собираем линию без “ломаного” вида: повороты, соединители, крепёж — всё заранее просчитываем.",
    imageSrc: "/catalog/rugs.jpg",
  },
  {
    title: "Комбо-комплект",
    subtitle: "Сразу под ткань",
    text: "Подбираем карниз, ленту/крючки и ткань вместе, чтобы посадка и линия совпали.",
    imageSrc: "/catalog/bed.jpg",
  },
];

const COPY_BY_SLUG: Record<string, PageCopy> = {
  curtains: {
    kicker: "ШТОРЫ",
    heroTitle: "Шторы, которые гармонично сочетаются с интерьером как визуально, так и функционально",
    heroSubtitle:
      "Подберём ткань под комнату и окна, рассчитаем посадку, сошьём и установим. Аккуратно, без лишних слоёв и случайных решений.",
    heroImage: "/hero2.jpg",
    bullets: [
      { title: "Свет", text: "Плотность и подкладка — чтобы было комфортно днём и вечером." },
      { title: "Высота", text: "Правильная длина и складка дают ощущение “дорого”." },
      { title: "Сборка", text: "Карнизы, ленты, подхваты — соберём всё в единый стиль." },
    ],
    cases: [
      {
        title: "Спальня / blackout",
        goal: "Сон без бликов и света с улицы.",
        result: "Тишина, затемнение и визуально лёгкая стена — без тяжёлых штор.",
        imageSrc: "/catalog/bed.jpg",
      },
      {
        title: "Гостиная / панорамные окна",
        goal: "Сохранить воздух и сделать красиво в кадре.",
        result: "Мягкий свет, ровная геометрия, интерьер смотрится собранно.",
        imageSrc: "/catalog/decor.jpg",
      },
      {
        title: "Кухня-гостиная",
        goal: "Чтобы не пачкалось и легко управлялось.",
        result: "Практичная ткань + понятная механика — без лишней “декорации”.",
        imageSrc: "/catalog/roman.jpg",
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
    heroImage: "/catalog/blinds.jpg",
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
        imageSrc: "/catalog/roman.jpg",
      },
      {
        title: "Кабинет / рабочее место",
        goal: "Сделать свет комфортным для монитора и встреч.",
        result: "Стабильный свет, аккуратные линии, ощущение порядка.",
        imageSrc: "/catalog/blinds.jpg",
      },
      {
        title: "Первый этаж",
        goal: "Приватность вечером, но без плотных штор.",
        result: "Комфорт и безопасность — визуально минималистично.",
        imageSrc: "/catalog/decor.jpg",
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
    heroImage: "/catalog/roman.jpg",
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
        imageSrc: "/catalog/roman.jpg",
      },
      {
        title: "Кабинет",
        goal: "Стабильный свет для монитора.",
        result: "Нет бликов — работать проще, вид окна остаётся чистым.",
        imageSrc: "/catalog/blinds.jpg",
      },
      {
        title: "Детская",
        goal: "Уют и мягкое затемнение.",
        result: "Теплее по ощущению, чем жалюзи, и проще в управлении.",
        imageSrc: "/catalog/bed.jpg",
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
    heroImage: "/catalog/carnis.jpg",
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
        imageSrc: "/catalog/rails.jpg",
      },
      {
        title: "Спальня",
        goal: "Спокойная геометрия без лишнего декора.",
        result: "Чистая линия, “дорого” без заметности.",
        imageSrc: "/catalog/bed.jpg",
      },
      {
        title: "Классика / неоклассика",
        goal: "Поддержать стиль и фурнитуру.",
        result: "Наконечники и крепёж попадают в тон и материал.",
        imageSrc: "/catalog/decor.jpg",
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
    heroImage: "/catalog/decor.jpg",
    bullets: [
      { title: "Цельность", text: "Фурнитура связывает ткань, карниз и мебель в один тон." },
      { title: "Тактильность", text: "Фактура и материал ощущаются “дорого” даже без слов." },
      { title: "Акцент", text: "Добавляем акцент там, где он реально нужен — без перегруза." },
    ],
    cases: [
      {
        title: "Гостиная",
        goal: "Нужен аккуратный акцент на шторах.",
        result: "Подхваты и лента добавляют объём и стиль, не утяжеляя.",
        imageSrc: "/catalog/decor.jpg",
      },
      {
        title: "Спальня",
        goal: "Сделать мягче и спокойнее.",
        result: "Тёплые фактуры и тактильные детали “успокаивают” интерьер.",
        imageSrc: "/catalog/bed.jpg",
      },
      {
        title: "Комбинация с карнизом",
        goal: "Чтобы всё выглядело как комплект.",
        result: "Подбираем металл/цвета — чтобы попадало “в тон”.",
        imageSrc: "/catalog/rails.jpg",
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
    heroImage: "/catalog/rugs.jpg",
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
        imageSrc: "/catalog/rugs.jpg",
      },
      {
        title: "Спальня",
        goal: "Тепло под ногами утром.",
        result: "Комфорт каждый день + мягкая акустика.",
        imageSrc: "/catalog/bed.jpg",
      },
      {
        title: "Детская",
        goal: "Практично и безопасно.",
        result: "Фактура приятная, уход понятный.",
        imageSrc: "/catalog/pillows.jpg",
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
    heroTitle: "Постельное бельё, которое дарит нежность и комфорт каждый день",
    heroSubtitle:
      "Подберём состав, плотность и цвет под спальню. Комфорт, тактильность и спокойный премиум без логотипов.",
    heroImage: "/2foto_dark.jpg",
    bullets: [
      { title: "Тактильность", text: "Материал, который хочется трогать — и который “дышит”." },
      { title: "Цвет", text: "Спокойные оттенки, которые поддерживают интерьер." },
      { title: "Сборка", text: "Подберём комплект: подушки, покрывало, плед — в одном стиле." },
    ],
    cases: [
      {
        title: "Спальня",
        goal: "Комфорт без компромиссов.",
        result: "Сон спокойнее, ощущение “дорого” каждый день.",
        imageSrc: "/catalog/bedding/var6.jpg",
      },
      {
        title: "Гостевая",
        goal: "Чтобы гостям было приятно.",
        result: "Впечатление как в хорошем отеле.",
        imageSrc: "/catalog/покрывала и подушки/var3.jpg",
      },
      {
        title: "Комплект под интерьер",
        goal: "Попасть в цвет и фактуру комнаты.",
        result: "Спальня выглядит собранно и спокойно.",
        imageSrc: "/catalog/bedding/var12_1.jpg",
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
    heroTitle: "Подушки и покрывала — быстрый апгрейд интерьера без ремонта",
    heroSubtitle:
      "Соберём фактуры и цвета под диван, шторы и ковёр. Чтобы выглядело как комплект, а не набор случайных покупок.",
    heroImage: "/catalog/pillows.jpg",
    bullets: [
      { title: "Цвет", text: "Связываем палитру комнаты: 2–3 оттенка вместо хаоса." },
      { title: "Фактура", text: "Добавляем глубину: букле, лен, велюр — по стилю интерьера." },
      { title: "Баланс", text: "Количество и размер подушек — чтобы выглядело аккуратно." },
    ],
    cases: [
      {
        title: "Диван",
        goal: "Сделать зону живой и “дорогой”.",
        result: "Интерьер выглядит продуманно, как в шоуруме.",
        imageSrc: "/catalog/pillows.jpg",
      },
      {
        title: "Спальня",
        goal: "Дать ощущение отеля.",
        result: "Покрывало + подушки собирают кровать как композицию.",
        imageSrc: "/catalog/bed.jpg",
      },
      {
        title: "В связке с шторами",
        goal: "Чтобы текстиль “разговаривал” друг с другом.",
        result: "Один стиль, одна палитра — без перегруза.",
        imageSrc: "/catalog/curtains.jpg",
      },
    ],
    faq: [
      {
        q: "Сколько подушек нужно?",
        a: "Зависит от дивана. Обычно 3–5, но важнее — размер и пропорции.",
      },
      {
        q: "Можно подобрать под мой интерьер по фото?",
        a: "Да. Пришли фото комнаты/дивана — предложим палитру и 2–3 сочетания фактур.",
      },
      {
        q: "Это будет практично?",
        a: "Да — подберём ткань по сценарию: дети/питомцы/частая стирка.",
      },
      {
        q: "Можно ли сделать “как на картинке” из Pinterest?",
        a: "Да. Скинь референсы — мы адаптируем под твою комнату.",
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

  const decorVariantCards = (koenigImages.length
    ? koenigImages
    : Array.from({ length: 24 }).map(() => "/catalog/decor.jpg")
  )
    .slice(0, 72)
    .map((src, idx) => ({
      title: `Вариант ${idx + 1}`,
      imageSrc: src || "/catalog/decor.jpg",
    }));

  const beddingItems: BeddingItemDoc[] = isBedding
    ? await getBeddingItems()
    : [];

  const bedspreadsAndPillowsItems: BedspreadsAndPillowsItemDoc[] = isPillows
    ? await getBedspreadsAndPillowsItems()
    : [];

  const beddingVariantCards = beddingItems.length
    ? beddingItems.map((item) => ({
        imageSrc: item.image || "/catalog/bed.jpg",
        images: item.images || [],
        description: item.description || "",
      }))
    : Array.from({ length: 6 }).map(() => ({
        imageSrc: "/catalog/bed.jpg",
        images: [],
        description: "",
      }));

  const bedspreadsAndPillowsVariantCards = bedspreadsAndPillowsItems.length
    ? bedspreadsAndPillowsItems.map((item) => ({
        imageSrc: item.image || "/catalog/pillows.jpg",
        images: item.images || [],
        description: item.description || "",
      }))
    : [];

  const pillowsVariantCards = (koenigImages.length
    ? koenigImages
    : Array.from({ length: 24 }).map(() => "/catalog/pillows.jpg")
  )
    .slice(0, 72)
    .map((src, idx) => ({
      title: `Вариант ${idx + 1}`,
      imageSrc: src || "/catalog/pillows.jpg",
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
          return docs ?? [];
        } catch {
          return [];
        }
      })()
    : [];

  const curtainTypes: CurtainTypeItem[] = isCurtains ? await getCurtainTypes() : [];
  const blindsTypes: BlindsTypeItem[] = isBlinds ? await getBlindsTypes() : [];

  const heroImageFromDb = pickHeroImageFromDb(slug, koenigImages, railsSubcatDocs, copy.heroImage);
  const publicHeroCover = await pickPublicCatalogCover(slug);
  const heroImage = publicHeroCover || heroImageFromDb;
  const derivedCopy: PageCopy = {
    ...copy,
    heroImage,
    cases: isBedding ? copy.cases : injectCaseImages(copy.cases, koenigImages),
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] pb-20 text-[color:var(--fg)] sm:pb-0">
      <Header />

      <main>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            <div className={isBlinds ? "absolute inset-0 kr-blinds-hero-pan" : "absolute inset-0"}>
              <Image
                src={derivedCopy.heroImage}
                alt={category.title}
                fill
                sizes="100vw"
                className={
                  isBlinds
                    ? "object-cover brightness-[0.98] contrast-[1.06] saturate-[1.02]"
                    : "object-cover brightness-[0.58]"
                }
                priority
              />
            </div>

            {isCurtains ? (
              <>
                <div className="absolute inset-0 hidden sm:block">
                  <Image
                    src="/left_hero.png"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-contain object-left opacity-80 brightness-[0.78] contrast-[1.05] saturate-[0.95]"
                    priority
                  />
                </div>
                <div className="absolute inset-0 hidden sm:block">
                  <Image
                    src="/right_hero.png"
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-contain object-right opacity-80 brightness-[0.78] contrast-[1.05] saturate-[0.95]"
                    priority
                  />
                </div>
              </>
            ) : null}
            <div
              className={
                isBlinds
                  ? "absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.92),rgba(255,255,255,0.22))] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.78),rgba(0,0,0,0.16))]"
                  : "absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.78),rgba(0,0,0,0.14))]"
              }
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_52%),radial-gradient(circle_at_72%_64%,rgba(255,255,255,0.12),transparent_55%)]" />
          </div>

          <Container>
            <div className="relative z-10 grid min-h-[78svh] items-end py-14 sm:py-18">
              <div className="max-w-3xl">
                <div className="mb-5">
                  <a
                    href="/#catalog"
                    className={
                      isBlinds
                        ? "inline-flex h-10 items-center justify-center rounded-full border border-black/12 bg-white/70 px-4 text-xs font-semibold tracking-wide text-black/70 shadow-sm backdrop-blur transition hover:bg-white/85 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:border-white/20 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-white/30"
                        : "inline-flex h-10 items-center justify-center rounded-full border border-white/25 bg-white/0 px-4 text-xs font-semibold tracking-wide text-white/80 shadow-sm backdrop-blur transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    }
                  >
                    <span aria-hidden="true">←</span>
                    <span className="ml-2">Назад в каталог</span>
                  </a>
                </div>

                <div
                  className={
                    isBlinds
                      ? "text-xs font-semibold tracking-[0.34em] text-black/55 dark:text-white/70"
                      : "text-xs font-semibold tracking-[0.34em] text-white/70"
                  }
                >
                  {derivedCopy.kicker}
                </div>
                <h1
                  className={
                    isBlinds
                      ? "mt-4 text-balance text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-6xl"
                      : "mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl"
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
                    <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-black shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-white">
                      <div className="text-sm font-semibold">от 3 900 ₽</div>
                      <div className="mt-0.5 text-xs text-black/55 dark:text-white/65">
                        за окно (ориентир)
                      </div>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-black shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-white">
                      <div className="text-sm font-semibold">срок от 3 дней</div>
                      <div className="mt-0.5 text-xs text-black/55 dark:text-white/65">
                        по наличию / ткани
                      </div>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-black shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-white">
                      <div className="text-sm font-semibold">монтаж — 1 визит</div>
                      <div className="mt-0.5 text-xs text-black/55 dark:text-white/65">
                        чисто и аккуратно
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  >
                    Написать в Telegram
                  </a>
                  <a
                    href="#cases"
                    className={
                      isBlinds
                        ? "inline-flex h-12 items-center justify-center rounded-2xl border border-black/12 bg-white/70 px-5 text-sm font-semibold text-black shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 dark:border-white/25 dark:bg-white/0 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white/30"
                        : "inline-flex h-12 items-center justify-center rounded-2xl border border-white/25 bg-white/0 px-5 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    }
                  >
                    {isBlinds ? "Смотреть примеры" : "Смотреть примеры"}
                  </a>
                </div>

                {isBlinds ? (
                  <div className="mt-8 flex flex-wrap gap-2">
                    <a
                      href="#highlights"
                      className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-white/70 px-4 text-xs font-semibold tracking-wide text-black/70 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/20 dark:bg-white/5 dark:text-white/85 dark:hover:bg-white/10"
                    >
                      Сценарии
                    </a>
                    <a
                      href="#cases"
                      className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-white/70 px-4 text-xs font-semibold tracking-wide text-black/70 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/20 dark:bg-white/5 dark:text-white/85 dark:hover:bg-white/10"
                    >
                      Примеры
                    </a>
                    <a
                      href="#faq"
                      className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-white/70 px-4 text-xs font-semibold tracking-wide text-black/70 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/20 dark:bg-white/5 dark:text-white/85 dark:hover:bg-white/10"
                    >
                      FAQ
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </Container>
        </section>

        {isRails ? (
          <section aria-label="Преимущества" className="bg-[color:var(--bg)]">
            <div className="kr-ticker bg-black/[0.015] py-4 dark:bg-white/[0.02]">
              <div className="kr-ticker-track gap-12 px-4 text-sm font-semibold tracking-[0.22em] text-[color:var(--fg)]/65 sm:px-6 sm:text-base lg:px-8">
                {[...RAILS_VALUES, ...RAILS_VALUES].map((v, i) => (
                  <div key={`${v}-${i}`} className="flex items-center gap-12">
                    <span className="whitespace-nowrap uppercase">{v}</span>
                    <span className="h-[7px] w-[7px] rotate-45 bg-black/15 dark:bg-white/20" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {isPillows ? (
          <section id="pillows-catalog" className="py-14 sm:py-18">
            <div className="bg-[color:var(--bg)]">
              <div className="kr-ticker bg-black/[0.015] py-4 dark:bg-white/[0.02]">
                <div className="kr-ticker-track gap-12 px-4 text-sm font-semibold tracking-[0.22em] text-[color:var(--fg)]/65 sm:px-6 sm:text-base lg:px-8">
                  {[...PILLOWS_VALUES, ...PILLOWS_VALUES].map((v, i) => (
                    <div key={`${v}-${i}`} className="flex items-center gap-12">
                      <span className="whitespace-nowrap uppercase">{v}</span>
                      <span className="h-[7px] w-[7px] rotate-45 bg-black/15 dark:bg-white/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Container>
              <div className="mt-12 grid gap-6 text-center">
                <div>
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КАТАЛОГ ТЕКСТИЛЯ</div>
                  <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-6xl">
                    Варианты под задачу
                  </h2>
                </div>

                <div className="flex justify-center">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Собрать под мой интерьер
                  </a>
                </div>
              </div>

              <div className="mx-auto mt-6 max-w-4xl text-center text-lg leading-8 text-[color:var(--muted)] sm:text-xl">
                <p>
                  Мастера "Koenig Room" изготовят для вас покрывала и  желаемое количество декоративных  подушек — мебельных, диванных, любых форм и размеров.
                </p>
                <p className="mt-5">
                  У нас работают настоящие профессионалы своего дела, которые могут изготовить вариант от простого до эксклюзивного.
                </p>
              </div>

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
            <Container>
              <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ВСЕ КОВРЫ</div>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                    Выберите стиль
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    Быстрый фильтр по стилю. Внутри — фото, название и цена.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <a
                      href="https://koenigcarpet.ru"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
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
                    image: d.image,
                    url: d.url,
                    style: d.style,
                    collection: d.collection,
                    color: d.color,
                  }))}
                />
              </div>
            </Container>
          </section>
        ) : null}

        {isBedding ? (
          <section id="bedding-catalog" className="py-14 sm:py-18">
            <div className="bg-[color:var(--bg)]">
              <div className="kr-ticker bg-black/[0.015] py-4 dark:bg-white/[0.02]">
                <div className="kr-ticker-track gap-12 px-4 text-sm font-semibold tracking-[0.22em] text-[color:var(--fg)]/65 sm:px-6 sm:text-base lg:px-8">
                  {[...BEDDING_VALUES, ...BEDDING_VALUES].map((v, i) => (
                    <div key={`${v}-${i}`} className="flex items-center gap-12">
                      <span className="whitespace-nowrap uppercase">{v}</span>
                      <span className="h-[7px] w-[7px] rotate-45 bg-black/15 dark:bg-white/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Container>
              <div className="mt-12 grid gap-6 text-center">
                <div>
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КАТАЛОГ БЕЛЬЯ</div>
                  <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-6xl">
                    Варианты по ощущению
                  </h2>
                </div>

                <div className="flex justify-center">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Подобрать по ощущениям
                  </a>
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
                intro={`Постельное белье - значительно улучшает качество сна, что очень важно для полноценной активной жизни.
 Но если кровать нестандартной формы или большого размера, то на нее сложно найти подходящую простыню и пододеяльник. А стандартный комплект может не устраивать по качеству пошива или материала. Что же тогда делать ?
Индивидуальный пошив постельного белья у нас  дает возможность получить пододеяльник, простынь и наволочки нужного качества по индивидуальным размерам! 
 Для пошива мы используем  только натуральные и смесовые ткани!`}
              />
            </Container>
          </section>
        ) : null}

        {isRugs ? (
          <section id="rugs-catalog" className="py-14 sm:py-18">
            <div className="bg-[color:var(--bg)]">
              <div className="kr-ticker bg-black/[0.015] py-4 dark:bg-white/[0.02]">
                <div className="kr-ticker-track gap-12 px-4 text-sm font-semibold tracking-[0.22em] text-[color:var(--fg)]/65 sm:px-6 sm:text-base lg:px-8">
                  {[...RUGS_VALUES, ...RUGS_VALUES].map((v, i) => (
                    <div key={`${v}-${i}`} className="flex items-center gap-12">
                      <span className="whitespace-nowrap uppercase">{v}</span>
                      <span className="h-[7px] w-[7px] rotate-45 bg-black/15 dark:bg-white/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Container>
              <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КАТАЛОГ КОВРОВ</div>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                    Варианты под задачу
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    Подбираем размер, фактуру и цвет под мебель и свет — чтобы ковёр собирал интерьер и был удобен в жизни.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Подобрать по фото
                  </a>
                </div>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rugsCatalog.map((it) => (
                  <a key={it.title} href="#cta" className="block" aria-label={it.title}>
                    <div className="group h-full overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={it.imageSrc}
                          alt={it.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-[transform,filter] duration-300 ease-in-out group-hover:scale-[1.05] group-hover:saturate-[1.06]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.14),rgba(0,0,0,0.50))]" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">{it.title}</div>
                            <div className="mt-1 text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">
                              {it.subtitle}
                            </div>
                          </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] transition-colors duration-300 group-hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:group-hover:bg-white/[0.10]">
                            <span
                              aria-hidden="true"
                              className="text-[color:var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5"
                            >
                              →
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{it.text}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {isRoman ? (
          <section aria-label="Преимущества" className="bg-[color:var(--bg)]">
            <div className="kr-ticker bg-black/[0.015] py-4 dark:bg-white/[0.02]">
              <div className="kr-ticker-track gap-12 px-4 text-sm font-semibold tracking-[0.22em] text-[color:var(--fg)]/65 sm:px-6 sm:text-base lg:px-8">
                {[...ROMAN_VALUES, ...ROMAN_VALUES].map((v, i) => (
                  <div key={`${v}-${i}`} className="flex items-center gap-12">
                    <span className="whitespace-nowrap uppercase">{v}</span>
                    <span className="h-[7px] w-[7px] rotate-45 bg-black/15 dark:bg-white/20" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {isBlinds ? (
          <section id="blinds-subcatalog" className="py-14 sm:py-18">
            <Container>
              <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                    КАТЕГОРИИ ЖАЛЮЗИ
                  </div>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                    Выберите тип
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    Быстро сориентируем по ощущениям, свету и приватности. Дальше — примеры и варианты в каждой категории.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Подобрать по фото
                  </a>
                </div>
              </div>

              <BlindsCategoriesNav
                koenigImages={koenigImages}
                items={blindsTypes}
                categories={[
                  {
                    subslug: "aluminum",
                    title: "Алюминиевые жалюзи",
                    text: "Практичное и долговечное решение для регулировки освещения, обеспечивающее стильный вид и защиту от солнца.",
                    imageIdx: 0,
                  },
                  {
                    subslug: "wood",
                    title: "Деревянные жалюзи",
                    text: "Сочетание натуральной эстетики и функциональности: комфортная светорегуляция и стильное оформление интерьера.",
                    imageIdx: 6,
                  },
                  {
                    subslug: "pleated",
                    title: "Жалюзи плиссе",
                    text: "Функциональное решение для окон любой формы: комфортную светорегуляцию, защиту от солнца и эстетичный вид.",
                    imageIdx: 12,
                  },
                  {
                    subslug: "roman",
                    title: "Римские шторы",
                    text: "Элегантное и практичное решение для окон, сочетающее стильный дизайн и удобство в ежедневном использовании.",
                    imageIdx: 18,
                  },
                  {
                    subslug: "roller",
                    title: "Рулонные шторы",
                    text: "Современное и функциональное решение для окон: комфорт, лаконичность и точное управление светом.",
                    imageIdx: 24,
                  },
                ]}
              />
            </Container>
          </section>
        ) : null}

        {isBlinds ? <BlindsCarousel images={koenigImages} /> : null}

        {isBlinds ? <BlindsShowcase images={koenigImages} /> : null}

        {isRails ? <RailsShowcase images={koenigImages} /> : null}

        {isDecor ? (
          <section id="decor-catalog" className="py-14 sm:py-18">
            <div className="bg-[color:var(--bg)]">
              <div className="kr-ticker bg-black/[0.015] py-4 dark:bg-white/[0.02]">
                <div className="kr-ticker-track gap-12 px-4 text-sm font-semibold tracking-[0.22em] text-[color:var(--fg)]/65 sm:px-6 sm:text-base lg:px-8">
                  {[...DECOR_VALUES, ...DECOR_VALUES].map((v, i) => (
                    <div key={`${v}-${i}`} className="flex items-center gap-12">
                      <span className="whitespace-nowrap uppercase">{v}</span>
                      <span className="h-[7px] w-[7px] rotate-45 bg-black/15 dark:bg-white/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Container>
              <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                    КАТАЛОГ ДЕТАЛЕЙ
                  </div>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                    Финальный штрих
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    Не добавляем “ещё немного декора”. Подбираем один сильный акцент и собираем всё в цельный комплект.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Собрать комплект
                  </a>
                </div>
              </div>

              <RailsVariantsCatalog
                cards={decorVariantCards}
                contextBase={{
                  source: "koenigroom.ru",
                  kind: "decor",
                  url: "/catalog/decor",
                  category: "Декор и фурнитура",
                  title: "Декор и фурнитура",
                }}
              />
            </Container>
          </section>
        ) : null}

        {isRoman ? (
          <section id="roman-catalog" className="py-14 sm:py-18">
            <Container>
              <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                    КАТАЛОГ РИМСКИХ
                  </div>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                    Варианты по задаче
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    Подбираем ткань и механику под сценарий света. Всё должно быть чисто по линии окна и удобно каждый день.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Подобрать под мой интерьер
                  </a>
                </div>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {romanCatalog.map((it) => (
                  <a key={it.title} href="#cta" className="block" aria-label={it.title}>
                    <div className="group h-full overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={it.imageSrc}
                          alt={it.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-[transform,filter] duration-300 ease-in-out group-hover:scale-[1.05] group-hover:saturate-[1.06]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.14),rgba(0,0,0,0.50))]" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">
                              {it.title}
                            </div>
                            <div className="mt-1 text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">
                              {it.subtitle}
                            </div>
                          </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] transition-colors duration-300 group-hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:group-hover:bg-white/[0.10]">
                            <span
                              aria-hidden="true"
                              className="text-[color:var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5"
                            >
                              →
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{it.text}</div>
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
            <div className="bg-[color:var(--bg)]">
              <div className="kr-ticker bg-black/[0.015] py-4 dark:bg-white/[0.02]">
                <div className="kr-ticker-track gap-12 px-4 text-sm font-semibold tracking-[0.22em] text-[color:var(--fg)]/65 sm:px-6 sm:text-base lg:px-8">
                  {[...CURTAINS_VALUES, ...CURTAINS_VALUES].map((v, i) => (
                    <div key={`${v}-${i}`} className="flex items-center gap-12">
                      <span className="whitespace-nowrap uppercase">{v}</span>
                      <span className="h-[7px] w-[7px] rotate-45 bg-black/15 dark:bg-white/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Container>
              <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                    КАТАЛОГ ШТОР
                  </div>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                    Примерный ассортимент
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    Не “список тканей”, а варианты по задаче. Подскажем, что даст нужный эффект именно в вашей комнате.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Составить комплект
                  </a>
                </div>
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
              <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                    ПОДКАТЕГОРИИ
                  </div>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                    Коллекции карнизов
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    Выберите коллекцию — внутри будут варианты и фото. Названия вариантов пока условные (Вариант 1, 2...).
                  </p>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Подобрать комплект
                  </a>
                </div>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {RAILS_SUBCATEGORIES.map((s, idx) => {
                  const doc = railsSubcatDocs[idx] ?? null;
                  const img = pickKoenigImages(doc)[0] || "/catalog/rails.jpg";
                  return (
                    <Link
                      key={s.subslug}
                      href={`/catalog/rails/${s.subslug}`}
                      className="block"
                      aria-label={s.title}
                    >
                      <div className="group h-full overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={img}
                            alt={s.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-[transform,filter] duration-300 ease-in-out group-hover:scale-[1.05] group-hover:saturate-[1.08]"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.14),rgba(0,0,0,0.50))]" />
                        </div>
                        <div className="flex items-center justify-between gap-4 bg-white/70 p-5 text-[color:var(--fg)] backdrop-blur dark:bg-white/5">
                          <div className="text-base font-semibold tracking-tight">{s.subslug}</div>
                          <div className="inline-flex h-10 items-center justify-center rounded-xl bg-black/[0.06] px-4 text-sm font-semibold text-[color:var(--fg)] transition-colors duration-300 group-hover:bg-black/[0.10] dark:bg-white/[0.10] dark:group-hover:bg-white/[0.14]">
                            Подробнее
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Container>
          </section>
        ) : null}

        {isCurtains ? (
          <section
            id="why"
            className="relative w-full overflow-hidden bg-[color:var(--bg)] py-18 text-[color:var(--fg)] sm:py-24"
          >
            <div
              aria-hidden="true"
              className="kr-curtains-float-a pointer-events-none absolute left-10 top-20 h-64 w-64 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]"
            />
            <div
              aria-hidden="true"
              className="kr-curtains-float-b pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-black/[0.025] blur-3xl dark:bg-white/[0.035]"
            />
            <div
              aria-hidden="true"
              className="kr-curtains-float-c pointer-events-none absolute left-1/4 top-1/2 h-3 w-3 rounded-full bg-black/15 dark:bg-white/20"
            />
            <div
              aria-hidden="true"
              className="kr-curtains-float-c pointer-events-none absolute bottom-1/3 right-1/4 h-5 w-5 rounded-full bg-black/10 dark:bg-white/15"
            />

            <Container>
              <div className="relative z-10">
                <div className="flex flex-col items-center">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ЗАЧЕМ</div>
                  <h2 className="mt-4 text-center text-4xl font-light tracking-tight sm:text-5xl">
                    “Дорого” в шторах — это посадка и свет
                  </h2>
                  <div className="mt-5 h-1 w-24 bg-[color:var(--accent)]" />
                  <p className="mt-8 max-w-2xl text-center text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    Мы собираем комплект под интерьер: как падает свет, какая нужна приватность, где добавить фактуру —
                    и как сделать линию штор идеально ровной.
                  </p>
                </div>

                <div className="mt-14 grid items-stretch gap-8 md:grid-cols-3">
                  <div className="space-y-12">
                    <div className="group">
                      <div className="flex items-center gap-3">
                        <div className="relative rounded-xl bg-[#88734C]/10 p-3 text-[#88734C] transition-colors duration-300 group-hover:bg-[#88734C]/20">
                          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="M4.93 4.93l1.41 1.41" />
                            <path d="M17.66 17.66l1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="M4.93 19.07l1.41-1.41" />
                            <path d="M17.66 6.34l1.41-1.41" />
                            <circle cx="12" cy="12" r="4" />
                          </svg>
                          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#A9BBC8]" />
                        </div>
                        <h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-[#88734C]">
                          Свет и приватность
                        </h3>
                      </div>
                      <p className="mt-3 pl-12 text-sm leading-relaxed text-[#202e44]/80">
                        Подбираем прозрачность и слойность, чтобы днём было светло, а вечером — комфортно.
                      </p>
                      <div className="mt-3 pl-12 text-xs font-medium text-[#88734C] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Смотреть примеры →
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-3">
                        <div className="relative rounded-xl bg-[#88734C]/10 p-3 text-[#88734C] transition-colors duration-300 group-hover:bg-[#88734C]/20">
                          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 21h6" />
                            <path d="M7 21V3" />
                            <path d="M21 21h-6" />
                            <path d="M17 21V6" />
                            <path d="M7 7h10" />
                            <path d="M7 12h10" />
                            <path d="M7 17h10" />
                          </svg>
                          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#A9BBC8]" />
                        </div>
                        <h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-[#88734C]">
                          Высота и пропорции
                        </h3>
                      </div>
                      <p className="mt-3 pl-12 text-sm leading-relaxed text-[#202e44]/80">
                        Рассчитываем длину, ширину и складку — чтобы шторы «держали» стену и выглядели собранно.
                      </p>
                      <div className="mt-3 pl-12 text-xs font-medium text-[#88734C] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Составить комплект →
                      </div>
                    </div>
                  </div>

                  <div className="order-first flex items-center justify-center md:order-none">
                    <div className="relative w-full max-w-xs">
                      <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[transform,box-shadow] duration-500 [transform-style:preserve-3d] hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(-3deg)] hover:shadow-[0_24px_70px_rgba(0,0,0,0.20)] dark:border-white/10 dark:bg-white/5 dark:hover:shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
                        <Image
                          src="/catalog/rails.jpg"
                          alt="Шторы в интерьере"
                          width={640}
                          height={760}
                          className="h-auto w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent dark:from-black/65" />
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <a
                            href="#curtains-catalog"
                            className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition group-hover:shadow-md dark:bg-white/90"
                          >
                            Каталог штор <span aria-hidden="true" className="ml-2">→</span>
                          </a>
                        </div>
                      </div>

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -m-3 -z-10 rounded-2xl border-2 border-black/10 transition-[transform,opacity] duration-500 [transform:translate3d(0,0,0)] group-hover:[transform:translate3d(2px,-2px,0)] dark:border-white/10"
                      />
                      <div
                        aria-hidden="true"
                        className="kr-curtains-float-c pointer-events-none absolute -right-8 -top-4 h-16 w-16 rounded-full bg-black/[0.03] dark:bg-white/[0.04]"
                      />
                      <div
                        aria-hidden="true"
                        className="kr-curtains-float-c pointer-events-none absolute -bottom-6 -left-10 h-20 w-20 rounded-full bg-black/[0.035] dark:bg-white/[0.05]"
                      />
                      <div
                        aria-hidden="true"
                        className="kr-curtains-float-c pointer-events-none absolute -top-8 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-black/20 dark:bg-white/25"
                      />
                      <div
                        aria-hidden="true"
                        className="kr-curtains-float-c pointer-events-none absolute -bottom-10 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-black/15 dark:bg-white/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="group">
                      <div className="flex items-center gap-3">
                        <div className="relative rounded-xl bg-[#88734C]/10 p-3 text-[#88734C] transition-colors duration-300 group-hover:bg-[#88734C]/20">
                          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" />
                          </svg>
                          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#A9BBC8]" />
                        </div>
                        <h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-[#88734C]">
                          Фактура и цвет
                        </h3>
                      </div>
                      <p className="mt-3 pl-12 text-sm leading-relaxed text-[#202e44]/80">
                        Ткань должна читаться в вашем свете. Подбираем так, чтобы интерьер становился теплее и глубже.
                      </p>
                      <div className="mt-3 pl-12 text-xs font-medium text-[#88734C] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Подобрать ткань →
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-3">
                        <div className="relative rounded-xl bg-[#88734C]/10 p-3 text-[#88734C] transition-colors duration-300 group-hover:bg-[#88734C]/20">
                          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 7h-9" />
                            <path d="M14 17H5" />
                            <path d="M20 17h-2" />
                            <path d="M7 7H5" />
                            <path d="M10 7l-4 10" />
                            <path d="M18 7l-4 10" />
                          </svg>
                          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#A9BBC8]" />
                        </div>
                        <h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-[#88734C]">
                          Пошив и монтаж
                        </h3>
                      </div>
                      <p className="mt-3 pl-12 text-sm leading-relaxed text-[#202e44]/80">
                        Важно не только выбрать ткань, но и сделать финальный вид: ровная линия, чистые узлы, аккуратная установка.
                      </p>
                      <div className="mt-3 pl-12 text-xs font-medium text-[#88734C] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Рассчитать в Telegram →
                      </div>
                    </div>
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
                    <a
                      href={CONTACTS.telegramHref}
                      className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    >
                      Подобрать карниз
                    </a>
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
                          src="/catalog/carnis.jpg"
                          alt="Карнизы"
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.06] group-hover:saturate-[1.10]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.30),rgba(0,0,0,0.72))] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22),rgba(0,0,0,0.36),rgba(0,0,0,0.78))]" />

                        <div className="relative z-10 flex h-full flex-col justify-end p-7">
                          <div className="text-xs font-semibold tracking-[0.28em] text-white/75">БЫСТРО</div>
                          <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
                            Посмотреть варианты
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
                      <a
                        href={CONTACTS.telegramHref}
                        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      >
                        Написать в Telegram
                      </a>
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
                          src="/catalog/roman.jpg"
                          alt="Римские шторы"
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.06] group-hover:saturate-[1.10]"
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
                      <a
                        href={CONTACTS.telegramHref}
                        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      >
                        Написать в Telegram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : isDecor ? (
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
                      Ощущение дорогого интерьера создаётся не ценой материалов, а вниманием к деталям
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                      Кисти, подхваты и тесьма могут придать пространству утончённый вид, подчеркнуть продуманность проекта.
                    </p>
                  </div>
                  <div className="lg:col-span-4 lg:flex lg:justify-end">
                    <a
                      href="#decor-catalog"
                      className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    >
                      Смотреть примеры
                    </a>
                  </div>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <div className="group h-full rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                      <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">01</div>
                      <div className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--fg)]">Цельность</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Связываем ткань, карниз и мебель: один металл, один тон, одна логика.
                      </div>
                      <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                        В тон интерьеру →
                      </div>
                    </div>
                  </div>

                  <div className="order-first lg:order-none lg:col-span-4">
                    <a href="#cta" className="block" aria-label="Собрать комплект">
                      <div className="group relative h-full min-h-[420px] overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-white/5 dark:hover:shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
                        <Image
                          src="/catalog/decor.jpg"
                          alt="Декор и фурнитура"
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.06] group-hover:saturate-[1.10]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.30),rgba(0,0,0,0.72))] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22),rgba(0,0,0,0.36),rgba(0,0,0,0.78))]" />

                        <div className="relative z-10 flex h-full flex-col justify-end p-7">
                          <div className="text-xs font-semibold tracking-[0.28em] text-white/75">АКЦЕНТ</div>
                          <div className="mt-2 text-2xl font-semibold tracking-tight text-white">Собрать комплект</div>
                          <div className="mt-3 text-sm leading-6 text-white/80">
                            2 фото (ткань + окно/стена) — предложим 2–3 детали и объясним, почему именно они.
                          </div>
                          <div className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black shadow-sm transition group-hover:shadow-md">
                            Написать <span aria-hidden="true" className="ml-2">→</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="group h-full rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                      <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">02</div>
                      <div className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--fg)]">Один сильный штрих</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Вместо множества мелких — одна точная деталь: подхват или кисть, правильная по масштабу.
                      </div>
                      <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                        Без перегруза →
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-6">
                    <div className="rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                      <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">03</div>
                      <div className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--fg)]">Металл и тон</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Выбираем оттенок глядя на фурнитуру мебели и светильники.
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="rounded-3xl border border-black/10 bg-white/60 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                      <div className="text-sm font-semibold text-[color:var(--fg)]">Спросить совет</div>
                      <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                        Напишите: стиль комнаты + фото ткани/карниза. Мы предложим 2–3 детали и объясним разницу.
                      </div>
                      <a
                        href={CONTACTS.telegramHref}
                        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      >
                        Написать в Telegram
                      </a>
                    </div>
                  </div>
                </div>
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
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                  ПРИМЕРЫ
                </div>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                  Реальные задачи — понятные решения
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                  Три сценария, чтобы быстро понять логику: цель → подбор → аккуратный финальный вид.
                </p>
              </div>
              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <a
                  href={CONTACTS.telegramHref}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                >
                  Подобрать под мой интерьер
                </a>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {derivedCopy.cases.map((c) => (
                <a key={c.title} href="#cta" aria-label={c.title} className="block">
                  <div
                    className={
                      isRails
                        ? "group h-full overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                        : "group h-full overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    }
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={c.imageSrc}
                        alt={c.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className={
                          isRails
                            ? "object-cover transition-[transform,filter] duration-300 ease-in-out group-hover:scale-[1.06] group-hover:saturate-[1.08]"
                            : "object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.04]"
                        }
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.22),rgba(0,0,0,0.55))]" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">
                          {c.title}
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] transition-colors duration-300 group-hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:group-hover:bg-white/[0.10]">
                          <span
                            aria-hidden="true"
                            className={
                              isRails
                                ? "text-[color:var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45"
                                : "text-[color:var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5"
                            }
                          >
                            →
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm leading-6 text-[color:var(--muted)]">
                        <div>
                          <span className="font-semibold text-[color:var(--fg)]">Задача:</span> {c.goal}
                        </div>
                        <div>
                          <span className="font-semibold text-[color:var(--fg)]">Итог:</span> {c.result}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>

        <section id="faq" className="bg-black/[0.02] py-14 dark:bg-white/[0.03] sm:py-18">
          <Container>
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">FAQ</div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
                  Частые вопросы
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                  Коротко и по делу — чтобы решить сомнения до покупки.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="grid gap-3">
                  {copy.faq.map((it) => (
                    <details
                      key={it.q}
                      className="group rounded-3xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur open:bg-white/75 dark:border-white/10 dark:bg-white/5"
                    >
                      <summary className="cursor-pointer list-none text-base font-semibold text-[color:var(--fg)] outline-none">
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
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  >
                    Задать вопрос в Telegram
                  </a>
                  {isRugs ? (
                    <a
                      href="https://koenigcarpet.ru/ru/vr"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      Виртуальная примерка ковра
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="cta" className="py-14 sm:py-18">
          <Container>
            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                    БЫСТРЫЙ СТАРТ
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
                    Напишите 2 сообщения — и мы предложим 2–3 решения
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                    1) Комната и цель (блики/приватность/blackout) 2) фото окна и общий вид стены.
                  </p>
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] lg:w-auto"
                  >
                    Написать в Telegram
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {isBlinds ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50 hidden lg:block">
          <div className="pointer-events-auto rounded-3xl border border-black/10 bg-white/70 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="px-2 pb-2 text-xs font-medium text-[color:var(--muted)]">
              Подбор за 2 сообщения
            </div>
            <a
              href={CONTACTS.telegramHref}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      ) : null}

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
