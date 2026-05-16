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
          src="/glavnaya_dizayneram.webp"
          alt="Koenig Room для дизайнеров"
          fill
          sizes="100vw"
          className="object-cover scale-[1.04] brightness-[0.80] dark:brightness-[0.50]"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.15))]" />
              </div>

      <Container>
        <div className="relative z-10 flex min-h-[70vh] flex-col justify-center py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            <h1
              className="kr-word-title text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.1] tracking-tight text-white"
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
              className="mt-6 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl"
              style={{ textShadow: "0 14px 44px rgba(0,0,0,0.12)" }}
            >
              {subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#services"
                className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-6 text-sm font-medium text-white transition hover:opacity-90"
              >
                Узнать условия
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 items-center justify-center border border-white/25 bg-transparent px-6 text-sm font-medium text-white transition hover:bg-white/10"
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
                  className="border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="text-2xl font-medium tracking-tight text-white">{stat.value}</div>
                  <div className="mt-1 text-xs font-medium tracking-[0.22em] text-white/65 uppercase">
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
