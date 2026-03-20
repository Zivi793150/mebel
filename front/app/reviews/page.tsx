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
  const photos = [
    "/catalog/1.Шторы и ткани/1.1.Австрийские/photo_2026-03-02_16-21-17.jpg",
    "/catalog/1.Шторы и ткани/1.13.Шторы в спальню/IMG_1426-HDR.jpg",
    "/catalog/1.Шторы и ткани/1.13.Шторы в спальню/IMG_1500-HDR.jpg",
    "/catalog/1.Шторы и ткани/1.14 Шторы на люверсах/1.webp",
    "/catalog/1.Шторы и ткани/1.15 Шторы в ванную/photo_2026-03-12_17-12-04.jpg",
    "/catalog/1.Шторы и ткани/1.11. Шторы  кабинет/RED_0542.JPG",
    "/catalog/1.Шторы и ткани/1.15 Шторы в ванную/photo_2026-03-12_17-00-54.jpg",
    "/catalog/1.Шторы и ткани/1.11. Шторы  кабинет/photo_2025-10-07_15-26-09.jpg",
  ].map((src) => encodeURI(src));

  const avatars = [
    "/catalog/1.Шторы и ткани/1.13.Шторы в спальню/IMG_7456-HDR-1.jpg",
    "/catalog/1.Шторы и ткани/1.15 Шторы в ванную/IMG_7486-HDR-1 (1).jpg",
    "/catalog/1.Шторы и ткани/1.11. Шторы  кабинет/SVMF9688.jpg",
    "/catalog/1.Шторы и ткани/1.11. Шторы  кабинет/photo_2026-03-03_12-19-19.jpg",
  ].map((src) => encodeURI(src));

  const testimonials = [
    {
      quote:
        "Заказала ковëр в спальню. Мне нужен был не стандартный размер. Осталась довольна результатом. И что очень важно для меня, натуральный состав! Очень приятно ходить босиком. Огромный выбор оттенков, глаза разбегаются! А ещё, эти ребята занимаются шторами! И моë знакомство с ними, началось именно с этого! Так держать! Дальнейшего вам развития, и спасибо за красоту в доме!!!",
      name: "Мария Н",
      role: "2ГИС · 19 февраля",
      avatarSrc: avatars[0],
    },
    {
      quote:
        "Заказывала ковер круглый в детскую, нужен был розовый определенного оттенка. Результат превзошел все мои ожидания! Спасибо ❤️❤️",
      name: "Татьяна Рассказова",
      role: "2ГИС · 18 февраля",
      avatarSrc: avatars[1],
    },
    {
      quote:
        "Купили два ковра в данном салоне. Добираться далековато, но это того стоило. Ковры отличного качества ! Рекомендую.",
      name: "Алексей Леонов",
      role: "2ГИС · 13 февраля",
      avatarSrc: avatars[2],
    },
    {
      quote:
        "Пишу отзыв и радуюсь! Наконец появился салон с широким и нестандартным ассортиментом. Смогут удовлетворить потребности любого клиента, и цветов много и форм и размер могут сделать не стандартный. У нас был запрос на ковер 3*6! Теперь ждём свой коврик из производства❤️",
      name: "Александр Ч",
      role: "2ГИС · 6 февраля",
      avatarSrc: avatars[3],
    },
    {
      quote:
        "Недавно посетила салон ковров Koenig carpet, осталась очень довольна обслуживанием и ассортиментом. Продавец-консультант Юлия оказалась компетентной и внимательной, помогла выбрать идеальный вариант для моего интерьера. Качество ковров высокое, представлены разнообразные коллекции на любой вкус и бюджет. Оформление покупки прошло быстро и без проблем. Рекомендую этот магазин всем, кто ищет качественные ковры!",
      name: "Евгения С",
      role: "2ГИС · 29 января",
      avatarSrc: avatars[0],
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
