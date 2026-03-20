"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/Container";

type Proof = {
  title: string;
  description: string;
  kicker: string;
};

export function HimchistkaProofs() {
  const proofs: Proof[] = useMemo(
    () => [
      {
        kicker: "БЕЗОПАСНО",
        title: "Деликатно к ткани и фурнитуре",
        description:
          "Проверяем состав и выбираем режим. Если есть сомнения — согласуем решение, а не “рискуем на удачу”.",
      },
      {
        kicker: "УДОБНО",
        title: "Снятие и монтаж обратно",
        description:
          "Не нужно искать мастеров отдельно: снимаем, чистим, ремонтируем и устанавливаем на объект.",
      },
      {
        kicker: "КОНТРОЛЬ",
        title: "Посадка, длина, складка",
        description:
          "После чистки проверяем внешний вид и геометрию — чтобы всё выглядело ровно и дорого.",
      },
    ],
    [],
  );

  const rootRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setInView(entries[0].isIntersecting);
      },
      { threshold: 0.15, rootMargin: "-10% 0px -35% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} aria-label="Преимущества химчистки" className="py-12 sm:py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ПОДХОД</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
              Чисто не только по ткани — но и по сервису
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Мы делаем химчистку как часть премиального цикла: бережно, точно и с уважением к интерьеру.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-3">
          {proofs.map((p, idx) => (
            <div
              key={p.title}
              className={`rounded-3xl border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur transition-[opacity,transform] duration-700 dark:border-white/15 dark:bg-white/5 ${
                inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: `${120 + idx * 140}ms` }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/65">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                {p.kicker}
              </div>

              <div className="mt-4 text-lg font-semibold tracking-tight text-[color:var(--fg)]">
                {p.title}
              </div>
              <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {p.description}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
