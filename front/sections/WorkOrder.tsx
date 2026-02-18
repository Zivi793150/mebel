"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/Container";

type Step = {
  title: string;
  description: string;
  meta: string;
};

export function WorkOrder() {
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
  const wheelAccumRef = useRef(0);
  const wheelDirRef = useRef<1 | -1 | 0>(0);
  const wheelLockRef = useRef(false);
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [bg, setBg] = useState("/gray_hero.jpg");
  const [bgPrev, setBgPrev] = useState<string | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const bgByStep = useMemo(() => {
    return ["/1step.png", "/2step.png", "/3step.png", "/4step.png", "/4step.png"];
  }, []);

  const sectionHeightSv = 160;
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
      const progressed = Math.min(
        1,
        Math.max(0, (vh * 0.5 - r.top) / totalScrollable),
      );

      const maxIdx = steps.length - 1;
      const raw = Math.floor(progressed * (maxIdx + 1));
      const idx = Math.min(maxIdx, Math.max(0, raw));
      setActive((prev) => (prev === idx ? prev : idx));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [steps.length]);

  function isSectionActive() {
    const sec = sectionRef.current;
    if (!sec) return false;
    const r = sec.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    return r.top < vh * 0.85 && r.bottom > vh * 0.15;
  }

  function scrollToStep(idx: number) {
    const sec = sectionRef.current;
    if (!sec) return;

    const vh = window.innerHeight || 1;
    const totalScrollable = Math.max(1, sec.offsetHeight - vh);
    const maxIdx = Math.max(1, steps.length - 1);
    const t = idx / maxIdx;

    const r = sec.getBoundingClientRect();
    const targetY = window.scrollY + r.top + t * totalScrollable;

    wheelLockRef.current = true;
    window.scrollTo({ top: targetY, behavior: "smooth" });
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 520);
  }

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (wheelLockRef.current) {
        e.preventDefault();
        return;
      }

      if (!isSectionActive()) return;

      const dy = e.deltaY;
      if (Math.abs(dy) < 8) return;

      const dir = (dy > 0 ? 1 : -1) as 1 | -1;
      const current = activeRef.current;

      const isLeavingUp = current === 0 && dir === -1;
      const isLeavingDown = current === steps.length - 1 && dir === 1;
      if (isLeavingUp || isLeavingDown) return;

      e.preventDefault();

      if (wheelDirRef.current !== dir) {
        wheelDirRef.current = dir;
        wheelAccumRef.current = 0;
      }

      wheelAccumRef.current += Math.abs(dy);
      if (wheelAccumRef.current < 140) return;
      wheelAccumRef.current = 0;

      const next = Math.min(steps.length - 1, Math.max(0, current + dir));
      scrollToStep(next);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [active, steps.length]);

  return (
    <section
      ref={sectionRef}
      aria-label="Порядок работы"
      className="relative"
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
              <div className="mx-auto w-full max-w-4xl px-7 py-10 sm:px-10 sm:py-12">
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

                <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                  {steps[active]?.title}
                </h2>
                <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/80 sm:text-xl">
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
