"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type GalleryItem = {
  id: string;
  no: string;
  title: string;
  kind: string;
  year: string;
  note: string;
  imageSrc: string;
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function AboutParallaxGallery({ images }: { images?: string[] }) {
  const src = useMemo(
    () => (images && images.length > 0 ? images : ["/hero.jpg", "/hero2.jpg", "/gray_hero.jpg"]),
    [images],
  );

  const items: GalleryItem[] = useMemo(() => {
    const pick = (i: number) => src[i % src.length];

    return [
      {
        id: "start",
        no: "01",
        title: "Первые проекты",
        kind: "История",
        year: "2002",
        note: "Начало пути и первые стандарты качества.",
        imageSrc: pick(2),
      },
      {
        id: "studio",
        no: "02",
        title: "Салон и цех",
        kind: "Процесс",
        year: "2010+",
        note: "Собственный цех, заказные ткани, монтаж под ключ.",
        imageSrc: pick(7),
      },
      {
        id: "design",
        no: "03",
        title: "Текстильный дизайн",
        kind: "Подбор",
        year: "Сегодня",
        note: "Свет, фактуры и детали — как единая история интерьера.",
        imageSrc: pick(12),
      },
      {
        id: "partners",
        no: "04",
        title: "Партнёры и коллекции",
        kind: "Качество",
        year: "2× в год",
        note: "Обновляем коллекции и держим уровень материалов.",
        imageSrc: pick(18),
      },
      {
        id: "result",
        no: "05",
        title: "Результат",
        kind: "Финал",
        year: "Всегда",
        note: "Аккуратно, точно и с уважением к вашему дому.",
        imageSrc: pick(23),
      },
    ];
  }, [src]);

  const wrapRef = useRef<HTMLElement | null>(null);
  const targetRef = useRef(0);
  const progressRef = useRef(0);
  const snappedRef = useRef(false);
  const snapTimerRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let lastPainted = -1;

    const tick = () => {
      const p = progressRef.current;
      const t = targetRef.current;

      const next = p + (t - p) * 0.12;
      const snapped = Math.abs(next - t) < 0.0005 ? t : next;
      progressRef.current = snapped;

      if (snapped !== lastPainted) {
        lastPainted = snapped;
        setProgress(snapped);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const opts: AddEventListenerOptions = { passive: false, capture: true };

    const scheduleSnap = () => {
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = window.setTimeout(() => {
        const steps = Math.max(1, items.length - 1);
        const idx = Math.round(targetRef.current * steps);
        targetRef.current = idx / steps;
      }, 180);
    };

    const scrollToSectionEdge = (edge: "start" | "end") => {
      const viewH = window.innerHeight || 1;
      const docTop = window.scrollY;
      const rect = el.getBoundingClientRect();
      const sectionTop = docTop + rect.top;
      const sectionBottom = sectionTop + rect.height;

      if (edge === "start") {
        targetRef.current = 0;
        progressRef.current = 0;
        setProgress(0);
        window.scrollTo({ top: Math.max(0, sectionTop - 24) });
      } else {
        targetRef.current = 1;
        progressRef.current = 1;
        setProgress(1);
        window.scrollTo({ top: Math.max(0, sectionBottom - viewH + 64) });
      }
      snappedRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const isStickyActive = rect.top <= 0 && rect.bottom >= viewH;
      if (!isStickyActive) {
        snappedRef.current = false;
        return;
      }

      const delta = e.deltaY / (viewH * 3.6);

      const steps = Math.max(1, items.length - 1);
      const idxFloat = progressRef.current * steps;
      const atFirst = idxFloat <= 0.05;
      const atLast = idxFloat >= steps - 0.05;

      if (delta < 0 && atFirst) {
        e.preventDefault();
        scrollToSectionEdge("start");
        return;
      }
      if (delta > 0 && atLast) {
        e.preventDefault();
        scrollToSectionEdge("end");
        return;
      }

      const currentTarget = targetRef.current;
      const next = clamp(currentTarget + delta, 0, 1);

      e.preventDefault();

      if (!snappedRef.current) {
        snappedRef.current = true;
        const top = el.getBoundingClientRect().top;
        if (Math.abs(top) > 2) {
          window.scrollTo({ top: window.scrollY + top });
        }
      }

      targetRef.current = next;
      scheduleSnap();
    };

    document.addEventListener("wheel", onWheel, opts);
    return () => {
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);
      document.removeEventListener("wheel", onWheel, opts);
    };
  }, [items.length]);

  const activeIdx = useMemo(() => {
    const n = items.length;
    if (n <= 1) return 0;
    return Math.round(progress * (n - 1));
  }, [items.length, progress]);

  const vh = 100;
  const n = items.length;
  const stackH = 180;
  const active = items[activeIdx] ?? items[0];
  const activeOffsetVh = (activeIdx - progress * (n - 1)) * vh;
  const activeImgShiftPx = clamp(-activeOffsetVh * 0.55, -vh, vh);

  return (
    <section ref={wrapRef} className="relative" style={{ height: `${Math.max(4, n) * 86}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="w-screen min-h-screen flex justify-center items-center">
          <div className="w-screen min-h-screen flex justify-center items-center">
            <div className="parallax-container relative h-screen w-screen overflow-hidden">
              <ul className="project-list relative h-full">
                {items.map((it, idx) => {
                  const offset = (idx - progress * (n - 1)) * vh;
                  const imgShift = clamp(-offset * 0.55, -vh, vh);

                  return (
                    <li
                      key={it.id}
                      className="project absolute inset-0 will-change-transform"
                      style={{ transform: `translateY(${offset}vh)` }}
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="relative h-full w-full">
                          <Image
                            alt={it.title}
                            src={it.imageSrc}
                            fill
                            sizes="100vw"
                            className="object-cover will-change-transform"
                            style={{ transform: `translateY(${imgShift}px) scale(1.28)` }}
                            priority={idx === 0}
                          />
                        </div>
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.30),rgba(0,0,0,0.55))]" />
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
                <div className="w-full max-w-5xl">
                  <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                    <div className="grid items-center gap-6 p-6 sm:grid-cols-12 sm:p-10">
                      <div className="sm:col-span-3">
                        <div className="relative h-[180px] overflow-hidden">
                          {items.map((it, idx) => {
                            const off = (idx - progress * (n - 1)) * stackH;
                            const isActive = idx === activeIdx;
                            return (
                              <div
                                key={it.id + "-left"}
                                className={
                                  "absolute left-0 top-0 w-full h-[180px] space-y-6 text-[11px] font-semibold tracking-[0.28em] text-black/80 will-change-transform transition-opacity duration-200" +
                                  (isActive ? " opacity-100" : " opacity-60")
                                }
                                style={{ transform: `translateY(${off}px)` }}
                              >
                                <div>{it.no}</div>
                                <div>{it.kind.toUpperCase()}</div>
                                <div className="text-[11px] font-semibold tracking-[0.12em] text-black/60">
                                  {it.note.toUpperCase()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <div className="mx-auto w-full max-w-[360px]">
                          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-black/5">
                            <div className="absolute inset-0">
                              <div className="relative h-full w-full">
                                <Image
                                  key={active.id + "-thumb"}
                                  alt={active.title}
                                  src={active.imageSrc}
                                  fill
                                  sizes="(min-width: 1024px) 360px, 70vw"
                                  className="object-cover will-change-transform"
                                  style={{ transform: `translateY(${activeImgShiftPx}px) scale(1.28)` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-3 sm:text-right">
                        <div className="relative ml-auto h-[180px] overflow-hidden">
                          {items.map((it, idx) => {
                            const off = (idx - progress * (n - 1)) * stackH;
                            const isActive = idx === activeIdx;
                            return (
                              <div
                                key={it.id + "-right"}
                                className={
                                  "absolute right-0 top-0 w-full h-[180px] space-y-6 text-[11px] font-semibold tracking-[0.28em] text-black/80 will-change-transform transition-opacity duration-200" +
                                  (isActive ? " opacity-100" : " opacity-60")
                                }
                                style={{ transform: `translateY(${off}px)` }}
                              >
                                <div>{it.title.toUpperCase()}</div>
                                <div>{it.year}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-[28px] ring-1 ring-black/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
