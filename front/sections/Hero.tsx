"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/Container";
import { ContactButton } from "@/components/ContactButton";

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
  const title = "Текстиль , который говорит без слов";
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
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          key={backgroundSrc || "/fonovaya-na-glavnuyu-1.webp"}
          src={backgroundSrc || "/fonovaya-na-glavnuyu-1.webp"}
          alt="Koenig Room"
          fill
          sizes="100vw"
          className="object-cover brightness-[0.75]"
          loading="eager"
          priority
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.35),rgba(0,0,0,0.45))]" />
      </div>

      <Container>
        <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">
          <div className="relative z-10 lg:col-span-7">
            <h1
              className="kr-word-title max-w-[46rem] text-[clamp(2.2rem,2.3vw,3.25rem)] font-medium leading-tight tracking-tight text-white"
              aria-label={title}
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

            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-white/80 sm:text-lg">
              Подбираем ткани и решения под стиль пространства.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ContactButton
                className="inline-flex h-12 items-center justify-center bg-[color:var(--accent)] px-5 text-sm font-medium text-[color:var(--accent-contrast)] transition hover:opacity-90"
                imageSrc="/foto-na-knopku-1-.webp"
              >
                Рассчитать стоимость
              </ContactButton>
              <a
                href="#catalog"
                className="inline-flex h-12 items-center justify-center border border-white/25 bg-transparent px-5 text-sm font-medium text-white transition hover:bg-white/10"
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
                    className="border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
                  >
                    <div className="text-2xl font-medium tracking-tight text-white">
                      {prefix}
                      {shown}
                      {suffix}
                    </div>
                    <div className="mt-1 text-xs font-medium tracking-[0.22em] text-white/65">
                      {s.label.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-[520px] sm:max-w-[760px] lg:max-w-[980px]">
              <Image
                src="/logo.webp"
                alt="Koenig Room"
                fill
                sizes="1240px"
                className="object-contain scale-[1.18] lg:scale-[1.45] xl:scale-[1.65]"
                style={{
                  filter:
                    "drop-shadow(0 0 1px rgba(255,255,255,0.95)) drop-shadow(0 0 3px rgba(255,255,255,0.85)) drop-shadow(0 0 14px rgba(230,242,255,0.55)) drop-shadow(0 0 32px rgba(210,232,255,0.42)) drop-shadow(0 18px 60px rgba(0,0,0,0.55))",
                }}
                loading="eager"
                priority
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
