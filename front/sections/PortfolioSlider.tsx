"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { Container } from "@/components/Container";


type PortfolioItem = {
  title: string;
  cover: string;
  images: string[];
};

function enc(path: string) {
  const [pathname, query = ""] = path.split("?");
  const encodedPath = pathname
    .split("/")
    .map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg)))
    .join("/");
  return query ? `${encodedPath}?${query}` : encodedPath;
}

function useOnClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      handler();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [handler, ref]);
}

function usePreloadPortfolioImages() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const allImages = PORTFOLIO_ITEMS.flatMap((item) => [item.cover, ...item.images]);
    allImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    title: "ЖК Белинского",
    cover: enc("/for_designers/zhk-belinskogo/DSCF0361.webp"),
    images: [
      enc("/for_designers/zhk-belinskogo/DSCF0361.webp"),
      enc("/for_designers/zhk-belinskogo/DSCF0370.webp"),
      enc("/for_designers/zhk-belinskogo/DSCF0379.webp"),
      enc("/for_designers/zhk-belinskogo/DSCF0381-1.webp"),
      enc("/for_designers/zhk-belinskogo/DSCF0387.webp"),
      enc("/for_designers/zhk-belinskogo/DSCF0390.webp"),
      enc("/for_designers/zhk-belinskogo/DSCF0394.webp"),
      enc("/for_designers/zhk-belinskogo/DSCF0399.webp"),
      enc("/for_designers/zhk-belinskogo/DSCF0443.webp"),
    ],
  },
  {
    title: "Аппартаменты",
    cover: enc("/for_designers/appartamenty/SVM04783-1.webp"),
    images: [
      enc("/for_designers/appartamenty/SVM04783-1.webp"),
      enc("/for_designers/appartamenty/SVM04800.webp"),
      enc("/for_designers/appartamenty/SVM04809.webp"),
      enc("/for_designers/appartamenty/SVM04819.webp"),
      enc("/for_designers/appartamenty/SVM04848.webp"),
      enc("/for_designers/appartamenty/SVM04860.webp"),
      enc("/for_designers/appartamenty/SVM04877.webp"),
      enc("/for_designers/appartamenty/SVM04890.webp"),
    ],
  },
  {
    title: "Литовский вал",
    cover: enc("/for_designers/litovskiy-val/RED_1170.webp"),
    images: [
      enc("/for_designers/litovskiy-val/RED_1170.webp"),
      enc("/for_designers/litovskiy-val/RED_1190.webp"),
      enc("/for_designers/litovskiy-val/RED_1198.webp"),
      enc("/for_designers/litovskiy-val/RED_1202.webp"),
      enc("/for_designers/litovskiy-val/RED_1220.webp"),
      enc("/for_designers/litovskiy-val/RED_1231.webp"),
      enc("/for_designers/litovskiy-val/RED_1238.webp"),
      enc("/for_designers/litovskiy-val/RED_1246.webp"),
      enc("/for_designers/litovskiy-val/RED_1280.webp"),
      enc("/for_designers/litovskiy-val/RED_1291.webp"),
    ],
  },
  {
    title: "Немецкий фонд",
    cover: enc("/for_designers/nemeckiy-fond/RED_0437_2_01.webp"),
    images: [
      enc("/for_designers/nemeckiy-fond/RED_0437_2_01.webp"),
      enc("/for_designers/nemeckiy-fond/RED_0467_1_01.webp"),
      enc("/for_designers/nemeckiy-fond/RED_0479_01.webp"),
      enc("/for_designers/nemeckiy-fond/RED_0521_01.webp"),
      enc("/for_designers/nemeckiy-fond/RED_0644_2.webp"),
      enc("/for_designers/nemeckiy-fond/RED_0671_01.webp"),
      enc("/for_designers/nemeckiy-fond/RED_0958_01.webp"),
      enc("/for_designers/nemeckiy-fond/RED_0973_01.webp"),
    ],
  },
  {
    title: "Тихая роскошь",
    cover: enc("/for_designers/tihaya-roskosh/002f9e6b-c6f5-4326-93d5-b3f80b0959da.webp"),
    images: [
      enc("/for_designers/tihaya-roskosh/002f9e6b-c6f5-4326-93d5-b3f80b0959da.webp"),
      enc("/for_designers/tihaya-roskosh/730c9e63-1901-4cb9-857b-87778cc05ed3.webp"),
      enc("/for_designers/tihaya-roskosh/2776e08a-d7b8-46bf-a631-9543e4d1245c.webp"),
      enc("/for_designers/tihaya-roskosh/339f3802-8a1c-46da-b454-b27337dea6f5.webp"),
      enc("/for_designers/tihaya-roskosh/42ef1b33-15d3-4342-811a-88e0db258022.webp"),
      enc("/for_designers/tihaya-roskosh/29853c59-3648-4ab6-aff2-0bac3a204eca.webp"),
      enc("/for_designers/tihaya-roskosh/735cbb9d-663b-461c-bc28-d90c691e0ab8.webp"),
      enc("/for_designers/tihaya-roskosh/891c27ad-557b-4a95-ae45-26a329b6e1d2.webp"),
      enc("/for_designers/tihaya-roskosh/e6d5b49c-e1b5-41a8-acb6-fc71337a29e8.webp"),
      enc("/for_designers/tihaya-roskosh/fad65c85-32b2-4861-b41c-664bb564caf1.webp"),
    ],
  },
  {
    title: "Сокольники",
    cover: enc("/for_designers/sokolniky/FullSizeRender (2).webp"),
    images: [
      enc("/for_designers/sokolniky/FullSizeRender (2).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (3).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (4).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (6).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (9).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (12).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (17).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (20).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (22).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (23).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (27).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (32).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (34).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (38).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (39).webp"),
      enc("/for_designers/sokolniky/FullSizeRender (40).webp"),
    ],
  },
  {
    title: "Гармония",
    cover: enc("/for_designers/garmoniya/25JulY_LazarevaInt2-min.webp"),
    images: [
      enc("/for_designers/garmoniya/25JulY_LazarevaInt2-min.webp"),
      enc("/for_designers/garmoniya/25JulY_LazarevaInt6-min.webp"),
      enc("/for_designers/garmoniya/25JulY_LazarevaInt3-min.webp"),
      enc("/for_designers/garmoniya/25JulY_LazarevaInt4-min.webp"),
      enc("/for_designers/garmoniya/25JulY_LazarevaInt5-min.webp"),
      enc("/for_designers/garmoniya/{AC6044AC-BC50-787C-3638-E7CE8A166BEE}.webp"),
    ],
  },
];

function ProjectModal({
  project,
  onClose,
}: {
  project: PortfolioItem;
  onClose: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(wrapRef, onClose);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const images = useMemo(() => {
    const arr = [project?.cover, ...(project?.images || [])].filter(Boolean);
    return Array.from(new Set(arr)).slice(0, 30);
  }, [project]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    setThumbStart(0);
  }, [project]);

  const image = images[activeIdx] || images[0] || project?.cover || "/hero.webp";
  const thumbsVisibleCount = 5;
  const canThumbUp = thumbStart > 0;
  const canThumbDown = thumbStart + thumbsVisibleCount < images.length;
  const visibleThumbs = images.slice(thumbStart, thumbStart + thumbsVisibleCount);

  function setActiveFromVisible(visibleIndex: number) {
    const idx = thumbStart + visibleIndex;
    if (idx >= 0 && idx < images.length) setActiveIdx(idx);
  }

  const canPrevImage = activeIdx > 0;
  const canNextImage = activeIdx + 1 < images.length;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && canPrevImage) setActiveIdx((v) => Math.max(0, v - 1));
      if (e.key === "ArrowRight" && canNextImage) setActiveIdx((v) => Math.min(images.length - 1, v + 1));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canNextImage, canPrevImage, images.length, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted || !project) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div
        ref={wrapRef}
        className="w-full max-w-6xl max-h-[calc(100vh-2rem)] overflow-y-auto overscroll-contain rounded-3xl border border-black/10 bg-white/80 p-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-black/55"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ПРОЕКТ</div>
            <div className="truncate text-xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-2xl">{project.title}</div>
            <div className="mt-1 text-xs font-medium tracking-[0.22em] text-[color:var(--muted)]">
              {images.length ? `${activeIdx + 1} / ${images.length}` : ""}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="my-4 h-px w-full bg-black/10 dark:bg-white/10" />

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="relative lg:col-span-8">
            <div className="grid gap-3 sm:grid-cols-[104px,1fr]">
              <div className="hidden sm:block">
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => setThumbStart((v) => Math.max(0, v - 1))}
                    disabled={!canThumbUp}
                    aria-label="Вверх"
                    className={
                      canThumbUp
                        ? "inline-flex h-9 w-full items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                        : "inline-flex h-9 w-full items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] text-sm font-semibold text-[color:var(--muted)] opacity-60 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                    }
                  >
                    ↑
                  </button>

                  <div className="grid gap-2">
                    {(visibleThumbs.length ? visibleThumbs : [image]).map((src, idx) => {
                      const realIdx = thumbStart + idx;
                      const isActive = realIdx === activeIdx;
                      return (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setActiveFromVisible(idx)}
                          className={`relative aspect-[4/3] overflow-hidden rounded-xl transition ${
                            isActive ? "ring-2 ring-[color:var(--accent)]" : "opacity-60 hover:opacity-90"
                          }`}
                        >
                          <Image src={src} alt="" fill sizes="104px" className="object-cover" unoptimized />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setThumbStart((v) => Math.min(images.length - thumbsVisibleCount, v + 1))}
                    disabled={!canThumbDown}
                    aria-label="Вниз"
                    className={
                      canThumbDown
                        ? "inline-flex h-9 w-full items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                        : "inline-flex h-9 w-full items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] text-sm font-semibold text-[color:var(--muted)] opacity-60 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                    }
                  >
                    ↓
                  </button>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                <Image
                  key={image}
                  src={image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-2">
              {images.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-xl transition ${
                    idx === activeIdx ? "ring-2 ring-[color:var(--accent)]" : "opacity-60 hover:opacity-90"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="200px" className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function PortfolioSlider() {
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  usePreloadPortfolioImages();

  const next = () => setCurrent((c) => (c + 1) % PORTFOLIO_ITEMS.length);
  const prev = () => setCurrent((c) => (c - 1 + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (modalOpen || isPaused) return;
    intervalRef.current = setInterval(next, 10000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [modalOpen, isPaused]);

  const item = PORTFOLIO_ITEMS[current];

  return (
    <>
      <section className="relative bg-[color:var(--bg)] pt-14 sm:pt-18">
        <Container>
          <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
            ПОРТФОЛИО
          </div>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
            Реализованные проекты
          </h2>
        </Container>

        <div 
          className="mt-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[21/9]">
            <Image
              key={item.cover}
              src={item.cover}
              alt={item.title}
              fill
              sizes="100vw"
              priority
              loading="eager"
              fetchPriority="high"
              className="object-cover transition-opacity duration-500"
              unoptimized
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.3)_40%,transparent_70%)]" />
            
            <div className="absolute left-0 top-0 bottom-0 w-full max-w-xl p-6 sm:p-10 lg:p-14">
              <div className="flex h-full flex-col justify-center">
                <div className="text-xs font-semibold tracking-[0.32em] text-white/50">
                  {item.images.length} ФОТО
                </div>
                <h3 className="mt-4 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                  {item.title}
                </h3>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                      }
                      setModalOpen(true);
                    }}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Смотреть проект
                  </button>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
              {PORTFOLIO_ITEMS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-3 w-3 rounded-full border transition ${
                    idx === current 
                      ? "border-white bg-white" 
                      : "border-white/50 bg-transparent hover:bg-white/30"
                  }`}
                  aria-label={`Проект ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <ProjectModal project={item} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
