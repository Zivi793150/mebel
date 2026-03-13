"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import { LeadRequestModal } from "@/components/LeadRequestModal";
import { IconTelegram } from "@/components/icons";

type BeddingCard = {
  imageSrc: string;
  images?: string[];
  description?: string;
};

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

function BeddingModal({
  card,
  onClose,
  contextBase,
  productType,
}: {
  card: BeddingCard;
  onClose: () => void;
  contextBase: {
    source?: string;
    kind?: string;
    url?: string;
    category?: string;
    title?: string;
  };
  productType: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(wrapRef, onClose);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const [leadOpen, setLeadOpen] = useState(false);

  const allImages = useMemo(() => {
    const main = card.imageSrc;
    const extras = card.images || [];
    return [main, ...extras.filter((img) => img !== main)];
  }, [card]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  const thumbsVisibleCount = 4;
  const canThumbUp = thumbStart > 0;
  const canThumbDown = thumbStart + thumbsVisibleCount < allImages.length;
  const visibleThumbs = allImages.slice(thumbStart, thumbStart + thumbsVisibleCount);

  function setActiveFromVisible(visibleIndex: number) {
    const idx = thumbStart + visibleIndex;
    if (idx >= 0 && idx < allImages.length) setActiveIdx(idx);
  }

  const image = allImages[activeIdx] || allImages[0] || "/catalog/bed.jpg";

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div
        ref={wrapRef}
        className="w-full max-w-5xl rounded-3xl border border-black/10 bg-white/80 p-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-black/55"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            ←
          </button>
          <div className="text-xl font-semibold sm:text-2xl">Галерея</div>
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
          <div className="relative lg:col-span-7">
            <div className="grid gap-3 sm:grid-cols-[92px,1fr]">
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
                          key={`${src}-${realIdx}`}
                          type="button"
                          onClick={() => setActiveFromVisible(idx)}
                          aria-label={`Фото ${realIdx + 1}`}
                          className={
                            isActive
                              ? "overflow-hidden rounded-2xl border border-black/20 bg-white/70 shadow-sm dark:border-white/20 dark:bg-white/10"
                              : "overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                          }
                        >
                          <div className="relative aspect-square">
                            <img alt="" src={src} className="h-full w-full object-cover" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setThumbStart((v) => Math.min(Math.max(0, allImages.length - thumbsVisibleCount), v + 1))}
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

              <div className="relative">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-black/[0.03] dark:bg-white/[0.04]">
                  <img alt="" className="h-full w-full object-cover" src={image} />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.12),rgba(0,0,0,0.28))]" />
                </div>

                {allImages.length > 1 ? (
                  <div className="mt-3 flex gap-2 overflow-x-auto sm:hidden">
                    {allImages.map((src, idx) => {
                      const isActive = idx === activeIdx;
                      return (
                        <button
                          key={`${src}-${idx}`}
                          type="button"
                          onClick={() => setActiveIdx(idx)}
                          aria-label={`Фото ${idx + 1}`}
                          className={
                            isActive
                              ? "h-16 w-16 flex-none overflow-hidden rounded-2xl border border-black/20 bg-white/70 shadow-sm dark:border-white/20 dark:bg-white/10"
                              : "h-16 w-16 flex-none overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                          }
                        >
                          <img alt="" src={src} className="h-full w-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ИНФОРМАЦИЯ</div>
              <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {card.description
                  ? card.description
                  : "Нажмите на миниатюру слева, чтобы переключиться между фотографиями. Используйте стрелки для прокрутки списка."}
              </div>

              <div className="mt-5 grid gap-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setLeadOpen(true)}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:opacity-95 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <IconTelegram className="h-5 w-5" />
                      Написать нам
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                  >
                    Закрыть
                  </button>
                </div>

                {leadOpen ? (
                  <LeadRequestModal
                    context={{
                      productType,
                      source: contextBase.source,
                      kind: contextBase.kind,
                      url: contextBase.url,
                      title: contextBase.title,
                      category: contextBase.category,
                      image: image,
                      images: allImages,
                    }}
                    onClose={() => setLeadOpen(false)}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function BeddingCatalog({
  cards,
  contextBase,
  intro,
  productType = "bedding_variant",
}: {
  cards: BeddingCard[];
  contextBase: {
    source?: string;
    kind?: string;
    url?: string;
    category?: string;
    title?: string;
  };
  intro?: string;
  productType?: string;
}) {
  const cleaned = useMemo(() => {
    return (cards || []).filter((c) => c && c.imageSrc);
  }, [cards]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      {intro ? (
        <div className="mx-auto mt-6 max-w-4xl text-center text-lg leading-8 text-[color:var(--muted)] sm:text-xl">
          {String(intro)
            .split("\n")
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, idx) => (
              <p key={idx} className={idx === 0 ? "" : "mt-5"}>
                {p}
              </p>
            ))}
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cleaned.map((c, idx) => (
          <button
            key={c.imageSrc + idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="block text-left"
            aria-label={`Вариант ${idx + 1}`}
          >
            <div className="group h-full overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-px hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={c.imageSrc}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-[transform,filter] duration-300 ease-in-out group-hover:scale-[1.05] group-hover:saturate-[1.08]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.14),rgba(0,0,0,0.50))]" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">Вариант {idx + 1}</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] transition-colors duration-300 group-hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:group-hover:bg-white/[0.10]">
                    <span
                      aria-hidden="true"
                      className="text-[color:var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">Подробнее</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && cleaned[activeIndex] ? (
        <BeddingModal
          card={cleaned[activeIndex]}
          onClose={() => setActiveIndex(null)}
          contextBase={contextBase}
          productType={productType}
        />
      ) : null}
    </>
  );
}
