export const dynamic = "force-static";

import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Химчистка штор — Koenig Room",
  description: "Профессиональная химчистка штор, жалюзи и текстиля в Калининграде. Бережная чистка с вывозом и доставкой. Для наших покупателей — специальные условия.",
  openGraph: {
    title: "Химчистка штор — Koenig Room",
    description: "Профессиональная химчистка штор и текстиля в Калининграде. Бережная чистка с вывозом и доставкой.",
    images: ["/himchistka/chistka-i-vosstanovlenie-1-.webp"],
  },
};

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { CTA } from "@/sections/CTA";
import { ContactButton } from "@/components/ContactButton";
import { ServiceJsonLd } from "@/components/JsonLd";

const HERO_IMAGE = encodeURI(
  "/himchistka/chistka-i-vosstanovlenie-1-.webp",
);

const PROCESS_IMAGE = encodeURI(
  "/himchistka/chistka-i-vosstanovlenie-.webp",
);

export default function HimchistkaPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <ServiceJsonLd
        name="Химчистка штор и текстиля"
        description="Профессиональная химчистка штор, жалюзи и текстиля в Калининграде. Бережная чистка с вывозом и доставкой."
        url="https://koenigroom.ru/himchistka"
        areaServed="Калининград"
      />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={HERO_IMAGE}
              alt="Химчистка штор"
              fill
              sizes="100vw"
              className="object-cover brightness-[0.80]"
              loading="eager"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45),rgba(0,0,0,0.15))]" />
          </div>
          <Container>
            <div className="relative z-10 grid min-h-[78svh] items-center justify-center py-14 sm:py-18">
              <div className="max-w-3xl text-center">
                <h1 className="text-4xl font-light tracking-[0.05em] uppercase text-white sm:text-5xl lg:text-6xl">
                  Химчистка
                </h1>
                <p className="mt-4 text-lg text-white/80">
                  для наших покупателей
                </p>
                <div className="mt-8">
                  <ContactButton
                    className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]"
                    imageSrc="/knopka-svyazatsya-v-himchistke-.webp"
                  >
                    Напишите нам
                  </ContactButton>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Cleaning Section with 3 Steps */}
        <section className="bg-black/[0.02] py-16 sm:py-20 dark:bg-white/[0.03]">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                  ХИМЧИСТКА
                </div>
                <h2 className="mt-4 text-3xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl">
                  штор
                </h2>
                <p className="mt-2 text-sm text-[color:var(--muted)]">cleaning</p>

                <div className="mt-8 space-y-6">
                  <div className="border-b border-[color:var(--gray-lines)] pb-6">
                    <div className="text-xl font-medium text-[color:var(--fg)]">01</div>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                      Договариваемся о выезде, наш дизайнер выезжает осматривает Ваш текстиль, ему обязательно нужно сообщить где что нужно подремонтировать и показать пятна, на которые нужно особенно уделить внимание.
                    </p>
                  </div>

                  <div className="border-b border-[color:var(--gray-lines)] pb-6">
                    <div className="text-xl font-medium text-[color:var(--fg)]">02</div>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                      Затем дизайнер снимает текстиль и увозит на производство, где происходит замачивание штор в несколько этапов, стирка, утюжка и осуществляется необходимый ремонт.
                    </p>
                  </div>

                  <div className="border-b border-[color:var(--gray-lines)] pb-6">
                    <div className="text-xl font-medium text-[color:var(--fg)]">03</div>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                      На третьем этапе дизайнер выезжает на объект и осуществляет монтаж всего текстиля на объекте.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={PROCESS_IMAGE}
                    alt="Химчистка штор"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    loading="eager"
                    priority
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Care Section with Video */}
        <section className="py-16 sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-6">
                <div className="relative aspect-video overflow-hidden bg-black/5">
                  <Image
                    src={HERO_IMAGE}
                    alt="Как ухаживать за шторами"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    loading="eager"
                    priority
                  />
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                  КАК УХАЖИВАТЬ
                </div>
                <h2 className="mt-4 text-3xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl">
                  за шторами?
                </h2>

                <div className="mt-6 space-y-4 text-sm leading-6 text-[color:var(--muted)]">
                  <p>
                    Проще всего доверить это нам! У нас огромный опыт и знания в области ухода за различными тканями и материалами. Мы знаем, как правильно и безопасно очищать шторы, чтобы избежать повреждения ткани.
                  </p>
                  <p>
                    <strong className="text-[color:var(--fg)]">ВАЖНО.</strong> Химчистка доступна только для изделий, которые отшивались у нас на производстве.
                  </p>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="text-base font-semibold text-[color:var(--fg)]">Рекомендация для ухода за портьерными тканями:</div>
                    <div className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
                      <p>Обеспыливание — 1 раз в квартал</p>
                      <p>Пароэкстракция — 1 раз в год</p>
                      <p>Аквачистка — 1 раз в 3–4 года</p>
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-semibold text-[color:var(--fg)]">Рекомендация для ухода за тюлем:</div>
                    <div className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
                      <p>Аквастирка — 1 раз в 4–6 месяцев</p>
                      <p>Стиральная машинка — в мешке для стирки!</p>
                      <p>Утюжка — режим 1–2 утюг, либо использование отпаривателя режим лён-хлопок</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <CTA imageSrc="/knopka-svyazatsya-v-himchistke-.webp" />
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
