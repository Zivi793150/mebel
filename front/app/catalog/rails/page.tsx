import Image from "next/image";
import Link from "next/link";

import { ContactButton } from "@/components/ContactButton";
import { Container } from "@/components/Container";
import { CornicesCatalog, type CorniceItem } from "@/components/CornicesCatalog";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getMongoClient } from "@/lib/mongo";
import { CTA } from "@/sections/CTA";

export const dynamic = "force-dynamic";

async function getCornices(): Promise<CorniceItem[]> {
  try {
    const client = await getMongoClient();
    const col = client.db("koenig").collection<CorniceItem>("cornices");

    const docs = await col
      .find(
        {
          source: "koenig_room",
          kind: { $in: ["cornice_collection", "cornice_item"] },
        },
        { projection: { _id: 0 } },
      )
      .limit(500)
      .toArray();

    return docs ?? [];
  } catch {
    return [];
  }
}

export default async function RailsCatalogPage() {
  const items = await getCornices();

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main>
        {/* Hero Banner - Full width slider style */}
        <section className="relative min-h-[60vh] overflow-hidden sm:min-h-[70vh]">
          <div className="absolute inset-0">
            <Image
              src="/catalog/4.karnizy/elektrokarnizy/8d5895d5a388b3482a148445333db28f-optimized.webp"
              alt="Декоративные карнизы"
              fill
              sizes="100vw"
              className="object-cover"
              loading="eager"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 flex min-h-[60vh] items-center sm:min-h-[70vh]">
            <Container>
              <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Карнизы: стиль и надёжность
                </h1>
                <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                  Декоративные карнизы для штор — потолочные, металлические, латунные, профильные.
                  Подберём под интерьер, высоту установки и вес ткани.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ContactButton
                    className="inline-flex h-11 items-center justify-center bg-[color:var(--accent)] px-6 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                    imageSrc="/catalog/4.karnizy/elektrokarnizy/8d5895d5a388b3482a148445333db28f-optimized.webp"
                  >
                    Получить консультацию
                  </ContactButton>
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="py-14 sm:py-18">
          <Container>
            <div className="text-center">
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                Выберите вид карниза
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                Потолочные, металлические, латунные, профильные, багетные и электро карнизы.
                Нажмите на карточку — откроются варианты и фото.
              </p>
            </div>

            <div className="mt-12">
              <CornicesCatalog items={items} />
            </div>

            <div className="mt-10 text-center">
              <ContactButton
                className="inline-flex h-11 items-center justify-center bg-[color:var(--accent)] px-6 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                imageSrc="/catalog/4.karnizy/elektrokarnizy/8d5895d5a388b3482a148445333db28f-optimized.webp"
              >
                Получить консультацию
              </ContactButton>
            </div>
          </Container>
        </section>

        {/* Guarantee Section */}
        <section className="bg-[color:var(--bg)] py-16 sm:py-20">
          <Container>
            <div className="mb-8">
              <span className="inline-block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Гарантия
              </span>
              <span className="ml-2 inline-block font-['Rozovii_Chulok',cursive] text-xl tracking-normal text-[color:var(--green)] sm:ml-4 sm:text-3xl lg:text-4xl" style={{ transform: 'rotate(-6deg)' }}>
                качества
              </span>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article className="group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)]">
                <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                  <div className="text-xl font-medium text-[color:var(--fg)]">01</div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                  Только проверенные материалы
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Используем комплектующие, которые обеспечивают долговечность и комфорт в использовании.
                </p>
              </article>

              <article className="group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)]">
                <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                  <div className="text-xl font-medium text-[color:var(--fg)]">02</div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                  Точные замеры и монтаж
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Каждый заказ проходит тщательную обработку: от точных замеров до профессиональной установки.
                </p>
              </article>

              <article className="group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)]">
                <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                  <div className="text-xl font-medium text-[color:var(--fg)]">03</div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                  Гарантия 5 лет
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Постгарантийное обслуживание и поддержка на всех этапах эксплуатации.
                </p>
              </article>
            </div>

            <div className="mt-10 text-center">
              <ContactButton
                className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]"
                imageSrc="/catalog/4.karnizy/elektrokarnizy/8d5895d5a388b3482a148445333db28f-optimized.webp"
              >
                Получить консультацию
              </ContactButton>
            </div>
          </Container>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
