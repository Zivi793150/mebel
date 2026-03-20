"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/Container";

type Step = {
  title: string;
  description: string;
  label: string;
};

export function HimchistkaScrollStory() {
  const steps: Step[] = useMemo(
    () => [
      {
        title: "Выезд и осмотр",
        description:
          "Договариваемся о времени. Осматриваем текстиль, отмечаем места для ремонта и зоны с загрязнениями.",
        label: "ЭТАП 1",
      },
      {
        title: "Чистка и восстановление",
        description:
          "Снимаем и увозим на производство: деликатная чистка, утюжка, ремонт и контроль посадки.",
        label: "ЭТАП 2",
      },
      {
        title: "Монтаж обратно",
        description:
          "Возвращаем и аккуратно устанавливаем всё на объект. Финальная проверка складки, длины и симметрии.",
        label: "ЭТАП 3",
      },
    ],
    [],
  );

  const visuals = useMemo(
    () => [
      { src: "/catalog/rails.jpg", alt: "Выезд и осмотр" },
      { src: "/catalog/decor.jpg", alt: "Чистка и восстановление" },
      { src: "/catalog/pillows.jpg", alt: "Монтаж обратно" },
    ],
    [],
  );

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const switchLockUntilRef = useRef(0);
  const rafRef = useRef(0);
  const lastBestRef = useRef(0);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-kr-him-step]"));
    if (els.length === 0) return;

    function computeBestIdx() {
      const vh = window.innerHeight || 1;
      const targetY = vh * 0.38;
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (const el of els) {
        const r = (el as HTMLElement).getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - targetY);
        if (dist < bestDist) {
          bestDist = dist;
          const idx = Number((el as HTMLElement).dataset.krHimStep);
          if (!Number.isNaN(idx)) bestIdx = idx;
        }
      }

      return bestIdx;
    }

    function applyBest(bestIdx: number) {
      const now = performance.now();
      if (now < switchLockUntilRef.current) return;

      const prev = activeRef.current;
      if (bestIdx === prev) return;

      const lastBest = lastBestRef.current;
      if (bestIdx !== lastBest) {
        lastBestRef.current = bestIdx;
        return;
      }

      activeRef.current = bestIdx;
      switchLockUntilRef.current = now + 160;
      setActive(bestIdx);
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.krHimStep);
          if (!Number.isNaN(idx)) applyBest(idx);
          return;
        }

        applyBest(computeBestIdx());
      },
      {
        root: null,
        threshold: [0.08, 0.15, 0.25, 0.35],
        rootMargin: "-10% 0px -40% 0px",
      },
    );

    els.forEach((el) => io.observe(el));

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        applyBest(computeBestIdx());
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const initial = computeBestIdx();
    activeRef.current = initial;
    lastBestRef.current = initial;
    setActive(initial);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section aria-label="Как проходит химчистка" className="py-12 sm:py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
              КАК ЭТО РАБОТАЕТ
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
              3 этапа — и шторы снова как новые
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Спокойный сервис: без суеты и лишних вопросов. Вы получаете результат и чистый монтаж обратно.
            </p>

            <div className="mt-8">
              {steps.map((s, idx) => (
                <div
                  key={s.title}
                  data-kr-him-step={idx}
                  className={`min-h-[24vh] py-8 transition sm:min-h-[44vh] sm:py-10 ${
                    idx !== 0 ? "border-t border-black/10 dark:border-white/10" : ""
                  }`}
                >
                  <div className="flex h-full flex-col justify-center">
                    <div className="flex items-start gap-5">
                      <div
                        className={`mt-0.5 w-14 shrink-0 tabular-nums tracking-tight transition ${
                          active === idx
                            ? "text-base font-semibold text-[color:var(--fg)] sm:text-lg"
                            : "text-base font-semibold text-[color:var(--muted)] sm:text-lg"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </div>

                      <div
                        className={`relative flex-1 pl-5 transition ${
                          active === idx ? "opacity-100" : "opacity-90"
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-0 h-full w-px transition ${
                            active === idx
                              ? "bg-[color:var(--accent)]/70"
                              : "bg-black/15 dark:bg-white/15"
                          }`}
                          aria-hidden="true"
                        />

                        <div className="text-2xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-3xl">
                          {s.title}
                        </div>
                        <div className="mt-3 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                          {s.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-24">
              <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="relative aspect-[4/3]">
                  <div className="absolute inset-0">
                    {visuals.map((v, idx) => (
                      <div
                        key={v.src}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                          idx === active ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <Image
                          src={v.src}
                          alt={v.alt}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover"
                          priority={false}
                        />
                      </div>
                    ))}
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),rgba(0,0,0,0.10),rgba(0,0,0,0))]" />
                  </div>

                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute -left-10 top-10 h-32 w-32 rounded-full border border-black/10 bg-white/25 backdrop-blur dark:border-white/10 dark:bg-white/10" />
                    <div className="absolute -right-12 bottom-10 h-40 w-40 rounded-full border border-black/10 bg-white/25 backdrop-blur dark:border-white/10 dark:bg-white/10" />
                  </div>

                  <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_30%_20%,rgba(0,0,0,0.05),transparent_60%),radial-gradient(900px_circle_at_70%_70%,rgba(0,0,0,0.07),transparent_62%)] dark:bg-[radial-gradient(1000px_circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%),radial-gradient(900px_circle_at_70%_70%,rgba(255,255,255,0.04),transparent_62%)]" />

                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-[color:var(--muted)] shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                    {steps[active]?.label}
                  </div>

                  <div className="absolute right-6 top-6">
                    <div className="relative h-12 w-12">
                      <div className="absolute inset-0 rounded-full bg-[color:var(--accent)]/10" />
                      <div className="absolute inset-0 animate-[kr-ping_1.8s_ease-out_infinite] rounded-full border border-[color:var(--accent)]/40" />
                      <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--accent)]" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-2xl font-semibold tracking-tight text-white">
                      {steps[active]?.title}
                    </div>
                    <div className="mt-2 max-w-md text-sm leading-6 text-white/80">
                      {steps[active]?.description}
                    </div>

                    <div className="mt-5 flex gap-2">
                      {steps.map((_, idx) => (
                        <div
                          key={idx}
                          aria-hidden="true"
                          className={`h-1.5 flex-1 rounded-full transition ${
                            idx === active
                              ? "bg-[color:var(--accent)]"
                              : "bg-black/10 dark:bg-white/15"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-[color:var(--muted)]">
                Скролль вниз — блок подсвечивает текущий этап.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
