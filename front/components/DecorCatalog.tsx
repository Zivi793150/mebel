"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ContactButton } from "@/components/ContactButton";

export type DecorItem = {
  source?: string;
  kind?: string;
  category?: string;
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

function DecorViewer({ item }: { item: DecorItem }) {
  const images = useMemo(() => {
    const arr = [...(item.images || [])].filter(Boolean);
    if (item.image) arr.unshift(item.image);
    return Array.from(new Set(arr)).slice(0, 12);
  }, [item.image, item.images]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    setThumbStart(0);
  }, [item.title, item.image]);

  const activeImage = images[activeIdx] || images[0] || "/2foto_dark.webp";
  const activeIsVideo = isVideoSrc(activeImage);

  const thumbsVisibleCount = 4;
  const canThumbUp = thumbStart > 0;
  const canThumbDown = thumbStart + thumbsVisibleCount < images.length;
  const visibleThumbs = images.slice(thumbStart, thumbStart + thumbsVisibleCount);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="relative lg:col-span-7">
        <div className="grid gap-3 sm:grid-cols-[92px,1fr]">
          <div className="hidden sm:block">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => canThumbUp && setThumbStart((s) => Math.max(0, s - 1))}
                className={"inline-flex h-9 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] text-sm transition " + (canThumbUp ? "opacity-100" : "opacity-30")}
                disabled={!canThumbUp}
              >
                ↑
              </button>
              <div className="grid gap-2">
                {visibleThumbs.map((src, i) => {
                  const idx = thumbStart + i;
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      type="button"
                      key={`${src}-${idx}`}
                      onClick={() => setActiveIdx(idx)}
                      className={"relative aspect-square overflow-hidden border transition " + (isActive ? "border-[color:var(--fg)]" : "border-[color:var(--gray-lines)] hover:bg-[color:var(--bg)]")}
                    >
                      {isVideoSrc(src) ? (
                        <video className="h-full w-full object-contain bg-black/5" src={src} muted playsInline preload="metadata" />
                      ) : (
                        <img alt="" src={src} className="h-full w-full object-contain bg-black/5" />
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => canThumbDown && setThumbStart((s) => Math.min(images.length - thumbsVisibleCount, s + 1))}
                className={"inline-flex h-9 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] text-sm transition " + (canThumbDown ? "opacity-100" : "opacity-30")}
                disabled={!canThumbDown}
              >
                ↓
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden border border-[color:var(--gray-lines)]">
            <div className="relative aspect-square overflow-hidden">
              <img alt="" src={activeImage} className="absolute inset-0 h-full w-full object-cover blur-md saturate-[0.3] opacity-55 scale-105" aria-hidden="true" />
              {activeIsVideo ? (
                <video className="relative h-full w-full object-cover bg-black/5" src={activeImage} controls playsInline />
              ) : (
                <img alt={item.title} src={activeImage} className="relative h-full w-full object-cover bg-black/5" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="border border-[color:var(--gray-lines)] bg-[color:var(--bg)] p-5">
          <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)] uppercase">ПОДРОБНЕЕ</div>
          <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
            {item.description || "Премиальная фурнитура для ваших штор. Подберём идеальное сочетание под стиль интерьера."}
          </div>
          <div className="mt-5">
            <ContactButton className="w-full bg-[color:var(--green)] text-white h-11" imageSrc="/foto-na-knopku-1-.webp">
              Связаться
            </ContactButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DecorModal({ item, onClose }: { item: DecorItem; onClose: () => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(wrapRef, onClose);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div ref={wrapRef} className="w-full max-w-5xl bg-white p-6 shadow-2xl dark:bg-black overflow-y-auto max-h-[90vh] rounded-none">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="h-9 w-9 flex items-center justify-center border border-black/10 hover:bg-black/5 transition rounded-none">←</button>
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <button onClick={onClose} className="h-9 w-9 flex items-center justify-center border border-black/10 hover:bg-black/5 transition rounded-none">✕</button>
        </div>
        <div className="h-px w-full bg-black/10 mb-6" />
        <DecorViewer item={item} />
      </div>
    </div>,
    document.body
  );
}

export function DecorCatalog({ items }: { items: DecorItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<DecorItem | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
    return cats.map(c => ({
      title: c as string,
      image: items.find(i => i.category === c)?.image || "/2foto_dark.webp"
    }));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!activeCategory) return items;
    return items.filter(i => i.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <div className="rounded-none border border-black/10 p-8 dark:border-white/10">
      {activeCategory && (
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setActiveCategory(null)}
            className="inline-flex h-11 items-center justify-center border border-black/10 bg-white/70 px-5 text-sm font-semibold transition hover:bg-white/90"
          >
            ← Назад к видам
          </button>
          <h3 className="text-2xl font-semibold tracking-tight">{activeCategory}</h3>
        </div>
      )}

      {!activeCategory ? (
        <div className="grid gap-6 grid-cols-2 max-w-2xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(cat.title)}
              className="group text-left border border-black/10 bg-white/60 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5 rounded-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={cat.image || "/2foto_dark.webp"} alt={cat.title} fill className="object-cover bg-black/5 transition duration-300 group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.50))]" />
              </div>
              <div className="p-6">
                <div className="text-lg font-semibold tracking-tight">{cat.title}</div>
                <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] uppercase group-hover:text-[color:var(--fg)]">
                  Смотреть варианты →
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto">
          {filteredItems.map((it, idx) => (
            <button
              key={idx}
              onClick={() => setActiveItem(it)}
              className="group border border-black/10 bg-white/70 text-left shadow-sm transition hover:bg-white/90 dark:bg-white/5 rounded-none"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image src={it.image || "/2foto_dark.webp"} alt={it.title || ""} fill className="object-cover bg-black/5 transition duration-300 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.50))]" />
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold tracking-tight">{it.title}</div>
                <div className="mt-2 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] uppercase">Открыть →</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeItem && (
        <DecorModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </div>
  );
}
