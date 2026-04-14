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
  {
    title: "Постобслуживание текстиля",
    description: "Поможем придать вашим шторам первоначальный вид",
    stat: "П.4",
    statLabel: "",
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
      className="py-16 sm:py-20"
    >
      <Container>
        {/* Header - full width */}
        <div className="mb-12">
          <div className="mb-4">
            <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
              Почему
            </span>
            <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
              выбирают нас
            </span>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            Мы работаем с профессионалами более 20 лет. Знаем, что важно для дизайнеров: скорость, качество и надёжность.
          </p>
        </div>

        {/* 3 columns: left benefits, center photo, right benefits */}
        <div className="grid gap-8 lg:grid-cols-[1fr,380px,1fr] lg:gap-8 items-start">
          {/* Left column - benefits 1-2 */}
          <div className="space-y-6">
            {benefits.slice(0, 2).map((benefit, idx) => (
              <article
                key={benefit.title}
                className={`group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)] ${
                  inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                  <div className="text-xl font-medium text-[color:var(--fg)]">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="text-sm font-medium text-[color:var(--green)]">
                    {benefit.stat} {benefit.statLabel}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>

          {/* Center column - photo */}
          <div className="relative order-first lg:order-none">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/foto-na-zamenu-salon-.webp"
                alt="Татьяна Наумова"
                fill
                sizes="(min-width: 1024px) 380px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right column - benefits 3-4 */}
          <div className="space-y-6">
            {benefits.slice(2, 4).map((benefit, idx) => (
              <article
                key={benefit.title}
                className={`group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)] ${
                  inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
                style={{ transitionDelay: `${(idx + 2) * 120}ms` }}
              >
                <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                  <div className="text-xl font-medium text-[color:var(--fg)]">
                    {String(idx + 3).padStart(2, "0")}
                  </div>
                  <div className="text-sm font-medium text-[color:var(--green)]">
                    {benefit.stat} {benefit.statLabel}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
