"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Container } from "@/components/Container";

const services = [
  {
    icon: "✦",
    title: "Подбор тканей",
    description: "Индивидуальный подбор материалов под стиль вашего проекта из коллекции 1000+ европейских тканей",
  },
  {
    icon: "📐",
    title: "Расчёт размеров",
    description: "Точные замеры и расчёты для идеальной посадки штор в пространстве",
  },
  {
    icon: "🎨",
    title: "Оформление предложений",
    description: "Профессиональные коммерческие предложения для ваших клиентов",
  },
  {
    icon: "✂️",
    title: "Разработка вышивки",
    description: "Уникальная вышивка и декорирование под ваш концепт",
  },
  {
    icon: "🚗",
    title: "Выезд специалиста",
    description: "Выезд на объект с образцами и консультация прорабов и строителей",
  },
  {
    icon: "🏷️",
    title: "Партнёрские цены",
    description: "Особые условия для профессионалов индустрии дизайна",
  },
];

export function DesignersHero() {
  const title = "Сотрудничество для дизайнеров интерьера";
  const subtitle = "Полное сопровождение проектов: от подбора тканей до монтажа";
  const words = title.split(" ");

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/gray_hero.jpg"
          alt="Koenig Room для дизайнеров"
          fill
          sizes="100vw"
          className="object-cover scale-[1.04] brightness-[0.98] dark:brightness-[0.42]"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_80%_20%,rgba(255,255,255,0.62),transparent_62%),linear-gradient(to_bottom,rgba(255,255,255,0.44),rgba(255,255,255,0.48),rgba(255,255,255,0.56))] dark:bg-[radial-gradient(900px_circle_at_80%_20%,rgba(255,255,255,0.04),transparent_55%),linear-gradient(to_bottom,rgba(8,12,20,0.62),rgba(8,12,20,0.72),rgba(8,12,20,0.90))]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_80%,rgba(0,0,0,0.08),transparent_60%)] dark:bg-[radial-gradient(1200px_circle_at_20%_80%,rgba(0,0,0,0.35),transparent_60%)]" />
      </div>

      <Container>
        <div className="relative z-10 flex min-h-[70vh] flex-col justify-center py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="text-xs font-medium tracking-wider text-[color:var(--fg)] uppercase dark:text-white/90">for designers</span>
            </div>

            <h1
              className="kr-word-title text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.1] tracking-tight text-[color:var(--fg)] dark:text-white"
              style={{ textShadow: "0 18px 60px rgba(0,0,0,0.18)" }}
            >
              {words.map((w, i) => (
                <span key={i}>
                  <span className="kr-word" style={{ "--i": i } as CSSProperties}>
                    {w}
                  </span>
                  {i === words.length - 1 ? "" : " "}
                </span>
              ))}
            </h1>

            <p
              className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)] sm:text-xl dark:text-white/85"
              style={{ textShadow: "0 14px 44px rgba(0,0,0,0.12)" }}
            >
              {subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#services"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[color:var(--fg)] px-7 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 hover:scale-[1.02] dark:bg-white dark:text-[#0b1220] dark:hover:bg-white/90"
              >
                Узнать условия
              </a>
              <a
                href="#contact"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-black/15 bg-white/30 px-7 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/45 dark:border-white/30 dark:bg-white/0 dark:text-white dark:hover:bg-white/10"
              >
                Стать партнёром
              </a>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                { value: "1000+", label: "тканей в наличии" },
                { value: "3-10", label: "дней на пошив" },
                { value: "100%", label: "сопровождение проекта" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-black/10 bg-white/55 p-4 backdrop-blur-sm dark:border-white/15 dark:bg-white/5"
                >
                  <div className="text-3xl font-bold text-[color:var(--fg)] dark:text-white">{stat.value}</div>
                  <div className="mt-1 text-xs font-medium tracking-wider text-[color:var(--muted)] uppercase dark:text-white/65">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
