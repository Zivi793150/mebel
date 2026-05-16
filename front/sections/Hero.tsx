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
  const defaultBg = "/fonovaya-na-glavnuyu-1.webp";
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
    <section id="top" className="relative min-h-[100svh] overflow-hidden flex flex-col justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          key={backgroundSrc || defaultBg}
          src={backgroundSrc || defaultBg}
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
              className="kr-word-title max-w-[54rem] text-[clamp(2.5rem,4vw,4.5rem)] font-medium leading-[1.1] tracking-tight text-white"
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

            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/90 sm:text-xl">
              Подбираем ткани и решения под стиль пространства.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <ContactButton
                className="inline-flex h-14 items-center justify-center bg-[color:var(--accent)] px-8 text-base font-semibold text-[color:var(--accent-contrast)] transition hover:opacity-90"
                imageSrc="/foto-na-knopku-1-.webp"
              >
                Рассчитать стоимость
              </ContactButton>
              <a
                href="#catalog"
                className="inline-flex h-14 items-center justify-center border border-white/30 bg-transparent px-8 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Смотреть каталог
              </a>
            </div>

            <div ref={proofRef} className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((s) => {
                const val = s.value * anim;
                const shown = s.value % 1 === 0 ? formatNumber(val) : val.toFixed(1);
                const prefix = s.suffix === "≈" ? "≈" : "";
                const suffix = s.suffix && s.suffix !== "≈" ? s.suffix : "";
                return (
                  <div
                    key={s.label}
                    className="border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm"
                  >
                    <div className="text-3xl font-semibold tracking-tight text-white">
                      {prefix}
                      {shown}
                      {suffix}
                    </div>
                    <div className="mt-2 text-[10px] font-bold tracking-[0.25em] text-white/70">
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
