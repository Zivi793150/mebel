"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/Container";

type Step = {
  yearLabel: string;
  title: string;
  description: string;
};

export function AboutStory({ images }: { images?: string[] }) {
  const steps: Step[] = useMemo(
    () => [
      {
        yearLabel: "2002",
        title: "Начало пути",
        description:
          "Татьяна Наумова начинает деятельность — первые проекты и первые стандарты качества.",
      },
      {
        yearLabel: "Рост",
        title: "Доверие и система",
        description:
          "Собственный цех, заказные ткани и проекты под ключ — от идеи до монтажа.",
      },
      {
        yearLabel: "Сегодня",
        title: "Ведущий салон",
        description:
          "Koenig Room — один из ведущих салонов Калининграда в сфере текстильного и интерьерного дизайна.",
      },
      {
        yearLabel: "Принципы",
        title: "Клиент — в центре",
        description:
          "Развиваемся, обновляем коллекции и работаем с сильными партнёрами — чтобы результат был уверенным.",
      },
      {
        yearLabel: "Сейчас",
        title: "Сильный результат",
        description:
          "Делаем аккуратно и точно. Берём ответственность за результат, который хочется показывать.",
      },
    ],
    [],
  );

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;

    const els = Array.from(root.querySelectorAll("[data-kr-about-step]"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.krAboutStep);
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      {
        root: null,
        threshold: [0.18, 0.28, 0.42, 0.58],
        rootMargin: "-18% 0px -58% 0px",
      },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = Math.max(1, window.innerHeight);
        const total = rect.height - vh;
        const raw = total <= 0 ? 1 : (-rect.top / total);
        const clamped = Math.max(0, Math.min(1, raw));
        setProgress(clamped);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const media = useMemo(() => {
    const fallback = ["/hero.jpg", "/hero2.jpg", "/gray_hero.jpg", "/gray_hero.jpg"];
    const srcRaw = images && images.length > 0 ? images : fallback;
    const src = Array.from(new Set(srcRaw.filter(Boolean)));

    const groups: string[][] = [];
    let cursor = 0;
    for (let i = 0; i < steps.length; i += 1) {
      const g: string[] = [];
      while (g.length < 4 && cursor < src.length) {
        g.push(src[cursor]!);
        cursor += 1;
      }

      if (g.length < 4) {
        const used = new Set(g);
        for (let j = 0; j < fallback.length && g.length < 4; j += 1) {
          const f = fallback[j]!;
          if (!used.has(f)) g.push(f);
        }
        while (g.length < 4) g.push(fallback[0]!);
      }

      groups.push(g);
    }

    return groups;
  }, [images, steps]);

  return (
    <section ref={wrapRef} className="bg-white dark:bg-neutral-950 py-10 sm:py-14">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ИСТОРИЯ</div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
            Хронология, которую увлекательно листать
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[color:var(--muted)] sm:text-base">
            Короткие сцены + визуальные фрагменты. Без простыней.
          </p>

          <div className="relative mt-12">
            <div
              className="absolute left-4 top-0 hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent via-black/15 to-transparent dark:via-white/15 md:block"
              style={{ height: "100%" }}
              aria-hidden="true"
            >
              <div
                className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[color:var(--accent)] via-sky-500 to-transparent"
                style={{ height: `${Math.max(10, Math.round(progress * 100))}%`, opacity: 0.85 }}
              />
            </div>

            <div className="grid gap-10">
              {steps.map((s, idx) => (
                <div key={s.title} className="flex justify-start pt-10 md:pt-28 md:gap-10">
                  <div className="sticky top-40 z-40 hidden max-w-xs self-start md:block md:w-full lg:max-w-sm">
                    <div className="absolute left-1.5 top-1.5 h-10 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                      <div
                        className={`h-4 w-4 rounded-full border p-2 transition ${
                          active === idx
                            ? "bg-[color:var(--accent)]/15 border-[color:var(--accent)]/60"
                            : "bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                        }`}
                      />
                    </div>
                    <h3
                      className={`pl-20 text-4xl font-bold transition ${
                        active === idx ? "text-[color:var(--fg)]" : "text-[color:var(--muted)]"
                      }`}
                    >
                      {s.yearLabel}
                    </h3>
                  </div>

                  <div
                    data-kr-about-step={idx}
                    className="relative w-full pl-14 pr-1 md:pl-0 md:pr-4"
                  >
                    <h3 className="mb-3 block text-2xl font-bold text-[color:var(--muted)] md:hidden">
                      {s.yearLabel}
                    </h3>

                    <div
                      className={`rounded-3xl border border-black/10 bg-white/60 p-6 shadow-[0_0_24px_rgba(34,42,53,0.06),_0_1px_1px_rgba(0,0,0,0.05)] backdrop-blur transition dark:border-white/10 dark:bg-white/5 ${
                        active === idx ? "translate-y-0" : ""
                      }`}
                    >
                      <div className="text-xl font-semibold tracking-tight text-[color:var(--fg)] md:text-2xl">
                        {s.title}
                      </div>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                        {s.description}
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        {media[idx].map((src, j) => (
                          <div
                            key={`${src}-${j}`}
                            className="relative h-24 overflow-hidden rounded-xl shadow-[0_0_24px_rgba(34,42,53,0.06),_0_1px_1px_rgba(0,0,0,0.05),_0_0_0_1px_rgba(34,42,53,0.04),_0_0_4px_rgba(34,42,53,0.08),_0_16px_68px_rgba(47,48,55,0.05),_0_1px_0_rgba(255,255,255,0.10)_inset] sm:h-32 lg:h-44"
                          >
                            <Image
                              src={src}
                              alt=""
                              fill
                              sizes="(min-width: 1024px) 240px, 50vw"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
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
