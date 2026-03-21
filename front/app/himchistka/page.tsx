export const dynamic = "force-static";

import Image from "next/image";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { CTA } from "@/sections/CTA";
import { HimchistkaScrollStory } from "./sections/HimchistkaScrollStory";
import { HimchistkaProofs } from "./sections/HimchistkaProofs";

const HERO_IMAGE = encodeURI(
  "/химчистка/Чистка и восстановление 1 .jpg",
);

export default function HimchistkaPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main className="py-14 sm:py-18">
        <Container>
          <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                УСЛУГА
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                Химчистка штор
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                Деликатный уход, стирка и монтаж обратно на объект. Быстро, спокойно и с уважением к вашему дому.
              </p>

              <div className="mt-7 rounded-3xl border border-black/10 bg-white/50 p-6 text-sm leading-6 text-[color:var(--muted)] shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/5">
                <span className="font-semibold text-[color:var(--fg)]">Важно:</span> химчистка доступна только для изделий,
                которые отшивались у нас на производстве.
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative mx-auto aspect-[4/5] max-h-[70vh] max-w-[420px] overflow-hidden rounded-3xl border border-black/10 bg-white/50 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 lg:max-w-full">
                <Image
                  src={HERO_IMAGE}
                  alt="Химчистка штор"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.10),rgba(0,0,0,0.35))]" />
              </div>
            </div>
          </section>

          <div className="mt-6">
            <HimchistkaScrollStory />
          </div>

          <div className="mt-6">
            <HimchistkaProofs />
          </div>

          <section className="mt-14">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">РЕКОМЕНДАЦИИ</div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
                  Как ухаживать за шторами
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                  Проще всего доверить это нам. Но если ухаживаете самостоятельно — вот базовые рекомендации.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 3v18M3 12h18M7 8l5-5 5 5M7 16l5 5 5-5" />
                        </svg>
                      </div>
                      <div className="text-base font-semibold text-[color:var(--fg)]">Портьерные ткани</div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-xs text-[color:var(--accent)]">1</span>
                        <div className="text-sm text-[color:var(--muted)]">Обеспыливание — 1 раз в квартал</div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-xs text-[color:var(--accent)]">2</span>
                        <div className="text-sm text-[color:var(--muted)]">Пароэкстракция — 1 раз в год</div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-xs text-[color:var(--accent)]">3</span>
                        <div className="text-sm text-[color:var(--muted)]">Аквачистка — 1 раз в 3–4 года</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4l3 3" />
                        </svg>
                      </div>
                      <div className="text-base font-semibold text-[color:var(--fg)]">Тюль</div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-xs text-[color:var(--accent)]">1</span>
                        <div className="text-sm text-[color:var(--muted)]">Аквастирка — 1 раз в 4–6 месяцев</div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-xs text-[color:var(--accent)]">2</span>
                        <div className="text-sm text-[color:var(--muted)]">Стиральная машинка — только в мешке для стирки</div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-xs text-[color:var(--accent)]">3</span>
                        <div className="text-sm text-[color:var(--muted)]">Утюжка: режим 1–2 или отпариватель</div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 rounded-3xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/5 p-6 backdrop-blur">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4M12 8h.01" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[color:var(--fg)]">Совет</div>
                        <div className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                          Перед стиркой всегда проверяйте незаметный участок ткани на реакцию с водой. 
                          Лён и хлопок можно отпаривать, но синтетику лучше просто встряхнуть.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>

        <div className="mt-14">
          <CTA />
        </div>
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
