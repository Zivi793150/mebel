"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import { ContactModal } from "@/components/ContactModal";
import { IconTelegram } from "@/components/icons";

type RailVariantCard = {
  title: string;
  imageSrc: string;
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

function RailsVariantModal({
  cards,
  activeIndex,
  onChangeIndex,
  onClose,
  contextBase,
}: {
  cards: RailVariantCard[];
  activeIndex: number;
  onChangeIndex: (i: number) => void;
  onClose: () => void;
  contextBase: {
    source?: string;
    kind?: string;
    url?: string;
    category?: string;
    title?: string;
  };
}) {
  const images = useMemo(() => cards.map((c) => c.imageSrc).filter(Boolean), [cards]);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(wrapRef, onClose);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onChangeIndex(Math.max(0, activeIndex - 1));
      if (e.key === "ArrowRight") onChangeIndex(Math.min(cards.length - 1, activeIndex + 1));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, cards.length, onChangeIndex, onClose]);

  const currentCard = cards[Math.min(Math.max(0, activeIndex), cards.length - 1)];
  const currentImage = currentCard?.imageSrc || images[0] || "/catalog/4.\u041a\u0430\u0440\u043d\u0438\u0437\u044b/\u0411\u0430\u0433\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u043d\u0438\u0437\u044b/1.webp";

  const [leadOpen, setLeadOpen] = useState(false);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4">
      <div
        ref={wrapRef}
        className="w-full max-w-5xl border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-6"
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
          <h2 className="text-xl font-semibold sm:text-2xl">{currentCard?.title || "Карнизы"}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] transition hover:bg-[color:var(--card)]"
          >
            ✕
          </button>
        </div>

        <div className="my-4 h-px w-full bg-black/10 dark:bg-white/10" />

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/90">
              <img alt={currentCard?.title || ""} className="h-full w-full object-contain p-4" src={currentImage} />
            </div>

            {cards.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {cards.map((c, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={c.imageSrc + idx}
                      type="button"
                      onClick={() => onChangeIndex(idx)}
                      aria-label={c.title}
                      className={
                        isActive
                          ? "h-16 w-16 flex-none overflow-hidden border border-black/20 bg-white/70 shadow-sm dark:border-white/20 dark:bg-white/10"
                          : "h-16 w-16 flex-none overflow-hidden border border-black/10 bg-white/60 shadow-sm transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                      }
                    >
                      <img alt="" src={c.imageSrc} className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-5">
            <div className="border border-[color:var(--gray-lines)] bg-[color:var(--bg)] p-5">
              <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ЗАЧЕМ</div>
              <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {currentCard?.description || "Подберём карниз под ваш интерьер, высоту установки и вес ткани. Подскажем крепёж и рассчитаем комплект."}
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
                    className="inline-flex h-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 text-sm font-semibold text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                  >
                    Закрыть
                  </button>
                </div>

                {leadOpen ? (
                  <ContactModal
                    onClose={() => setLeadOpen(false)}
                    imageSrc="/foto-na-knopku-1-.webp"
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

export function RailsVariantsCatalog({
  cards,
  contextBase,
}: {
  cards: RailVariantCard[];
  contextBase: {
    source?: string;
    kind?: string;
    url?: string;
    category?: string;
    title?: string;
  };
}) {
  const cleaned = useMemo(() => {
    return (cards || []).filter((c) => c && c.imageSrc);
  }, [cards]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cleaned.map((c, idx) => (
          <button
            key={c.title + idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="block text-left"
            aria-label={c.title}
          >
            <div className="group h-full overflow-hidden border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-px hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
              <div className="relative aspect-[4/3] overflow-hidden bg-white/80">
                <Image
                  src={c.imageSrc}
                  alt={c.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-4 transition-[transform,filter] duration-300 ease-in-out group-hover:scale-[1.02]"
                  loading="eager"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">{c.title}</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] transition-colors duration-300 group-hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:group-hover:bg-white/[0.10]">
                    <span
                      aria-hidden="true"
                      className="text-[color:var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{c.description || "Подробнее"}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <RailsVariantModal
          cards={cleaned}
          activeIndex={activeIndex}
          onChangeIndex={setActiveIndex}
          onClose={() => setActiveIndex(null)}
          contextBase={contextBase}
        />
      ) : null}
    </>
  );
}
