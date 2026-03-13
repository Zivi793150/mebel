"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/Container";

type Step = {
  title: string;
  description: string;
  meta: string;
};

export function WorkOrder({ images }: { images?: string[] }) {
  const steps: Step[] = useMemo(
    () => [
      {
        title: "Заявка и короткий бриф",
        description:
          "Понимаем задачу: что хочется по стилю, сколько окон, важнее свет или приватность.",
        meta: "5–10 минут",
      },
      {
        title: "Замер и консультация",
        description:
          "Приезжаем, фиксируем размеры, показываем варианты и сразу отсекаем то, что не подходит интерьеру.",
        meta: "в удобный день",
      },
      {
        title: "Подбор материалов и расчёт",
        description:
          "Собираем 2–3 точных решения: ткань, плотность, карниз/фурнитура. Прозрачно фиксируем цену и сроки.",
        meta: "в тот же день",
      },
      {
        title: "Пошив и контроль качества",
        description:
          "Производство под ваш проект: складка, длина, швы. Проверяем посадку и аккуратность исполнения.",
        meta: "по сроку договора",
      },
      {
        title: "Монтаж и финальная настройка",
        description:
          "Устанавливаем чисто и точно. Проверяем уровень, симметрию и работу механизмов — чтобы выглядело дорого.",
        meta: "1 визит",
      },
    ],
    [],
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const bgByStep = useMemo(() => {
    const fallback = ["/1step.png", "/2step.png", "/3step.png", "/4step.png", "/4step.png"];
    if (!images || images.length === 0) return fallback;
    return Array.from({ length: steps.length }).map((_, idx) => images[idx % images.length] || fallback[idx] || fallback[0]);
  }, [images, steps.length]);

  const [bg, setBg] = useState(() => bgByStep[0] || "/gray_hero.jpg");
  const [bgPrev, setBgPrev] = useState<string | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const sectionHeightSv = 92;
  const totalHeight = `calc(${steps.length} * ${sectionHeightSv}svh)`;

  useEffect(() => {
    const next = bgByStep[Math.min(bgByStep.length - 1, active)] ?? bgByStep[0];
    if (next && next !== bg) {
      setBgPrev(bg);
      setBg(next);
      window.setTimeout(() => setBgPrev(null), 520);
    }
  }, [active, bg, bgByStep]);

  useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;

      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const totalScrollable = Math.max(1, sec.offsetHeight - vh);

      // Dead-zone at the beginning so step 1 doesn't get skipped on gentle scroll.
      // We start counting progress only after the section has moved a bit further into view.
      const startOffset = vh * 0.28;
      const raw = (vh * 0.5 - r.top - startOffset) / totalScrollable;
      const progressed = Math.min(1, Math.max(0, raw));

      const maxIdx = steps.length - 1;

      // Hold the first step longer so it doesn't get skipped on steady scroll.
      // Require almost a full "step" worth of progress before moving away from 0.
      const holdFirstUntil = 0.85 / (maxIdx + 1);
      if (progressed < holdFirstUntil) {
        setActive((prev) => (prev === 0 ? prev : 0));
        return;
      }

      // Map progress into [0..maxIdx] with a bit of hysteresis-friendly rounding.
      // Using +1e-6 avoids edge flicker when progressed is extremely close to a boundary.
      const idx = Math.min(
        maxIdx,
        Math.max(0, Math.floor((progressed + 1e-6) * (maxIdx + 1))),
      );
      setActive((prev) => (prev === idx ? prev : idx));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [steps.length]);

  return (
    <section
      ref={sectionRef}
      aria-label="Порядок работы"
      className="relative kr-header-invert"
      style={{ height: totalHeight }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bgPrev ?? bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-500 ${
            bgPrev ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 700px at 50% 20%, rgba(0,0,0,0.22), rgba(0,0,0,0.62) 66%), linear-gradient(to bottom, rgba(0,0,0,0.32), rgba(0,0,0,0.58))",
          }}
        />

        <Container>
          <div className="relative flex h-[100svh] items-center justify-center">
            <div
              key={active}
              className="w-full max-w-4xl text-center kr-work-bounce"
            >
              <div className="mx-auto w-full max-w-4xl px-6 py-9 sm:px-10 sm:py-12">
                <div className="text-xs font-semibold tracking-[0.34em] text-white/70">
                  ПОРЯДОК РАБОТЫ
                </div>

                <div className="mt-5 flex items-center justify-center gap-4">
                  <div className="text-sm font-semibold tracking-[0.34em] text-white/70">
                    {String(active + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="text-sm font-semibold tracking-[0.34em] text-white/55"
                    aria-hidden="true"
                  >
                    ·
                  </div>
                  <div className="text-sm font-semibold tracking-[0.34em] text-white/70">
                    {steps[active]?.meta}
                  </div>
                </div>

                <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-6xl">
                  {steps[active]?.title}
                </h2>
                <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-white/80 sm:mt-5 sm:text-xl sm:leading-8">
                  {steps[active]?.description}
                </p>

                {active === steps.length - 1 ? (
                  <div className="mt-10">
                    <a
                      href="#cta"
                      className="inline-flex h-14 items-center justify-center rounded-full bg-[color:var(--accent)] px-12 text-lg font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                    >
                      Связаться и рассчитать
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
