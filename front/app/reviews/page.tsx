import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/Container";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { ContactButton } from "@/components/ContactButton";
import { getMongoClient } from "@/lib/mongo";
import { ReviewsMarquee } from "@/sections/ReviewsMarquee";

export const metadata: Metadata = {
  title: "Отзывы клиентов — Koenig Room",
  description: "Реальные отзывы клиентов Koenig Room о шторах, жалюзи и интерьерном декоре. Фото работ и впечатления заказчиков из Калининграда.",
  openGraph: {
    title: "Отзывы клиентов — Koenig Room",
    description: "Реальные отзывы клиентов о шторах, жалюзи и интерьерном декоре в Калининграде.",
  },
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
    "/catalog/1.shtory-i-tkani/1.1.avstriyskie/photo_2026-03-02_16-21-17.webp",
    "/catalog/1.shtory-i-tkani/1.13.shtory-v-spalnyu/IMG_1426-HDR.webp",
    "/catalog/1.shtory-i-tkani/1.13.shtory-v-spalnyu/IMG_1500-HDR.webp",
    "/catalog/1.shtory-i-tkani/1.14-shtory-na-lyuversah/1.webp",
    "/catalog/1.shtory-i-tkani/1.15-shtory-v-vannuyu/photo_2026-03-12_17-12-04.webp",
    "/catalog/1.shtory-i-tkani/1.11.-shtory-kabinet/RED_0542.webp",
    "/catalog/1.shtory-i-tkani/1.15-shtory-v-vannuyu/photo_2026-03-12_17-00-54.webp",
    "/catalog/1.shtory-i-tkani/1.11.-shtory-kabinet/photo_2025-10-07_15-26-09.webp",
  ].map((src) => encodeURI(src));

  const avatars = [
    "/catalog/1.shtory-i-tkani/1.13.shtory-v-spalnyu/IMG_7456-HDR-1.webp",
    "/catalog/1.shtory-i-tkani/1.15-shtory-v-vannuyu/IMG_7486-HDR-1 (1).webp",
    "/catalog/1.shtory-i-tkani/1.11.-shtory-kabinet/SVMF9688.webp",
    "/catalog/1.shtory-i-tkani/1.11.-shtory-kabinet/photo_2026-03-03_12-19-19.webp",
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
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main className="py-14 sm:py-18">
        <Container>
          {/* Hero */}
          <section className="text-center">
            <h1 className="text-4xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-5xl lg:text-6xl">
              Отзывы
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-base leading-7 text-[color:var(--muted)]">
              Что говорят наши клиенты о подборе, пошиве и монтаже
            </p>
            <div className="mt-8">
              <ContactButton
                className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]"
                imageSrc="/foto-na-knopku-1-.webp"
              >
                Напишите нам
              </ContactButton>
            </div>
          </section>

          {/* Reviews Marquee */}
          <div className="mt-16">
            <ReviewsMarquee testimonials={testimonials} photoCards={photos} columns={3} />
          </div>
        </Container>
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
