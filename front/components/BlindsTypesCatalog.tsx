"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import { ContactModal } from "@/components/ContactModal";
import { IconTelegram } from "@/components/icons";
import { normalizeClientImageUrl } from "@/lib/clientUtils";

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
    const arr = [...(item.images || [])].filter(Boolean).map(normalizeClientImageUrl);
    if (item.image) arr.unshift(normalizeClientImageUrl(item.image));
    const uniq = Array.from(new Set(arr));
    return (uniq.length ? uniq : ["/catalog/2.zhalyuzi/allyuminievye/foto-na-ikonku-1-.webp"]).slice(0, 12);
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

  const activeImage = images[activeIdx] || images[0] || "/catalog/2.zhalyuzi/allyuminievye/foto-na-ikonku-1-.webp";
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4">
      <div
        ref={wrapRef}
        className="w-full max-w-5xl border border-[color:var(--gray-lines)] bg-white p-6 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] transition hover:bg-[color:var(--card)]"
          >
            ←
          </button>
          <h2 className="text-xl font-medium sm:text-2xl">{item.title || "Жалюзи"}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] transition hover:bg-[color:var(--card)]"
          >
            ✕
          </button>
        </div>

        <div className="my-4 h-px w-full bg-[color:var(--gray-lines)]" />

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
                        ? "inline-flex h-9 w-full items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--card)]"
                        : "inline-flex h-9 w-full items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-sm font-medium text-[color:var(--muted)] opacity-50"
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
                              ? "overflow-hidden border border-[color:var(--fg)] bg-[color:var(--card)]"
                              : "overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)] transition hover:bg-[color:var(--bg)]"
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
                    onClick={() => setThumbStart((v) => Math.min(Math.max(0, images.length - thumbsVisibleCount), v + 1))}
                    disabled={!canThumbDown}
                    aria-label="Вниз"
                    className={
                      canThumbDown
                        ? "inline-flex h-9 w-full items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--card)]"
                        : "inline-flex h-9 w-full items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-sm font-medium text-[color:var(--muted)] opacity-50"
                    }
                  >
                    ↓
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-[color:var(--gray-lines)]">
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
            <div className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-800/80">
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
                    className="inline-flex h-11 items-center justify-center bg-[color:var(--green)] px-4 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Связаться
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-11 items-center justify-center border border-black/10 bg-white/70 px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Закрыть
                  </button>
                </div>

                {leadOpen ? (
                  <ContactModal
                    onClose={() => setLeadOpen(false)}
                    imageSrc="/catalog/2.zhalyuzi/derevyannye/zhalyuzi-derevyan-1.webp"
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cleaned.map((it) => {
        const rawImg = normalizeClientImageUrl(it.image || it.images?.[0] || "/catalog/2.zhalyuzi/allyuminievye/foto-na-ikonku-1-.webp");
        const img = encodeURI(rawImg);
        return (
          <button
            key={it.url}
            type="button"
            onClick={() => setActive(it)}
            className="group text-left overflow-hidden border border-black/10 bg-white/60 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                alt={it.title || ""}
                src={img}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_70%)]" />
            </div>
            <div className="p-5">
              <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">
                {it.title || "Тип жалюзи"}
              </div>
              {showDescriptions && it.description ? (
                <div className="mt-2 text-sm leading-6 text-[color:var(--muted)] line-clamp-2">{it.description}</div>
              ) : null}
            </div>
          </button>
        );
      })}

      {active ? <BlindsTypeModal item={active} onClose={() => setActive(null)} /> : null}
    </div>
  );
}
