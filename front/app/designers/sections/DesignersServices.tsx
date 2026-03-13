"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/Container";

const services = [
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1c.4.3.8.4 1.3.4h5c.7 0 1.3-.4 1.7-.9l4.5-6.3c.4-.5.3-1.2-.2-1.6l-3.9-3.2c-.5-.4-1.2-.3-1.6.2l-2.8 3.9" />
        <path d="M12 5a3 3 0 1 0 3 3" />
        <path d="M12 5V3" />
        <path d="M6.5 21l-1-3" />
        <path d="M15.5 21l1-3" />
      </svg>
    ),
    title: "Подбор тканей",
    description: "Индивидуальный подбор материалов под стиль вашего проекта из коллекции 1000+ европейских тканей",
    features: [],
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
        <path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
        <path d="M8 7v13" />
        <path d="M16 7v13" />
        <path d="M12 7v13" />
      </svg>
    ),
    title: "Расчёт размеров",
    description: "Точные замеры и расчёты для идеальной посадки штор в пространстве",
    features: [],
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <path d="M12 2l4 4" />
        <path d="M12 2l-4 4" />
        <path d="M12 22l4-4" />
        <path d="M12 22l-4-4" />
        <path d="M2 12l4-4" />
        <path d="M2 12l4 4" />
        <path d="M22 12l-4 4" />
        <path d="M22 12l-4-4" />
      </svg>
    ),
    title: "Оформление КП",
    description: "Профессиональные коммерческие предложения для ваших клиентов",
    features: [],
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
        <path d="M9 9l6 6" />
        <path d="M15 9l-6 6" />
      </svg>
    ),
    title: "Вышивка и декор",
    description: "Уникальная вышивка и декорирование под ваш концепт",
    features: [],
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
    title: "Выезд специалиста",
    description: "Выезд на объект с образцами и консультация прорабов и строителей",
    features: [],
  },
  {
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Партнёрские цены",
    description: "Особые условия для профессионалов индустрии дизайна",
    features: [],
  },
];

export function DesignersServices() {
  const [hovered, setHovered] = useState<number | null>(null);
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
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-[color:var(--bg)] py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)] uppercase">
            Что мы предлагаем
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
            Комплексное сопровождение проекта
          </h2>
          <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
            Берём на себя все этапы работы с текстилем — от выбора ткани до финального монтажа
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:mt-16">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className={`group relative rounded-2xl border border-[color:var(--divider)] bg-[color:var(--card)] p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:border-[color:var(--accent)]/30 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${idx * 80}ms` }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-[color:var(--accent)] transition-colors group-hover:bg-[color:var(--accent)] group-hover:text-[color:var(--accent-contrast)]">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-[color:var(--fg)]">
                  {service.title}
                </h3>
              </div>

              <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
                {service.description}
              </p>

              {service.features.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-medium text-[color:var(--accent)]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              ) : null}

              <div
                className={`absolute bottom-0 left-0 h-1 rounded-b-2xl bg-[color:var(--accent)] transition-all duration-500 ${
                  hovered === idx ? "w-full" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
