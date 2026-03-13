"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Mode = {
  id: "cool" | "soft" | "easy" | "gift";
  label: string;
  title: string;
  subtitle: string;
  cues: { title: string; text: string }[];
  imageSrc: string;
  ctaLabel: string;
};

export function BeddingWhyShowcase({ images }: { images?: string[] }) {
  const modes: Mode[] = useMemo(
    () => [
      {
        id: "cool",
        label: "Прохлада",
        title: "Если важно “не жарко” и свежо",
        subtitle:
          "Подбираем ткань по ощущению на коже и по сезону — чтобы высыпаться, а не просыпаться ночью.",
        cues: [
          { title: "Тактильность", text: "Гладко и прохладно — без ощущения “пластика”." },
          { title: "Дышит", text: "Комфортнее в тёплых спальнях и при плотных одеялах." },
          { title: "Цвет", text: "Спокойные оттенки выглядят как отель: чисто и дорого." },
        ],
        imageSrc: "/2foto_dark.jpg",
        ctaLabel: "Хочу прохладнее",
      },
      {
        id: "soft",
        label: "Мягкость",
        title: "Если хочется “обнять” и расслабиться",
        subtitle:
          "Мягкие фактуры дают телу сигнал “можно отдыхать”. Это сильнее влияет на сон, чем кажется.",
        cues: [
          { title: "Ощущение", text: "Мягко, но не “липко”: важно попасть в баланс." },
          { title: "Тишина", text: "Ткань не шуршит и не раздражает в движении." },
          { title: "Вид", text: "Драпировка и матовость создают дорогую картинку." },
        ],
        imageSrc: "/catalog/bed.jpg",
        ctaLabel: "Хочу мягче",
      },
      {
        id: "easy",
        label: "Без морщин",
        title: "Если важны аккуратность и простота ухода",
        subtitle:
          "Сценарий для тех, кто хочет красивую постель каждый день, но без лишней возни.",
        cues: [
          { title: "Стирка", text: "Подбираем ткань, которая переживает регулярную стирку." },
          { title: "Форма", text: "Комплект лежит ровнее и выглядит опрятнее." },
          { title: "Практика", text: "Учитываем детей/питомцев и частоту смены белья." },
        ],
        imageSrc: "/catalog/pillows.jpg",
        ctaLabel: "Хочу практично",
      },
      {
        id: "gift",
        label: "Подарок",
        title: "Если выбираете в подарок и боитесь “не попасть”",
        subtitle:
          "Собираем беспроигрышный премиум: нейтральный цвет, приятная фактура, правильная плотность.",
        cues: [
          { title: "Универсально", text: "Спокойная палитра подходит почти любой спальне." },
          { title: "Комплект", text: "Можно добавить подушки/плед — будет цельно." },
          { title: "Впечатление", text: "Выглядит дороже за счёт фактуры и посадки." },
        ],
        imageSrc: "/catalog/decor.jpg",
        ctaLabel: "Собрать подарок",
      },
    ],
    []
  );

  const derivedModes = useMemo(() => {
    if (!images || images.length === 0) return modes;
    return modes.map((m, idx) => ({
      ...m,
      imageSrc: images[idx % images.length] || m.imageSrc,
    }));
  }, [images, modes]);

  const [active, setActive] = useState<Mode["id"]>("cool");
  const mode = derivedModes.find((m) => m.id === active) ?? derivedModes[0];

  return (
    <section className="relative overflow-hidden bg-[color:var(--bg)] py-18 sm:py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#00000014_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute -left-28 top-14 h-80 w-80 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
        <div className="absolute -right-28 bottom-14 h-80 w-80 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ЗАЧЕМ</div>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
              Постельное — это качество сна, а не “просто ткань”
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Выберите, что важнее. Мы предложим 2–3 варианта и объясним разницу человеческим языком.
            </p>
          </div>

          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <a
              href="#bedding-catalog"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            >
              Смотреть варианты
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-5">
            <div className="grid gap-2">
              {derivedModes.map((m, idx) => {
                const isActive = m.id === active;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActive(m.id)}
                    className={
                      isActive
                        ? "group flex w-full items-center justify-between gap-4 rounded-3xl bg-[color:var(--accent)] px-6 py-5 text-left text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.14)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                        : "group flex w-full items-center justify-between gap-4 rounded-3xl bg-black/[0.02] px-6 py-5 text-left shadow-sm backdrop-blur transition hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
                    }
                    aria-pressed={isActive}
                  >
                    <div className="min-w-0">
                      <div
                        className={
                          isActive
                            ? "text-xs font-semibold tracking-[0.28em]"
                            : "text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]"
                        }
                      >
                        0{idx + 1} — {m.label}
                      </div>
                      <div className={isActive ? "mt-1 text-base font-semibold" : "mt-1 text-base font-semibold text-[color:var(--fg)]"}>
                        {m.title}
                      </div>
                    </div>
                    <div
                      className={
                        isActive
                          ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20"
                          : "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/[0.03] text-[color:var(--muted)] dark:bg-white/[0.08]"
                      }
                      aria-hidden="true"
                    >
                      →
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="group relative h-full min-h-[560px] overflow-hidden rounded-[28px] bg-black/[0.03] shadow-[0_26px_90px_rgba(0,0,0,0.18)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 dark:bg-white/[0.05] dark:shadow-[0_26px_90px_rgba(0,0,0,0.55)]">
              <Image
                src={mode.imageSrc}
                alt="Постельное бельё"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-[transform,filter] duration-700 group-hover:scale-[1.06] group-hover:saturate-[1.06]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.26),rgba(0,0,0,0.86))]" />

              <div className="relative z-10 flex h-full flex-col justify-end p-8">
                <div className="text-xs font-semibold tracking-[0.28em] text-white/75">ВАЖНОЕ</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{mode.subtitle}</div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {mode.cues.map((c) => (
                    <div key={c.title} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
                      <div className="text-xs font-semibold tracking-[0.22em] text-white/85">{c.title}</div>
                      <div className="mt-1 text-xs leading-5 text-white/70">{c.text}</div>
                    </div>
                  ))}
                </div>

                <a
                  href="#cta"
                  className="mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black shadow-sm transition group-hover:shadow-md"
                >
                  {mode.ctaLabel} <span aria-hidden="true" className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
