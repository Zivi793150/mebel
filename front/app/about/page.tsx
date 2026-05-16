import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TelegramPromoBlock } from "@/components/TelegramPromoBlock";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/Container";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { ContactButton } from "@/components/ContactButton";
import { getMongoClient } from "@/lib/mongo";
import { AboutStory } from "@/sections/AboutStory";
import { AboutParallaxGallery } from "@/sections/AboutParallaxGallery";
import { AboutHoverPreview } from "@/sections/AboutHoverPreview";
import { AboutVideoVertical } from "@/sections/AboutVideoVertical";
import { WorkSteps } from "@/sections/WorkSteps";

export const metadata: Metadata = {
  title: "О нас — Koenig Room",
  description: "История и команда Koenig Room. Премиальные шторы, жалюзи и интерьерный декор в Калининграде с 2018 года.",
  openGraph: {
    title: "О нас — Koenig Room",
    description: "История и команда Koenig Room. Премиальные шторы, жалюзи и интерьерный декор в Калининграде.",
    images: ["/about_us.webp"],
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
  } catch (err) {
    console.error("Failed to fetch portfolio images:", err);
    return [];
  }
}

function pickStable(images: string[], indexes: number[]): string[] {
  if (images.length === 0) return [];
  return indexes.map((i) => images[i % images.length]);
}

export default async function AboutPage() {
  const portfolio = await getPortfolioImages();
  const [heroImg, p1, p2, p3, p4, p5] = pickStable(portfolio, [1, 3, 11, 19, 27, 35]);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main className="py-14 sm:py-18">
        <Container>
          {/* Hero */}
          <section className="text-center">
            <h1 className="text-4xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-5xl lg:text-6xl">
              О нас
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-base leading-7 text-[color:var(--muted)]">
              Текстильный дизайн как дело жизни
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

          {/* Main Content */}
          <section className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)]">
                <Image
                  src="/about_us.webp"
                  alt="Koenig Room"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  loading="eager"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="mt-8">
                <AboutHoverPreview
                  items={[
                    {
                      key: "fabrics",
                      label: "подбор тканей",
                      title: "Подбор тканей",
                      imageSrc: "/ab1.webp",
                    },
                    {
                      key: "workshop",
                      label: "собственный цех",
                      title: "Собственный цех",
                      imageSrc: "/ab2.webp",
                    },
                    {
                      key: "install",
                      label: "монтаж",
                      title: "Монтаж",
                      imageSrc: "/ab3.webp",
                    },
                  ]}
                  paragraphs={[
                    "Нам искренне приятно приветствовать вас и открыть двери в мир, где дизайн становится искусством.",
                    "Мы — команда, для которой создание красоты и гармонии в интерьере — не просто работа, а главное дело жизни. Когда-то мы мечтали вопреки сомнениям окружающих, а сегодня с гордостью воплощаем эти мечты в реальность.",
                    "Всё началось в 2002 году с инициативы нашего ведущего дизайнера и сооснователя Татьяны Наумовой. За эти годы мы выросли из смелой идеи в один из ведущих салонов Калининграда, задающий тон в текстильном и интерьерном дизайне.",
                    "Мы не стоим на месте: постоянно учимся, посещаем ключевые мировые выставки и расширяем горизонты своих знаний. Наши партнёры — это лучшие и самые надёжные производители текстиля. Дважды в год мы представляем новые коллекции, чтобы вы могли первыми прикоснуться к самым актуальным тенденциям в декорировании интерьеров.",
                  ]}
                />
              </div>
            </div>
          </section>
        </Container>

        <div className="mt-14">
          <AboutStory images={portfolio} />
        </div>

        <TelegramPromoBlock />

        <WorkSteps />

        <section className="py-14 sm:py-18">
          <Container>
            <div className="text-center">
              <h2 className="text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-3xl">
                Профессионально и с уважением к вашему дому!
              </h2>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="space-y-6">
                  <p className="text-sm leading-6 text-[color:var(--muted)]">
                    Мы строим работу вокруг вашего запроса: внимательно слушаем, предлагаем оптимальные решения и несём ответственность за результат.
                  </p>
                  <p className="text-sm leading-6 text-[color:var(--muted)]">
                    Наш подход — это чёткий проект, надёжные партнёры и строгий контроль качества. Благодаря этому ремонт проходит спокойно и предсказуемо, а интерьер воплощается именно так, как вы задумали.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-6">
                  <div className="text-sm font-medium text-[color:var(--fg)]">Куда дальше?</div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    Напишите нам — и мы предложим 2–3 решения под ваш интерьер и задачи по свету.
                  </div>
                  <div className="mt-6 grid gap-3">
                    <Link
                      href="/contacts"
                      className="inline-flex h-11 items-center justify-center bg-[color:var(--accent)] px-5 text-sm font-medium text-[color:var(--accent-contrast)] transition hover:opacity-95"
                    >
                      Наши контакты
                    </Link>
                    <Link
                      href="/#catalog"
                      className="inline-flex h-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-5 text-sm font-medium text-[color:var(--fg)] transition hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      Посмотреть каталог
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Вертикальное видео под секцией */}
        <AboutVideoVertical
          videos={[
            "/rilsy/2_5255840742420550656.MOV",
            "/rilsy/2_5379691566124275907.MOV",
            "/rilsy/IMG_1959.MOV",
            "/rilsy/IMG_2424.MOV",
            "/rilsy/MOV_20260409_164740_759.mp4",
            "/rilsy/IMG_5722.MOV",
          ]}
          title="Реализованные проекты"
        />
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
