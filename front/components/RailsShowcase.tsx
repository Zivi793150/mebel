"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type RailTab = {
  key: string;
  label: string;
  title: string;
  text: string;
  imageSrc: string;
  chips: string[];
};

export function RailsShowcase({ images }: { images?: string[] }) {
  const tabs: RailTab[] = useMemo(
    () => [
      {
        key: "modern",
        label: "Современный",
        title: "Чистая линия и минимальный металл",
        text: "Для светлых интерьеров и спокойной архитектуры окна. Делаем ровную линию, аккуратные кронштейны и правильный вылет под ткань.",
        imageSrc: "/catalog/carnis.jpg",
        chips: ["тонкий профиль", "ровная линия", "сдержанный блеск"],
      },
      {
        key: "classic",
        label: "Классика",
        title: "Наконечники и пропорции — чтобы выглядело “дорого”",
        text: "Не перебор, а точная деталь: форма наконечника, цвет металла, высота установки. Подбираем под фурнитуру и светильники.",
        imageSrc: "/catalog/rails.jpg",
        chips: ["наконечники", "латунь/бронза", "визуальный акцент"],
      },
      {
        key: "curved",
        label: "Сложные окна",
        title: "Эркеры, углы, ниши — всё собираем в одну геометрию",
        text: "Подбираем решение под стену/потолок и сценарий ткани, чтобы линия не “ломалась”, а монтаж был крепким и аккуратным.",
        imageSrc: "/catalog/decor.jpg",
        chips: ["эркер", "углы", "крепёж под стену"],
      },
    ],
    [],
  );

  const derivedTabs = useMemo(() => {
    if (!images || images.length === 0) return tabs;
    return tabs.map((t, idx) => ({
      ...t,
      imageSrc: images[idx % images.length] || t.imageSrc,
    }));
  }, [images, tabs]);

  const [active, setActive] = useState(derivedTabs[0]?.key ?? "modern");
  const tab = derivedTabs.find((t) => t.key === active) ?? derivedTabs[0];

  if (!tab) return null;

  return (
    <section className="relative overflow-hidden py-14 sm:py-18">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#00000018_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff1f_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
              СЦЕНАРИИ
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
              Выберите стиль — покажем решение
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              3 быстрых сценария: чтобы сразу понять линию, детали и подход к монтажу.
            </p>

            <div className="mt-7 inline-flex flex-wrap gap-2 rounded-2xl border border-black/10 bg-[#11111114] p-1 shadow-[0_0_20px_rgba(0,0,0,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
              {derivedTabs.map((t) => {
                const isActive = t.key === tab.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActive(t.key)}
                    className="relative rounded-xl px-3 py-2 text-sm font-semibold tracking-tight text-[color:var(--fg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    aria-pressed={isActive}
                  >
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-xl bg-black/[0.08] shadow-[0_0_20px_rgba(0,0,0,0.12)] backdrop-blur dark:bg-white/[0.10]"
                      />
                    ) : null}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-2 md:items-stretch">
                <div className="relative h-56 self-start overflow-hidden rounded-2xl sm:h-64 md:h-full md:min-h-[260px] md:self-stretch">
                  <Image
                    src={tab.imageSrc}
                    alt={tab.title}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.0),rgba(0,0,0,0.18),rgba(0,0,0,0.48))]" />
                </div>

                <div className="flex min-h-0 flex-col">
                  <div className="text-2xl font-semibold tracking-tight text-[color:var(--fg)]">
                    {tab.title}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{tab.text}</div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {tab.chips.map((c) => (
                      <div
                        key={c}
                        className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-semibold tracking-wide text-[color:var(--fg)]/70 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/80"
                      >
                        {c}
                      </div>
                    ))}
                  </div>

                  <a
                    href="#rails-catalog"
                    className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  >
                    Смотреть каталог
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
