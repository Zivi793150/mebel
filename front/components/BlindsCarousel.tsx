"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Slide = {
  title: string;
  description: string;
  imageSrc: string;
};

export function BlindsCarousel({ images }: { images?: string[] }) {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Горизонтальные",
        description: "Точная настройка света. Смотрятся собранно и “дорого” при чистом монтаже.",
        imageSrc: "/catalog/blinds.jpg",
      },
      {
        title: "Рулонные системы",
        description: "Минимализм и практичность: от мягкого рассеивания до blackout.",
        imageSrc: "/catalog/roman.jpg",
      },
      {
        title: "Вертикальные",
        description: "Хороши для больших проёмов. Мягче по восприятию и проще зонируют пространство.",
        imageSrc: "/catalog/rails.jpg",
      },
      {
        title: "День‑ночь",
        description: "Чередование полос ткани: быстро регулирует приватность и свет в течение дня.",
        imageSrc: "/catalog/decor.jpg",
      },
      {
        title: "Blackout",
        description: "Сон, кино, детская: максимальное затемнение без тяжёлых портьер.",
        imageSrc: "/catalog/bed.jpg",
      },
    ],
    [],
  );

  const derivedSlides = useMemo(() => {
    if (!images || images.length === 0) return slides;
    return slides.map((s, idx) => ({
      ...s,
      imageSrc: images[idx % images.length] || s.imageSrc,
    }));
  }, [images, slides]);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;

    const onScroll = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const children = Array.from(wrap.children) as HTMLElement[];
        if (children.length === 0) return;

        const x = wrap.scrollLeft;
        let best = 0;
        let bestDist = Number.POSITIVE_INFINITY;

        for (let i = 0; i < children.length; i += 1) {
          const c = children[i];
          const d = Math.abs(c.offsetLeft - x);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        }

        setActive((prev) => (prev === best ? prev : best));
      });
    };

    wrap.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      wrap.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  const canPrev = active > 0;
  const canNext = active < derivedSlides.length - 1;

  const stepScroll = (dir: -1 | 1) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const delta = Math.max(320, Math.round(wrap.clientWidth * 0.75));
    wrap.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    pointerIdRef.current = e.pointerId;
    wrap.setPointerCapture(e.pointerId);

    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartScrollLeftRef.current = wrap.scrollLeft;
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartXRef.current;
    wrap.scrollLeft = dragStartScrollLeftRef.current - dx;
  };

  const endDrag = (wrap: HTMLDivElement, pointerId: number | null) => {
    if (pointerId !== null) {
      try {
        wrap.releasePointerCapture(pointerId);
      } catch {
        // ignore
      }
    }
    pointerIdRef.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    endDrag(wrap, pointerIdRef.current);
  };

  const onPointerCancel: React.PointerEventHandler<HTMLDivElement> = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    endDrag(wrap, pointerIdRef.current);
  };

  return (
    <section className="py-14 sm:py-18">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between md:mb-14">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--fg)] md:text-4xl lg:text-5xl">
              Выберите систему
            </h2>
            <p className="max-w-xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              У жалюзи много вариантов: отличаются по управлению светом, приватности и посадке на окно.
              Ниже — быстрый ориентир.
            </p>
          </div>

          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              type="button"
              onClick={() => stepScroll(-1)}
              disabled={!canPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
              aria-label="Назад"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => stepScroll(1)}
              disabled={!canNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
              aria-label="Вперёд"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-[linear-gradient(to_right,rgba(246,246,246,0.95),rgba(246,246,246,0))] dark:bg-[linear-gradient(to_right,rgba(10,10,10,0.85),rgba(10,10,10,0))]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-[linear-gradient(to_left,rgba(246,246,246,0.95),rgba(246,246,246,0))] dark:bg-[linear-gradient(to_left,rgba(10,10,10,0.85),rgba(10,10,10,0))]" />

            {canPrev ? (
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-[color:var(--muted)] shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <span aria-hidden="true">←</span>
                </div>
              </div>
            ) : null}

            {canNext ? (
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-[color:var(--muted)] shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            ) : null}

            <div
              ref={wrapRef}
              className={
                "flex gap-4 overflow-x-auto scroll-smooth pb-6 pr-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" +
                (isDragging ? " cursor-grabbing select-none" : " cursor-grab")
              }
              style={{ scrollSnapType: "x mandatory" }}
              role="region"
              aria-roledescription="carousel"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              {derivedSlides.map((s) => (
                <div
                  key={s.title}
                  role="group"
                  aria-roledescription="slide"
                  className="min-w-0 shrink-0 grow-0 basis-full max-w-[320px] sm:max-w-[340px] lg:max-w-[380px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="group relative min-h-[26rem] overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                    <Image
                      src={s.imageSrc}
                      alt={s.title}
                      fill
                      sizes="(min-width: 1024px) 380px, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.25),rgba(0,0,0,0.62))]" />

                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="text-xl font-semibold tracking-tight text-white">
                        {s.title}
                      </div>
                      <div className="mt-2 text-sm leading-6 text-white/80">
                        {s.description}
                      </div>
                      <div className="mt-5">
                        <a
                          href="#cta"
                          onClick={(e) => {
                            if (isDraggingRef.current) e.preventDefault();
                          }}
                          className="inline-flex h-11 items-center justify-center rounded-2xl bg-white/90 px-4 text-sm font-semibold text-black shadow-sm transition hover:bg-white"
                        >
                          Узнать стоимость <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="h-[3px] w-[240px] rounded-full bg-black/10 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-[color:var(--accent)] transition-[width] duration-300"
                style={{ width: `${((active + 1) / derivedSlides.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
