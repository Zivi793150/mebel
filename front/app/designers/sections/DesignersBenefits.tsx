"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/Container";

const benefits = [
  {
    title: "Европейские ткани",
    description: "Более 1000 тканей от ведущих европейских производителей",
    stat: "1000+",
    statLabel: "тканей",
  },
  {
    title: "Быстрый пошив",
    description: "Отшиваем от 3-10 дней, если ткань в наличии на складе",
    stat: "3-10",
    statLabel: "дней",
  },
  {
    title: "Собственное производство",
    description: "Полный контроль качества на всех этапах изготовления",
    stat: "100%",
    statLabel: "контроль",
  },
];

export function DesignersBenefits() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)] uppercase">
              Преимущества
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
              Почему дизайнеры выбирают Koenig Room
            </h2>
            <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
              Мы работаем с профессионалами более 20 лет. Знаем, что важно для дизайнеров: скорость, качество и надёжность.
            </p>

            <div className="mt-8 grid gap-6">
              {benefits.map((benefit, idx) => (
                <div
                  key={benefit.title}
                  className={`flex items-center gap-6 rounded-2xl border border-[color:var(--divider)] bg-[color:var(--card)] p-5 transition-all duration-500 hover:bg-[color:var(--card)]/80 ${
                    inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${idx * 120}ms` }}
                >
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-[color:var(--accent-soft)]">
                    <span className="text-xl font-bold text-[color:var(--fg)]">
                      {benefit.stat}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[color:var(--muted)]">
                      {benefit.statLabel}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[color:var(--fg)]">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-square lg:aspect-[4/5]">
              <Image
                src="/about_us.jpg"
                alt="Ткани Koenig Room"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            <div className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-2xl bg-[color:var(--accent)]/20 backdrop-blur-sm lg:block" />
            <div className="absolute -bottom-4 -left-4 hidden h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm lg:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}
