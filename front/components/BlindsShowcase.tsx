"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  label: string;
  kicker: string;
  quote: string;
  authorTitle: string;
  authorSubtitle: string;
  imageSrc: string;
};

export function BlindsShowcase({ images }: { images?: string[] }) {
  const items: Item[] = useMemo(
    () => [
      {
        label: "Сценарий",
        kicker: "СВЕТ",
        quote: "Блики исчезают. Свет ровный. Комната спокойнее.",
        authorTitle: "Подбор под задачу",
        authorSubtitle: "кухня / кабинет / ТВ",
        imageSrc: "/catalog/blinds.jpg",
      },
      {
        label: "Сценарий",
        kicker: "ПРИВАТНОСТЬ",
        quote: "Вечером — приватно. Днём — светло и легко.",
        authorTitle: "Тонкая настройка",
        authorSubtitle: "без тяжёлых тканей",
        imageSrc: "/catalog/decor.jpg",
      },
      {
        label: "Сценарий",
        kicker: "МОНТАЖ",
        quote: "“Дорого” начинается с геометрии и чистой посадки.",
        authorTitle: "Чистый монтаж",
        authorSubtitle: "ровно и без шума",
        imageSrc: "/catalog/rails.jpg",
      },
    ],
    [],
  );

  const derivedItems = useMemo(() => {
    if (!images || images.length === 0) return items;
    return items.map((it, idx) => ({
      ...it,
      imageSrc: images[idx % images.length] || it.imageSrc,
    }));
  }, [images, items]);

  const [active, setActive] = useState(0);
  const current = derivedItems[active];
  const quoteWords = useMemo(() => current.quote.split(" "), [current.quote]);

  const [bgFrom, setBgFrom] = useState(derivedItems[0]?.imageSrc ?? "/blinds-window.jpg");
  const [bgTo, setBgTo] = useState(derivedItems[0]?.imageSrc ?? "/blinds-window.jpg");
  const [bgMix, setBgMix] = useState(1);
  const prevActiveRef = useRef(0);
  const [transitionKey, setTransitionKey] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    let raf = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const totalScrollable = Math.max(1, el.offsetHeight - vh);

        const progressed = Math.min(1, Math.max(0, (0 - r.top) / totalScrollable));
        const maxIdx = derivedItems.length - 1;
        const idx = Math.min(maxIdx, Math.max(0, Math.floor(progressed * (maxIdx + 1) + 1e-6)));
        setActive((prev) => (prev === idx ? prev : idx));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, [derivedItems.length]);

  useEffect(() => {
    const nextSrc = derivedItems[active]?.imageSrc ?? "/blinds-window.jpg";
    const prevIdx = prevActiveRef.current;
    const prevSrc = derivedItems[prevIdx]?.imageSrc ?? bgTo;
    prevActiveRef.current = active;

    setBgFrom(prevSrc);
    setBgTo(nextSrc);
    setBgMix(0);
    setTransitionKey((v) => v + 1);
    const raf = window.requestAnimationFrame(() => setBgMix(1));
    return () => window.cancelAnimationFrame(raf);
  }, [active, derivedItems, bgTo]);

  const stripeCount = 10;

  const progress = ((active + 1) / derivedItems.length) * 100;
  const number = String(active + 1).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      id="highlights"
      className="relative"
      style={{ height: `calc(${derivedItems.length} * 100svh)` }}
    >
      <div className="sticky top-0 relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bgFrom})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 1 - bgMix,
              transition: "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bgTo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: bgMix,
              transition: "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(161,137,118,0.18),transparent_42%),radial-gradient(circle_at_85%_70%,rgba(161,137,118,0.12),transparent_52%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(255,255,255,0.34))] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.52))]" />

          <div aria-hidden="true" className="absolute inset-0 flex flex-col">
            {Array.from({ length: stripeCount }).map((_, idx) => (
              <div
                key={`${transitionKey}-${idx}`}
                className={
                  "kr-blinds-slat relative flex-1 " +
                  (idx % 2 === 0 ? "kr-blinds-slat-a" : "kr-blinds-slat-b")
                }
                style={{
                  animationDelay: `${idx * 38}ms`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl items-center px-4 py-14 sm:px-6 sm:py-18">
          <div className="relative grid w-full gap-10 lg:grid-cols-12">
            <div className="pointer-events-none absolute -left-6 top-1/2 hidden -translate-y-1/2 select-none leading-none lg:block">
              <div
                key={`num-${active}`}
                className="kr-blinds-num text-[22rem] font-semibold tracking-tighter text-black/[0.10] dark:text-white/[0.14]"
                style={{
                  textShadow:
                    "0 30px 90px rgba(0,0,0,0.16), 0 6px 18px rgba(0,0,0,0.10)",
                  filter: "blur(0.2px)",
                }}
              >
                {number}
              </div>
            </div>

            <div className="hidden lg:flex lg:col-span-2 lg:flex-col lg:items-center lg:justify-center lg:pr-2">
              <div
                className="text-xs font-mono uppercase tracking-[0.28em] text-[color:var(--muted)]"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                {current.label}
              </div>

              <div className="mt-8 h-40 w-px bg-black/10 dark:bg-white/10">
                <div className="origin-top bg-black/60 dark:bg-white/60" style={{ height: `${progress}%` }} />
              </div>
            </div>

            <div className="lg:col-span-10 lg:pl-8">
              <div className="flex items-center justify-between gap-6">
                <div
                  key={`kicker-${active}`}
                  className="kr-blinds-kicker inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-mono text-[color:var(--muted)] shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                  {current.kicker}
                </div>
              </div>

              <div className="mt-10 max-w-3xl">
                <blockquote
                key={`quote-${active}`}
                className="text-5xl font-light leading-[1.05] tracking-tight text-[color:var(--fg)] sm:text-6xl lg:text-7xl"
              >
                  {quoteWords.map((w, idx) => (
                    <span
                      key={`${w}-${idx}`}
                      className="kr-blinds-word inline-block mr-[0.28em]"
                      style={{ animationDelay: `${idx * 48}ms` }}
                    >
                      {w}
                    </span>
                  ))}
                </blockquote>
              </div>

              <div className="mt-12 flex items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div
                    key={`line-${active}`}
                    className="kr-blinds-line h-px w-10 bg-black/60 dark:bg-white/60"
                  />
                  <div>
                    <div className="text-base font-semibold text-[color:var(--fg)]">
                      {current.authorTitle}
                    </div>
                    <div className="text-base text-[color:var(--muted)]">
                      {current.authorSubtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
