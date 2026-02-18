"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Proof = {
  title: string;
  description: string;
};

export function PreCatalogTeaser() {
  const values = useMemo(
    () => [
      "Точность",
      "Фактура",
      "Свет",
      "Посадка",
      "Чистый монтаж",
      "Под ключ",
      "Премиальные материалы",
      "Спокойный сервис",
      "Детали решают",
    ],
    [],
  );

  const proofs: Proof[] = useMemo(
    () => [
      {
        title: "Материалы выглядят дороже",
        description:
          "Ткани и фактуры, которые читаются в свете. Не “просто шторы”, а атмосфера комнаты.",
      },
      {
        title: "Точность в сантиметрах",
        description:
          "Посадка, длина и складка — то, что отличает премиум. Согласуем и доводим до чистого вида.",
      },
      {
        title: "Спокойный сервис",
        description:
          "Делаем под ключ: подбор, пошив, монтаж. Без шума и лишних вопросов — с понятным результатом.",
      },
    ],
    [],
  );

  const rootRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setInView(entries[0].isIntersecting);
      },
      { threshold: 0.2, rootMargin: "-10% 0px -35% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;

    function tick() {
      const root = rootRef.current;
      const v = visualRef.current;
      if (!root || !v) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const t = (vh - rect.top) / (vh + rect.height);
      const p = Math.min(1, Math.max(0, t));

      const dy = (p - 0.5) * 18;
      v.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`;

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={rootRef} aria-label="Почему Koenig Room" className="pt-0">
      <div className="w-full">
        <div className="bg-[color:var(--bg)]">
          <div className="kr-ticker bg-black/[0.015] py-4 dark:bg-white/[0.02]">
            <div className="kr-ticker-track gap-12 px-4 text-sm font-semibold tracking-[0.22em] text-[color:var(--fg)]/65 sm:px-6 sm:text-base lg:px-8">
              {[...values, ...values].map((v, i) => (
                <div key={`${v}-${i}`} className="flex items-center gap-12">
                  <span className="whitespace-nowrap uppercase">{v}</span>
                  <span className="h-[7px] w-[7px] rotate-45 bg-black/15 dark:bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid items-stretch lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
              <div className="flex min-h-[660px] flex-col lg:min-h-[760px]">
                <div>
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                    ЦЕННОСТИ KOENIG ROOM
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
                    Каталог — это быстро.
                    <span className="text-[color:var(--muted)]"> Но “дорого” рождается до него.</span>
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                    Ткани, посадка и свет — это то, что делает интерьер цельным. Мы собираем это под
                    ключ и доводим до чистого результата.
                  </p>
                </div>

                <div className="mt-8 grid gap-9">
                  {proofs.map((p, idx) => (
                    <div
                      key={p.title}
                      className={`transition-[opacity,transform] duration-700 ${
                        inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                      }`}
                      style={{ transitionDelay: `${120 + idx * 140}ms` }}
                    >
                      <div className="grid grid-cols-[44px_1fr] items-start gap-6">
                        <div className="pt-1 text-base font-semibold tracking-tight text-[color:var(--muted)]">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <div className="text-base font-semibold text-[color:var(--fg)]">{p.title}</div>
                          <div className="mt-2 text-base leading-7 text-[color:var(--muted)]">
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`mt-auto transition-[opacity,transform] duration-700 ${
                    inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: "640ms" }}
                >
                  <a
                    href="/about"
                    className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[color:var(--accent)] px-8 text-lg font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                  >
                    О нас
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative min-h-[660px] overflow-hidden lg:min-h-[760px]">
              <div ref={visualRef} className="absolute inset-0">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/why%20us.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.50),transparent_62%)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
