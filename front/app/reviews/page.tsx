import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/Container";
import { getMongoClient } from "@/lib/mongo";
import { ReviewsMarquee } from "@/sections/ReviewsMarquee";

export const metadata: Metadata = {
  title: "Отзывы — Koenig Room",
  description: "Отзывы клиентов Koenig Room.",
};

type KoenigCatalogItem = {
  index: number;
  large_url: string;
};

type KoenigCatalogDoc = {
  source?: string;
  slug: string;
  items?: KoenigCatalogItem[];
};

async function getPortfolioImages(): Promise<string[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<KoenigCatalogDoc>("catalog_items");
    const doc = await col.findOne(
      { source: "koenigroom.ru", slug: "portfolio" },
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

function pickStable(images: string[], indexes: number[]): string[] {
  if (images.length === 0) return [];
  return indexes.map((i) => images[i % images.length]);
}

export default async function ReviewsPage() {
  const portfolio = await getPortfolioImages();
  const [a1, a2, a3, a4, a5, a6, a7, a8, a9] = pickStable(portfolio, [2, 6, 10, 14, 18, 22, 26, 30, 34]);
  const photos = pickStable(portfolio, [1, 5, 9, 13, 17, 21, 25, 29]);

  const testimonials = [
    {
      quote:
        "Очень деликатно подобрали ткань под свет и мебель. Итог выглядит дороже, чем мы ожидали — без лишней суеты.",
      name: "Анна К.",
      role: "Квартира, Калининград",
      avatarSrc: a1,
    },
    {
      quote:
        "Понравилось, что всё сделали под ключ: замер, пошив, монтаж. Чисто, аккуратно, точно по срокам.",
      name: "Игорь П.",
      role: "Дом, Светлогорск",
      avatarSrc: a2,
    },
    {
      quote:
        "Помогли собрать интерьер в единую историю: фактуры, карнизы, подхваты. Видно опыт и вкус.",
      name: "Мария С.",
      role: "Дизайнер",
      avatarSrc: a3,
    },
    {
      quote:
        "Сложная задача по эркеру решилась без компромиссов. Очень точная работа руками.",
      name: "Елена М.",
      role: "Частный дом",
      avatarSrc: a4,
    },
    {
      quote:
        "Нужны были жалюзи и текстиль в одном стиле — сделали комплект, всё выглядит цельно.",
      name: "Дмитрий Н.",
      role: "Апартаменты",
      avatarSrc: a5,
    },
    {
      quote:
        "Сильная команда: спокойно ведут проект и предлагают варианты, а не навязывают.",
      name: "Ольга Р.",
      role: "Квартира",
      avatarSrc: a6,
    },
    {
      quote:
        "Качество пошива и посадки штор после монтажа — отдельное удовольствие. Результат идеальный.",
      name: "Светлана И.",
      role: "Дом",
      avatarSrc: a7,
    },
    {
      quote:
        "Сработали быстро: от первого созвона до готового результата. Спасибо за заботу о деталях.",
      name: "Алексей В.",
      role: "Офис",
      avatarSrc: a8,
    },
    {
      quote:
        "Уровень материалов и работа с партнёрами чувствуется сразу. Будем обращаться ещё.",
      name: "Наталья Л.",
      role: "Квартира",
      avatarSrc: a9,
    },
  ];

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)] transition-colors duration-300">
      <Header />

      <main className="py-8 sm:py-10">
        <section aria-labelledby="testimonials-heading" className="relative overflow-hidden bg-transparent py-10 sm:py-12">
          <Container>
            <div className="mx-auto mb-8 flex max-w-[540px] flex-col items-center justify-center">
              <div className="flex justify-center">
                <div className="rounded-full border border-neutral-300 bg-neutral-100/50 px-4 py-1 text-xs font-semibold tracking-wide text-neutral-600 transition-colors dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400">
                  Отзывы
                </div>
              </div>
              <h1
                id="testimonials-heading"
                className="mt-6 text-center text-4xl font-extrabold tracking-tight text-neutral-900 transition-colors dark:text-white md:text-5xl"
              >
                Что говорят наши клиенты
              </h1>
              <p className="mt-5 max-w-sm text-center text-lg leading-relaxed text-neutral-500 transition-colors dark:text-neutral-400">
                Реальные впечатления о подборе, пошиве и монтаже.
              </p>
            </div>

            <div className="mt-10">
              <ReviewsMarquee testimonials={testimonials} photoCards={photos} columns={3} />
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
