"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/Container";

type ProofStat = {
  label: string;
  value: number;
  suffix?: string;
};

function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setInView(entries[0].isIntersecting);
      },
      options ?? { threshold: 0.25, rootMargin: "-10% 0px -35% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView } as const;
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(n));
}

export function Hero({ backgroundSrc }: { backgroundSrc?: string }) {
  const title = "Свет, приватность и интерьер — в одном премиальном решении.";
  const titleWords = title.split(" ");

  const stats: ProofStat[] = useMemo(
    () => [
      { label: "проектов в подборе", value: 1280, suffix: "+" },
      { label: "средняя оценка", value: 4.9 },
      { label: "дней до монтажа", value: 10, suffix: "≈" },
    ],
    [],
  );

  const { ref: proofRef, inView: proofInView } = useInView<HTMLDivElement>({
    threshold: 0.25,
    rootMargin: "-10% 0px -35% 0px",
  });
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    if (!proofInView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 980;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnim(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [proofInView]);

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundSrc || "/hero.jpg"}
          alt="Koenig Room"
          fill
          sizes="100vw"
          className="object-cover scale-[1.04] blur-[2px] brightness-[0.92] dark:brightness-[0.48]"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,255,255,0.55),transparent_62%),linear-gradient(to_bottom,rgba(255,255,255,0.34),rgba(255,255,255,0.38),rgba(255,255,255,0.46))] dark:bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(to_bottom,rgba(8,12,20,0.58),rgba(8,12,20,0.68),rgba(8,12,20,0.84))]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_80%_80%,rgba(0,0,0,0.10),transparent_60%)] dark:bg-[radial-gradient(1200px_circle_at_80%_80%,rgba(0,0,0,0.35),transparent_60%)]" />
      </div>

      <Container>
        <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">
          <div className="relative z-10 lg:col-span-7">
            <h1
              className="kr-word-title max-w-[46rem] text-[clamp(1.7rem,2.3vw,3.25rem)] font-semibold leading-tight tracking-tight text-[color:var(--fg)] dark:text-white"
              aria-label={title}
              style={{ textShadow: "0 18px 60px rgba(0,0,0,0.18)" }}
            >
              {titleWords.map((w, i) => (
                <span key={i}>
                  <span className="kr-word" style={{ "--i": i } as CSSProperties}>
                    {w}
                  </span>
                  {i === titleWords.length - 1 ? "" : " "}
                </span>
              ))}
            </h1>

            <p
              className="mt-4 max-w-xl text-pretty text-base leading-7 text-[color:var(--muted)] sm:text-lg dark:text-white"
              style={{ textShadow: "0 14px 44px rgba(0,0,0,0.12)" }}
            >
              Подбираем ткани и решения под стиль пространства. Шьём, собираем,
              устанавливаем. Чистый премиум без лишнего шума.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#cta"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[color:var(--fg)] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:bg-white dark:text-[#0b1220] dark:hover:bg-white/90 dark:focus-visible:ring-white/40"
              >
                Рассчитать стоимость
              </Link>
              <a
                href="#catalog"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-black/15 bg-white/30 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/30 dark:bg-white/0 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white/30"
              >
                Смотреть каталог
              </a>
            </div>

            <div ref={proofRef} className="mt-9 grid gap-3 sm:grid-cols-3">
              {stats.map((s) => {
                const val = s.value * anim;
                const shown = s.value % 1 === 0 ? formatNumber(val) : val.toFixed(1);
                const prefix = s.suffix === "≈" ? "≈" : "";
                const suffix = s.suffix && s.suffix !== "≈" ? s.suffix : "";
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-black/10 bg-white/55 px-4 py-3 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/5"
                  >
                    <div className="text-2xl font-semibold tracking-tight text-[color:var(--fg)] dark:text-white">
                      {prefix}
                      {shown}
                      {suffix}
                    </div>
                    <div className="mt-1 text-xs font-medium tracking-[0.22em] text-[color:var(--muted)] dark:text-white/65">
                      {s.label.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 lg:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-[520px] sm:max-w-[760px] lg:max-w-[980px]">
              <Image
                src="/logo.png"
                alt="Koenig Room"
                fill
                sizes="1240px"
                className="object-contain scale-[1.18] lg:scale-[1.45] xl:scale-[1.65]"
                style={{
                  filter:
                    "drop-shadow(0 0 1px rgba(255,255,255,0.95)) drop-shadow(0 0 3px rgba(255,255,255,0.85)) drop-shadow(0 0 14px rgba(230,242,255,0.55)) drop-shadow(0 0 32px rgba(210,232,255,0.42)) drop-shadow(0 18px 60px rgba(0,0,0,0.55))",
                }}
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
