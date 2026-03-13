import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/Container";
import { getMongoClient } from "@/lib/mongo";
import { AboutStory } from "@/sections/AboutStory";
import { AboutParallaxGallery } from "@/sections/AboutParallaxGallery";
import { AboutHoverPreview } from "@/sections/AboutHoverPreview";

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

export default async function AboutPage() {
  const portfolio = await getPortfolioImages();
  const [heroImg, p1, p2, p3, p4, p5] = pickStable(portfolio, [1, 3, 11, 19, 27, 35]);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main className="py-14 sm:py-18">
        <Container>
          <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">О НАС</div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                Текстильный дизайн как дело жизни
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                Мы — команда Koenig Room. Проектируем и реализуем текстильные решения для дома: от идеи и подбора — до
                пошива и монтажа.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contacts"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                >
                  Связаться с нами
                </Link>
                <Link
                  href="/#catalog"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  Перейти в каталог
                </Link>
              </div>

              <div className="mt-10">
                <AboutHoverPreview
                  items={[
                    {
                      key: "fabrics",
                      label: "подбор тканей",
                      title: "Подбор тканей",
                      subtitle: "Фактуры, плотность, свет и задача помещения.",
                      imageSrc: "/ab1.jpg",
                    },
                    {
                      key: "workshop",
                      label: "собственный цех",
                      title: "Собственный цех",
                      subtitle: "Контроль качества и аккуратная посадка.",
                      imageSrc: "/ab2.jpg",
                    },
                    {
                      key: "mount",
                      label: "монтаж",
                      title: "Монтаж",
                      subtitle: "Чисто, спокойно и точно по проекту.",
                      imageSrc: "/ab3.jpg",
                    },
                  ]}
                  paragraphs={[
                    "Наша история началась в 2002 году и выросла в устойчивую систему, где важны вкус, точность и спокойная коммуникация.",
                    "Вы получаете полный цикл: подбор тканей, собственный цех и монтаж — от идеи до финальной настройки результата.",
                  ]}
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative mx-auto aspect-[1000/1500] max-h-[70vh] max-w-[320px] overflow-hidden rounded-3xl border border-black/10 bg-white/50 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:max-w-[400px] lg:max-w-full">
                <Image
                  src={"/about_us.jpg"}
                  alt="Koenig Room"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain"
                />
                {heroImg ? (
                  <div className="absolute inset-0">
                    <Image
                      src={heroImg}
                      alt="Koenig Room"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-contain opacity-0"
                      priority={false}
                    />
                  </div>
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.10),rgba(0,0,0,0.40))]" />
              </div>
            </div>
          </section>
        </Container>

        <div className="mt-14">
          <AboutStory images={portfolio} />
        </div>

        <div className="mt-2">
          <AboutParallaxGallery images={portfolio} />
        </div>

        <section className="py-14 sm:py-18">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                  БОЛЬШЕ О НАС
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
                  Профессионально. Спокойно. С уважением к вашему дому.
                </h2>
                <div className="mt-5">
                  <AboutHoverPreview
                    items={[
                      {
                        key: "project",
                        label: "чёткий проект",
                        title: "Чёткий проект",
                        subtitle: "Понимание результата, сроков и бюджета.",
                        imageSrc: p4 || heroImg || "/hero.jpg",
                      },
                      {
                        key: "partners",
                        label: "сильные партнёры",
                        title: "Сильные партнёры",
                        subtitle: "Материалы, которым можно доверять.",
                        imageSrc: p5 || heroImg || "/hero.jpg",
                      },
                      {
                        key: "quality",
                        label: "контроль качества",
                        title: "Контроль качества",
                        subtitle: "На каждом этапе — от замера до монтажа.",
                        imageSrc: p2 || heroImg || "/hero.jpg",
                      },
                    ]}
                    paragraphs={[
                      "Мы строим работу вокруг вашего запроса: слушаем, предлагаем варианты и отвечаем за результат.",
                      "Нас отличает чёткий проект, сильные партнёры и контроль качества — поэтому интерьер собирается спокойно и предсказуемо.",
                    ]}
                  />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <div className="text-sm font-semibold text-[color:var(--fg)]">Куда дальше?</div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    Напишите нам — и мы предложим 2–3 решения под ваш интерьер и задачи по свету.
                  </div>
                  <div className="mt-6 grid gap-3">
                    <Link
                      href="/contacts"
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                    >
                      Наши контакты
                    </Link>
                    <Link
                      href="/#catalog"
                      className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      Посмотреть каталог
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <Footer />
      </main>
    </div>
  );
}
