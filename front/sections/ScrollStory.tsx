"use client";

import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/Container";

type Step = {
  title: string;
  description: string;
  overlayLabel: string;
  videoSrc: string;
};

export function ScrollStory() {
  const steps: Step[] = useMemo(
    () => [
      {
        title: "Свет и приватность",
        description:
          "Настраиваем: мягкий дневной свет или полное затемнение. Вы получаете красивый интерьер и комфорт.",
        overlayLabel: "Blackout / полупрозрачные",
        videoSrc: "/scroll_video.mp4",
      },
      {
        title: "Фактура ткани",
        description:
          "Тактильность и складка решают ощущение премиальности. Подбираем материал под интерьер и сценарий комнаты.",
        overlayLabel: "Фактура / плотность",
        videoSrc: "/3.1.mp4",
      },
      {
        title: "Декор и детали",
        description:
          "Карнизы, подхваты, фурнитура и аксессуары — именно они делают проект законченно дорогим.",
        overlayLabel: "Декор / фурнитура",
        videoSrc: "/3.2.mp4",
      },
    ],
    [],
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-kr-step]"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.krStep);
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: "-20% 0px -55% 0px",
      },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-[#eef0f3] py-10 sm:py-14">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="sticky top-24">
              <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white/70 shadow-sm backdrop-blur">

                <div className="relative aspect-[4/3]">
                  {steps.map((s, idx) => (
                    <div
                      key={s.title}
                      className="absolute inset-0 opacity-0 transition-[opacity,transform] duration-700 will-change-transform"
                      style={{ opacity: active === idx ? 1 : 0 }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: "ellipse(60% 48% at 52% 50%)",
                        }}
                      >
                        <video
                          className={`h-full w-full object-cover transition-transform duration-700 ${
                            active === idx ? "scale-[1.06]" : "scale-[1.02]"
                          }`}
                          src={s.videoSrc}
                          autoPlay={active === idx}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      </div>
                      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.62),transparent_60%)]" />
                    </div>
                  ))}

                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute -left-10 top-10 h-32 w-32 rounded-full border border-black/10 bg-white/25 backdrop-blur" />
                    <div className="absolute -right-12 bottom-10 h-40 w-40 rounded-full border border-black/10 bg-white/25 backdrop-blur" />
                  </div>

                  <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
                    {steps[active]?.overlayLabel}
                  </div>

                  <div className="absolute right-6 top-6">
                    <div className="relative h-12 w-12">
                      <div className="absolute inset-0 rounded-full bg-white/20" />
                      <div className="absolute inset-0 animate-[kr-ping_1.8s_ease-out_infinite] rounded-full border border-white/60" />
                      <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-2xl font-semibold tracking-tight text-white">
                      {steps[active]?.title}
                    </div>
                    <div className="mt-2 max-w-md text-sm leading-6 text-white/80">
                      {steps[active]?.description}
                    </div>
                  </div>

                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M20,78 C30,58 38,52 50,50 C62,48 70,56 82,78"
                      fill="none"
                      stroke="rgba(255,255,255,0.72)"
                      strokeWidth="0.9"
                      strokeLinecap="round"
                      strokeDasharray="2 2"
                      style={{
                        opacity: active === 1 ? 1 : 0.12,
                        transition: "opacity 600ms ease",
                      }}
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-4 text-xs text-black/50">
                Скролль вниз — подсветка меняется, как в продуктовых сторителлингах.
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="text-xs font-semibold tracking-[0.32em] text-black/55">
              ПРОЦЕСС
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              От выбора до идеальной складки
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-black/60 sm:text-base">
              Быстро, спокойно и профессионально. Без длинных объяснений — только
              важное.
            </p>

            <div className="mt-8">
              {steps.map((s, idx) => (
                <div
                  key={s.title}
                  data-kr-step={idx}
                  className={`min-h-[42vh] py-10 transition sm:min-h-[48vh] ${
                    idx !== 0 ? "border-t border-black/10" : ""
                  }`}
                >
                  <div className="flex h-full flex-col justify-center">
                    <div className="flex items-start gap-5">
                      <div
                        className={`mt-0.5 w-14 shrink-0 tabular-nums tracking-tight transition ${
                          active === idx
                            ? "text-base font-semibold text-black sm:text-lg"
                            : "text-base font-medium text-black/45 sm:text-lg"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </div>

                      <div
                        className={`relative flex-1 pl-5 transition ${
                          active === idx ? "opacity-100" : "opacity-85"
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-0 h-full w-px transition ${
                            active === idx
                              ? "bg-[color:var(--accent)]/70"
                              : "bg-black/15"
                          }`}
                          aria-hidden="true"
                        />

                        <div className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                          {s.title}
                        </div>
                        <div className="mt-3 max-w-xl text-base leading-7 text-black/60 sm:text-lg">
                          {s.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
