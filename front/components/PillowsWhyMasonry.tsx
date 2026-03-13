"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Palette = {
  id: "calm" | "contrast" | "texture" | "hotel";
  label: string;
  headline: string;
  sub: string;
  tiles: {
    title: string;
    text: string;
    imageSrc: string;
    size: "sm" | "md" | "lg";
  }[];
};

export function PillowsWhyMasonry({ images }: { images?: string[] }) {
  const palettes: Palette[] = useMemo(
    () => [
      {
        id: "calm",
        label: "Спокойно",
        headline: "Если хочется “дорого и тихо”",
        sub: "Делаем комнату спокойнее: 2–3 близких оттенка и разные фактуры вместо ярких принтов.",
        tiles: [
          {
            title: "Палитра",
            text: "Один базовый + один тёплый акцент + нейтральный связующий.",
            imageSrc: "/catalog/pillows.jpg",
            size: "lg",
          },
          {
            title: "Фактуры",
            text: "Букле/лён/велюр — чтобы глубина читалась даже в пасмурном свете.",
            imageSrc: "/catalog/curtains.jpg",
            size: "md",
          },
          {
            title: "Баланс",
            text: "Сначала крупные, потом маленькие. Так выглядит как проект, а не “накупили”.",
            imageSrc: "/catalog/rugs.jpg",
            size: "md",
          },
          {
            title: "Финальный штрих",
            text: "Один необычный материал — и всё становится “дороже”.",
            imageSrc: "/catalog/decor.jpg",
            size: "sm",
          },
        ],
      },
      {
        id: "contrast",
        label: "Акцент",
        headline: "Если нужно оживить диван",
        sub: "Добавляем один сильный цветовой акцент и держим остальное в базе — без хаоса.",
        tiles: [
          {
            title: "Один акцент",
            text: "Выбираем один цвет и повторяем его 2 раза — это создаёт “дорогую” логику.",
            imageSrc: "/catalog/pillows.jpg",
            size: "lg",
          },
          {
            title: "Геометрия",
            text: "Квадрат + прямоугольник + покрывало. Разные формы = собранный вид.",
            imageSrc: "/catalog/rails.jpg",
            size: "md",
          },
          {
            title: "Оттенки",
            text: "Лучше 2 близких тона, чем один “кричащий”.",
            imageSrc: "/catalog/roman.jpg",
            size: "md",
          },
          {
            title: "Стоп-сигнал",
            text: "Если сомневаетесь — убираем одну подушку. Чистота важнее количества.",
            imageSrc: "/catalog/blinds.jpg",
            size: "sm",
          },
        ],
      },
      {
        id: "texture",
        label: "Фактура",
        headline: "Если хотите больше глубины",
        sub: "Дорогой эффект часто делают фактуры: матовое, мягкое, с объёмом — без ярких цветов.",
        tiles: [
          {
            title: "Тактильность",
            text: "Интерьер воспринимается дороже, когда вещи хочется трогать.",
            imageSrc: "/catalog/bed.jpg",
            size: "lg",
          },
          {
            title: "Свет",
            text: "Фактура ловит свет и создаёт объём на диване/кровати.",
            imageSrc: "/hero2.jpg",
            size: "md",
          },
          {
            title: "Сдержанно",
            text: "Без принтов — легче попасть и выглядит современнее.",
            imageSrc: "/catalog/decor.jpg",
            size: "md",
          },
          {
            title: "Практика",
            text: "Под ваш сценарий подберём ткань, которая не боится жизни.",
            imageSrc: "/catalog/pillows.jpg",
            size: "sm",
          },
        ],
      },
      {
        id: "hotel",
        label: "Отель",
        headline: "Если хотите “как в отеле”",
        sub: "Собираем композицию: слои, симметрия, покрывало и 2–3 подушки — без лишнего.",
        tiles: [
          {
            title: "Композиция",
            text: "Симметрия даёт ощущение порядка и премиальности.",
            imageSrc: "/catalog/bed.jpg",
            size: "lg",
          },
          {
            title: "Слои",
            text: "Плед/покрывало + подушки = быстрый “дорогой” апгрейд.",
            imageSrc: "/catalog/pillows.jpg",
            size: "md",
          },
          {
            title: "Чистые цвета",
            text: "Белый/молочный/серый/песочный — выглядит дороже при правильной фактуре.",
            imageSrc: "/2foto_dark.jpg",
            size: "md",
          },
          {
            title: "Меньше, но лучше",
            text: "Одна хорошая подушка лучше трёх случайных.",
            imageSrc: "/catalog/curtains.jpg",
            size: "sm",
          },
        ],
      },
    ],
    []
  );

  const derivedPalettes = useMemo(() => {
    if (!images || images.length === 0) return palettes;
    let k = 0;
    return palettes.map((p) => ({
      ...p,
      tiles: p.tiles.map((t) => {
        const src = images[k % images.length] || t.imageSrc;
        k += 1;
        return { ...t, imageSrc: src };
      }),
    }));
  }, [images, palettes]);

  const [active, setActive] = useState<Palette["id"]>("calm");
  const palette = derivedPalettes.find((p) => p.id === active) ?? derivedPalettes[0];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(0);
  }, [active]);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(`[data-kr-pillows-step="${active}"]`));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.krPillowsIdx);
          if (!Number.isNaN(idx)) setActiveStep(idx);
        }
      },
      {
        root: null,
        threshold: [0.25, 0.4, 0.55, 0.7],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);

  return (
    <section className="relative bg-[color:var(--bg)] py-18 sm:py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#00000014_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ЗАЧЕМ</div>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
              Подушки и покрывала — самый быстрый апгрейд интерьера
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Выберите сценарий — и получите понятную “формулу”: сколько, каких размеров и в каких фактурах.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <a
              href="#pillows-catalog"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            >
              Смотреть варианты
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {derivedPalettes.map((p) => {
            const isActive = p.id === active;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                className={
                  isActive
                    ? "inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-xs font-semibold tracking-[0.26em] text-[color:var(--accent-contrast)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    : "inline-flex h-10 items-center justify-center rounded-full bg-black/[0.03] px-5 text-xs font-semibold tracking-[0.26em] text-[color:var(--fg)]/75 shadow-sm backdrop-blur transition hover:bg-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                }
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:sticky lg:top-24 lg:self-start">
            <div className="group relative min-h-[520px] overflow-hidden rounded-[28px] bg-black/[0.03] shadow-[0_26px_90px_rgba(0,0,0,0.18)] dark:bg-white/[0.05] dark:shadow-[0_26px_90px_rgba(0,0,0,0.55)]">
              {palette.tiles.map((t, idx) => (
                <div
                  key={t.title}
                  className="absolute inset-0 opacity-0 transition-[opacity,transform] duration-700 will-change-transform"
                  style={{ opacity: activeStep === idx ? 1 : 0 }}
                  aria-hidden={activeStep !== idx}
                >
                  <Image
                    src={t.imageSrc}
                    alt={t.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-[transform,filter] duration-700"
                    style={{ transform: activeStep === idx ? "scale(1.06)" : "scale(1.02)" }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.18),rgba(0,0,0,0.84))]" />
                </div>
              ))}

              <div className="relative z-10 flex h-full flex-col justify-end p-8">
                <div className="text-xs font-semibold tracking-[0.28em] text-white/75">СЦЕНАРИЙ</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{palette.tiles[activeStep]?.title}</div>
                <div className="mt-3 max-w-md text-sm leading-6 text-white/80">{palette.tiles[activeStep]?.text}</div>
                <a
                  href="#cta"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black shadow-sm transition group-hover:shadow-md"
                >
                  Собрать комплект <span aria-hidden="true" className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ФОРМУЛА</div>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">{palette.headline}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">{palette.sub}</p>

            <div className="mt-8">
              {palette.tiles.map((t, idx) => (
                <div
                  key={t.title}
                  data-kr-pillows-step={active}
                  data-kr-pillows-idx={idx}
                  className={`min-h-[40vh] py-10 transition sm:min-h-[44vh] ${idx !== 0 ? "border-t border-black/10 dark:border-white/10" : ""}`}
                >
                  <div className="flex h-full flex-col justify-center">
                    <div className="flex items-start gap-5">
                      <div
                        className={`mt-0.5 w-14 shrink-0 tabular-nums tracking-tight transition ${
                          activeStep === idx
                            ? "text-base font-semibold text-[color:var(--fg)] sm:text-lg"
                            : "text-base font-medium text-[color:var(--muted)] sm:text-lg"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </div>

                      <div className={`relative flex-1 pl-5 transition ${activeStep === idx ? "opacity-100" : "opacity-85"}`}>
                        <div
                          className={`absolute left-0 top-0 h-full w-px transition ${
                            activeStep === idx ? "bg-[color:var(--accent)]/70" : "bg-black/15 dark:bg-white/15"
                          }`}
                          aria-hidden="true"
                        />
                        <div className="text-2xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-3xl">{t.title}</div>
                        <div className="mt-3 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">{t.text}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href="#cta"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
              >
                Собрать под мой интерьер
              </a>
              <a
                href="#pillows-catalog"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-black/[0.03] px-5 text-sm font-semibold text-[color:var(--fg)]/85 shadow-sm backdrop-blur transition hover:bg-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
              >
                Каталог <span aria-hidden="true" className="ml-2">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
