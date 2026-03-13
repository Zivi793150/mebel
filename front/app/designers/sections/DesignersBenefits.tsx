"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/Container";

const fabrics = [
  { name: "DETROIT DIAMOND", origin: "Италия" },
  { name: "EVOLUTIO Espocada", origin: "Испания" },
  { name: "Secret Garden", origin: "Франция" },
  { name: "Zina Ballerina Pearl", origin: "Бельгия" },
  { name: "Lerena Haze", origin: "Италия" },
  { name: "Premium Collection", origin: "Европа" },
];

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
      className="kr-dark-section py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.32em] text-[color:var(--panel-dark-fg)]/60 uppercase">
              Преимущества
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--panel-dark-fg)] sm:text-4xl">
              Почему дизайнеры выбирают Koenig Room
            </h2>
            <p className="mt-4 text-base leading-7 text-[color:var(--panel-dark-fg)]/70">
              Мы работаем с профессионалами более 20 лет. Знаем, что важно для дизайнеров: скорость, качество и надёжность.
            </p>

            <div className="mt-8 grid gap-6">
              {benefits.map((benefit, idx) => (
                <div
                  key={benefit.title}
                  className={`flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-500 hover:bg-white/10 ${
                    inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${idx * 120}ms` }}
                >
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-[color:var(--accent)]/20">
                    <span className="text-xl font-bold text-[color:var(--panel-dark-fg)]">
                      {benefit.stat}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[color:var(--panel-dark-fg)]/60">
                      {benefit.statLabel}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[color:var(--panel-dark-fg)]">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--panel-dark-fg)]/70">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md">
                  <h4 className="text-sm font-semibold tracking-wider text-white/80 uppercase">
                    Коллекция тканей
                  </h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {fabrics.map((fabric) => (
                      <span
                        key={fabric.name}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                        {fabric.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-2xl bg-[color:var(--accent)]/20 backdrop-blur-sm lg:block" />
            <div className="absolute -bottom-4 -left-4 hidden h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm lg:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}
