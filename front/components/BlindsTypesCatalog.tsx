"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import { LeadRequestModal } from "@/components/LeadRequestModal";
import { IconTelegram } from "@/components/icons";

export type BlindsTypeItem = {
  source?: string;
  kind?: string;
  url: string;
  title?: string;
  description?: string;
  image?: string;
  images?: string[];
};

function isVideoSrc(src: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
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

export function BlindsTypeModal({ item, onClose }: { item: BlindsTypeItem; onClose: () => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(wrapRef, onClose);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const images = useMemo(() => {
    const arr = [...(item.images || [])].filter(Boolean);
    if (item.image) arr.unshift(item.image);
    const uniq = Array.from(new Set(arr));
    return (uniq.length ? uniq : ["/catalog/blinds.jpg"]).slice(0, 12);
  }, [item.image, item.images]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    setThumbStart(0);
  }, [item.url]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const activeImage = images[activeIdx] || images[0] || "/catalog/blinds.jpg";
  const activeIsVideo = isVideoSrc(activeImage);
  const [leadOpen, setLeadOpen] = useState(false);

  const thumbsVisibleCount = 4;
  const canThumbUp = thumbStart > 0;
  const canThumbDown = thumbStart + thumbsVisibleCount < images.length;
  const visibleThumbs = images.slice(thumbStart, thumbStart + thumbsVisibleCount);

  const mobileThumbsVisibleCount = 3;
  const mobileThumbStart = Math.max(
    0,
    Math.min(activeIdx - Math.floor(mobileThumbsVisibleCount / 2), Math.max(0, images.length - mobileThumbsVisibleCount))
  );
  const mobileVisibleThumbs = images.slice(mobileThumbStart, mobileThumbStart + mobileThumbsVisibleCount);

  const canPrev = activeIdx > 0;
  const canNext = activeIdx < images.length - 1;

  function goPrev() {
    if (!canPrev) return;
    setActiveIdx((v) => Math.max(0, v - 1));
  }

  function goNext() {
    if (!canNext) return;
    setActiveIdx((v) => Math.min(images.length - 1, v + 1));
  }

  function setActiveFromVisible(visibleIndex: number) {
    const idx = thumbStart + visibleIndex;
    if (idx >= 0 && idx < images.length) setActiveIdx(idx);
  }

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
          <h2 className="text-xl font-semibold sm:text-2xl">{item.title || "Жалюзи"}</h2>
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
                    {visibleThumbs.map((src, idx) => {
                      const realIdx = thumbStart + idx;
                      const isActive = realIdx === activeIdx;
                      const isVideo = isVideoSrc(src);
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
                            {isVideo ? (
                              <video
                                className="h-full w-full object-cover pointer-events-none"
                                src={src}
                                muted
                                playsInline
                                preload="metadata"
                              />
                            ) : (
                              <img alt="" src={src} className="h-full w-full object-cover" />
                            )}

                            {isVideo ? (
                              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                                <div className="grid h-8 w-8 place-items-center rounded-full bg-black/55 shadow-sm">
                                  <span className="text-sm leading-none text-white">▶</span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setThumbStart((v) => Math.min(Math.max(0, images.length - thumbsVisibleCount), v + 1))
                    }
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
                  {activeIsVideo ? (
                    <video
                      className="h-full w-full object-cover"
                      src={activeImage}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img alt={item.title || ""} className="h-full w-full object-cover" src={activeImage} />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.12),rgba(0,0,0,0.28))]" />

                  {images.length > 1 ? (
                    <div className="absolute inset-0 flex items-center justify-between px-2 sm:hidden">
                      <button
                        type="button"
                        onClick={goPrev}
                        disabled={!canPrev}
                        aria-label="Предыдущее фото"
                        className={
                          canPrev
                            ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/95 dark:border-white/10 dark:bg-black/50 dark:hover:bg-black/70"
                            : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/50 text-[color:var(--muted)] opacity-60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/35"
                        }
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!canNext}
                        aria-label="Следующее фото"
                        className={
                          canNext
                            ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/95 dark:border-white/10 dark:bg-black/50 dark:hover:bg-black/70"
                            : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/50 text-[color:var(--muted)] opacity-60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/35"
                        }
                      >
                        →
                      </button>
                    </div>
                  ) : null}
                </div>

                {images.length > 1 ? (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:hidden">
                    {mobileVisibleThumbs.map((src, idx) => {
                      const realIdx = mobileThumbStart + idx;
                      const isActive = realIdx === activeIdx;
                      const isVideo = isVideoSrc(src);
                      return (
                        <button
                          key={`${src}-${realIdx}`}
                          type="button"
                          onClick={() => setActiveIdx(realIdx)}
                          aria-label={`Фото ${realIdx + 1}`}
                          className={
                            isActive
                              ? "overflow-hidden rounded-2xl border border-black/20 bg-white/70 shadow-sm dark:border-white/20 dark:bg-white/10"
                              : "overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                          }
                        >
                          <div className="relative aspect-square">
                            {isVideo ? (
                              <video
                                className="h-full w-full object-cover pointer-events-none"
                                src={src}
                                muted
                                playsInline
                                preload="metadata"
                              />
                            ) : (
                              <img alt="" src={src} className="h-full w-full object-cover" />
                            )}

                            {isVideo ? (
                              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                                <div className="grid h-8 w-8 place-items-center rounded-full bg-black/55 shadow-sm">
                                  <span className="text-sm leading-none text-white">▶</span>
                                </div>
                              </div>
                            ) : null}
                          </div>
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
              <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ЗАЧЕМ</div>
              <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {item.description ||
                  "Подбираем жалюзи под свет и приватность. Подскажем ламели, механику и монтаж под ваше окно."}
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
                      productType: "blinds_type",
                      source: item.source,
                      kind: item.kind,
                      url: item.url,
                      title: item.title,
                      category: item.kind,
                      image: activeImage,
                      images,
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
    document.body
  );
}

export function BlindsTypesCatalog({
  items,
  showDescriptions = true,
}: {
  items: BlindsTypeItem[];
  showDescriptions?: boolean;
}) {
  const cleaned = useMemo(() => {
    return (items || [])
      .filter((i) => i && i.url)
      .map((i) => ({
        ...i,
        title: String(i.title || "").trim(),
        description: String(i.description || "").trim(),
      }))
      .filter((i) => i.title || i.image || (i.images && i.images.length));
  }, [items]);

  const [active, setActive] = useState<BlindsTypeItem | null>(null);

  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cleaned.map((it) => {
          const img = it.image || it.images?.[0] || "/catalog/blinds.jpg";
          return (
            <button
              key={it.url}
              type="button"
              onClick={() => setActive(it)}
              className="group text-left overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  alt={it.title || ""}
                  src={img}
                  className="h-full w-full object-cover transition-[transform,filter] duration-300 ease-in-out group-hover:scale-[1.05] group-hover:saturate-[1.06]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.14),rgba(0,0,0,0.50))]" />
              </div>
              <div className="p-6">
                <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">
                  {it.title || "Тип жалюзи"}
                </div>
                {showDescriptions && it.description ? (
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)] line-clamp-3">{it.description}</div>
                ) : null}
                <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                  Смотреть фото →
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {active ? <BlindsTypeModal item={active} onClose={() => setActive(null)} /> : null}
    </div>
  );
}
