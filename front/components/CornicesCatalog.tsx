"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import { ContactButton } from "@/components/ContactButton";
import { IconTelegram } from "@/components/icons";
import { CONTACTS } from "@/lib/constants";

export type CorniceItem = {
  source?: string;
  kind?: string;
  url?: string;
  title?: string;
  description?: string;
  manufacturer?: string;
  type?: string;
  subtype?: string;
  subtypeTitle?: string;
  collectionSlug?: string;
  collectionTitle?: string;
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
  isDisabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  isDisabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(boxRef, () => setOpen(false));

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const selectedLabel = useMemo(() => {
    const m = options.find((o) => o.value === value);
    return m?.label || "Все";
  }, [options, value]);

  return (
    <div ref={boxRef} className="relative">
      <div className="text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)]">{label}</div>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setOpen((v) => !v)}
        className={
          "mt-2 flex h-11 w-full items-center justify-between border px-3 text-left text-sm outline-none transition " +
          (isDisabled
            ? "cursor-not-allowed border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--muted)]/50"
            : "border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] hover:bg-[color:var(--bg)] focus:ring-1 focus:ring-[color:var(--accent)]")
        }
      >
        <span className="truncate pr-3">{selectedLabel}</span>
        <span aria-hidden="true" className={"text-[color:var(--muted)] transition " + (open ? "rotate-180" : "")}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)] shadow-lg">
          <div className="max-h-72 overflow-auto p-1">
            {options.map((o) => {
              const active = o.value === value;
              const disabled = Boolean(o.disabled);
              return (
                <button
                  key={o.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition " +
                    (disabled
                      ? "cursor-not-allowed text-[color:var(--muted)]/40"
                      : active
                        ? "bg-[color:var(--accent)]/12 text-[color:var(--fg)]"
                        : "text-[color:var(--fg)] hover:bg-[color:var(--bg)]")
                  }
                >
                  <span className="truncate">{o.label}</span>
                  {active ? <span className="text-[color:var(--muted)]">✓</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function buildTitle(item: CorniceItem): string {
  const t = String(item.title || "").trim();
  if (t) return t;
  const m = String(item.manufacturer || "").trim();
  const k = String(item.type || "").trim();
  return [m, k].filter(Boolean).join(" — ") || "Карниз";
}

function normalizeLabel(v: unknown): string {
  return String(v || "").trim();
}

const CORNICE_TYPE_ORDER = ["потолочные", "багетные", "металлические", "профильные", "латунные"];

type CorniceCollection = {
  source?: string;
  kind: "cornice_collection";
  type?: string;
  collectionSlug: string;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  images?: string[];
};

type CorniceLeafItem = {
  source?: string;
  kind: "cornice_item";
  type?: string;
  collectionSlug: string;
  collectionTitle?: string;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  images?: string[];
};

function isCollection(doc: CorniceItem): doc is CorniceCollection {
  return String(doc.kind || "") === "cornice_collection" && Boolean(doc.collectionSlug);
}

function isLeafItem(doc: CorniceItem): doc is CorniceLeafItem {
  return String(doc.kind || "") === "cornice_item" && Boolean(doc.collectionSlug);
}

function isElectroType(value: string): boolean {
  return String(value || "").trim().toLowerCase() === "электро";
}

function CorniceViewer({ item, collections }: { item: CorniceItem; collections?: CorniceCollection[] }) {
  const images = useMemo(() => {
    const arr = [...(item.images || [])].filter(Boolean);
    if (item.image) arr.unshift(item.image);
    const uniq = Array.from(new Set(arr));
    return (uniq.length ? uniq : ["/catalog/4.\u041a\u0430\u0440\u043d\u0438\u0437\u044b/\u0411\u0430\u0433\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u043d\u0438\u0437\u044b/1.webp"]).slice(0, 12);
  }, [item.image, item.images]);

  const collectionDescription = useMemo(() => {
    if (!collections || !item.collectionSlug) return "";
    const coll = collections.find((c) => c.collectionSlug === item.collectionSlug);
    return coll?.description || "";
  }, [collections, item.collectionSlug]);

  const displayDescription = item.description || collectionDescription || "Подберём карниз под ваш интерьер, высоту установки и вес ткани. Подскажем крепёж и рассчитаем комплект.";

  const [activeIdx, setActiveIdx] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    setThumbStart(0);
  }, [item.url, item.image]);

  const activeImage = images[activeIdx] || images[0] || "/catalog/4.\u041a\u0430\u0440\u043d\u0438\u0437\u044b/\u0411\u0430\u0433\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u043d\u0438\u0437\u044b/1.webp";
  const activeIsVideo = isVideoSrc(activeImage);

  const thumbsVisibleCount = 4;
  const canThumbUp = thumbStart > 0;
  const canThumbDown = thumbStart + thumbsVisibleCount < images.length;
  const visibleThumbs = images.slice(thumbStart, thumbStart + thumbsVisibleCount);

  function setActiveFromVisible(visibleIndex: number) {
    const idx = thumbStart + visibleIndex;
    if (idx >= 0 && idx < images.length) setActiveIdx(idx);
  }

  const title = buildTitle(item);

  return (
    <div className="grid gap-4">
      <div className="relative">
        <div className="grid gap-3 sm:grid-cols-[92px,1fr]">
          <div className="hidden sm:block">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => canThumbUp && setThumbStart((s) => Math.max(0, s - thumbsVisibleCount))}
                className={
                  "inline-flex h-9 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--card)] " +
                  (canThumbUp ? "opacity-100" : "opacity-50")
                }
                aria-label="Prev thumbnails"
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
                      onClick={() => setActiveFromVisible(i)}
                      className={
                        "relative aspect-square overflow-hidden border transition " +
                        (isActive
                          ? "border-[color:var(--fg)]"
                          : "border-[color:var(--gray-lines)] hover:bg-[color:var(--bg)]")
                      }
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
                onClick={() => canThumbDown && setThumbStart((s) => Math.min(images.length - thumbsVisibleCount, s + thumbsVisibleCount))}
                className={
                  "inline-flex h-9 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--card)] " +
                  (canThumbDown ? "opacity-100" : "opacity-50")
                }
                aria-label="Next thumbnails"
                disabled={!canThumbDown}
              >
                ↓
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden border border-[color:var(--gray-lines)]">
            <div className="relative aspect-square overflow-hidden">
              <img
                alt=""
                src={activeImage}
                className="absolute inset-0 h-full w-full object-cover blur-md saturate-[0.3] opacity-55 scale-105"
                aria-hidden="true"
              />
              {activeIsVideo ? (
                <video className="relative h-full w-full object-contain bg-black/5" src={activeImage} controls playsInline />
              ) : (
                <img alt={title} src={activeImage} className="relative h-full w-full object-contain bg-black/5" />
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export function CornicesModal({ item, collections, onClose }: { item: CorniceItem; collections?: CorniceCollection[]; onClose: () => void }) {
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

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div
        ref={wrapRef}
        className="w-full max-w-5xl bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-black"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold sm:text-2xl">{buildTitle(item)}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="my-4 h-px w-full bg-black/10 dark:bg-white/10" />

        <CorniceViewer item={item} collections={collections} />
      </div>
    </div>,
    document.body,
  );
}

export function CorniceCollectionModal({
  collection,
  items,
  onClose,
}: {
  collection: CorniceCollection;
  items: CorniceLeafItem[];
  onClose: () => void;
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

  const derivedItems = useMemo(() => {
    return (items || [])
      .slice()
      .sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "ru"));
  }, [items]);

  const [activeItem, setActiveItem] = useState<CorniceLeafItem | null>(derivedItems[0] ?? null);
  useEffect(() => {
    setActiveItem(derivedItems[0] ?? null);
  }, [collection.collectionSlug, derivedItems]);

  const title = String(collection.title || "").trim() || collection.collectionSlug;
  const description = String(collection.description || "").trim();

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div
        ref={wrapRef}
        className="w-full max-w-6xl bg-white/80 p-6 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-black/55"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="my-4 h-px w-full bg-black/10 dark:bg-white/10" />

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {activeItem ? (
              <div className="border border-black/10 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <CorniceViewer item={activeItem} />
              </div>
            ) : (
              <div className="border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="text-sm leading-6 text-[color:var(--muted)]">
                  Выберите вариант карниза справа.
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {derivedItems.map((it, idx) => {
                    const img = it.image || it.images?.[0] || "/catalog/4.\u041a\u0430\u0440\u043d\u0438\u0437\u044b/\u0411\u0430\u0433\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u043d\u0438\u0437\u044b/1.webp";
                    const t = String(it.title || "").trim() || `Вариант ${idx + 1}`;
                    return (
                      <button
                        key={`${it.collectionSlug}-${t}-${idx}`}
                        type="button"
                        onClick={() => setActiveItem(it)}
                        className="group overflow-hidden border border-black/10 bg-white/70 text-left shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          {isVideoSrc(img) ? (
                            <video className="h-full w-full object-contain bg-black/5" src={img} muted playsInline preload="metadata" />
                          ) : (
                            <img alt={t} src={img} className="h-full w-full object-contain bg-black/5" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

const DEFAULT_CORNICE_IMAGE = "/catalog/4.karnizy/elektrokarnizy/8d5895d5a388b3482a148445333db28f-optimized.webp";

export function CornicesCatalog({ items }: { items: CorniceItem[] }) {
  const cleaned = useMemo<CorniceItem[]>(() => {
    return (items || [])
      .filter((i): i is CorniceItem => Boolean(i))
      .map((i) => ({
        ...i,
        title: normalizeLabel(i.title) || buildTitle(i),
        description: normalizeLabel(i.description),
        manufacturer: normalizeLabel(i.manufacturer),
        type: normalizeLabel(i.type),
        subtype: normalizeLabel(i.subtype),
        subtypeTitle: normalizeLabel(i.subtypeTitle),
        collectionSlug: normalizeLabel(i.collectionSlug),
        collectionTitle: normalizeLabel(i.collectionTitle),
        image: normalizeLabel(i.image) || DEFAULT_CORNICE_IMAGE,
        images: Array.isArray(i.images) && i.images.length ? i.images.map(normalizeLabel).filter(Boolean) : [DEFAULT_CORNICE_IMAGE],
        url: normalizeLabel(i.url),
        source: normalizeLabel(i.source),
        kind: normalizeLabel(i.kind),
      }));
  }, [items]);

  const collections = useMemo(() => {
    return cleaned.filter(isCollection);
  }, [cleaned]);

  const leafItems = useMemo(() => {
    return cleaned.filter(isLeafItem);
  }, [cleaned]);

  const types = useMemo(() => {
    const values = collections.map((i) => i.type).filter((v): v is string => Boolean(v));
    const set = new Set<string>(values);
    const byLower = new Map<string, string>();
    for (const v of set) byLower.set(v.toLowerCase(), v);

    const ordered = CORNICE_TYPE_ORDER.map((x) => byLower.get(x) || byLower.get(x.toLowerCase()))
      .filter(Boolean) as string[];
    const rest = Array.from(set)
      .filter((v) => !CORNICE_TYPE_ORDER.includes(v.toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "ru"));

    return ["ВСЕ", ...ordered, ...rest];
  }, [cleaned]);
  const [type, setType] = useState("ВСЕ");

  const filteredCollections = useMemo(() => {
    return collections
      .filter((i) => !isElectroType(i.type || ""))
      .filter((i) => (type === "ВСЕ" ? true : i.type === type))
      .slice()
      .sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "ru"));
  }, [collections, type]);

  const [activeCollection, setActiveCollection] = useState<CorniceCollection | null>(null);
  const [activeModalCollection, setActiveModalCollection] = useState<CorniceCollection | null>(null);
  const [viewMode, setViewMode] = useState<'types' | 'collections' | 'items'>('types');
  const [activeItems, setActiveItems] = useState<CorniceLeafItem[]>([]);
  const [activeItem, setActiveItem] = useState<CorniceLeafItem | null>(null);

  const typeCards = useMemo(() => {
    const realTypes = types.filter((t) => t !== "ВСЕ");
    return realTypes.map((t) => {
      const first = collections.find((c) => c.type === t);
      const img = first?.image || first?.images?.[0] || DEFAULT_CORNICE_IMAGE;
      return { type: t, image: img };
    });
  }, [collections, types]);

  return (
    <div className="rounded-3xl border border-black/10 p-8 dark:border-white/10">
      {viewMode === 'items' && activeCollection ? (
        <div className="mb-6">
          <button
            type="button"
            onClick={() => {
              setViewMode('collections');
              setActiveCollection(null);
              setActiveItems([]);
            }}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            ← Назад к коллекциям
          </button>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[color:var(--fg)]">
            {activeCollection.title || activeCollection.collectionSlug}
          </h3>
          {activeCollection.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
              {activeCollection.description}
            </p>
          ) : null}
        </div>
      ) : null}

      {viewMode !== 'types' ? (
        <div className={viewMode === 'items' && activeCollection ? "-mt-2 mb-6" : "mb-6"}>
          <button
            type="button"
            onClick={() => {
              setViewMode('types');
              setType("ВСЕ");
              setActiveCollection(null);
              setActiveItems([]);
              setActiveItem(null);
            }}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            ← Назад к видам
          </button>
        </div>
      ) : null}

      {viewMode === 'types' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {typeCards.map((t) => (
            isElectroType(t.type) ? (
              <Link
                key={t.type}
                href="/electro"
                className="group block text-left overflow-hidden bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="relative aspect-square overflow-hidden">
                  {isVideoSrc(t.image) ? (
                    <video className="h-full w-full object-contain bg-black/5" src={t.image} muted playsInline preload="metadata" />
                  ) : (
                    <img
                      alt={t.type}
                      src={t.image}
                      className="h-full w-full object-contain bg-black/5 transition-[transform,filter] duration-300 ease-in-out group-hover:scale-[1.05] group-hover:saturate-[1.06]"
                    />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.14),rgba(0,0,0,0.50))]" />
                </div>
                <div className="p-6">
                  <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">{t.type}</div>
                  <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                    Открыть →
                  </div>
                </div>
              </Link>
            ) : (
              <button
                key={t.type}
                type="button"
                onClick={() => {
                  setType(t.type);
                  setViewMode('collections');
                }}
                className="group text-left overflow-hidden bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="relative aspect-square overflow-hidden">
                  {isVideoSrc(t.image) ? (
                    <video className="h-full w-full object-contain bg-black/5" src={t.image} muted playsInline preload="metadata" />
                  ) : (
                    <img
                      alt={t.type}
                      src={t.image}
                      className="h-full w-full object-contain bg-black/5 transition-[transform,filter] duration-300 ease-in-out group-hover:scale-[1.05] group-hover:saturate-[1.06]"
                    />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.14),rgba(0,0,0,0.50))]" />
                </div>
                <div className="p-6">
                  <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">{t.type}</div>
                  <div className="mt-4 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                    Смотреть коллекции →
                  </div>
                </div>
              </button>
            )
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-[1fr,auto] lg:items-center">
            <div className="grid gap-4 lg:grid-cols-[1fr,auto] lg:items-end">
              <div>
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КАТАЛОГ</div>
                <div className="mt-3">
                  <FilterSelect
                    label="Вид"
                    value={type}
                    onChange={setType}
                    options={types.map((t) => ({ value: t, label: t === "ВСЕ" ? "Все" : t }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-start lg:justify-end">
              <button
                type="button"
                disabled={type === "ВСЕ" && viewMode === 'collections'}
                onClick={() => {
                  setType("ВСЕ");
                  if (viewMode === 'items') {
                    setViewMode('collections');
                    setActiveCollection(null);
                    setActiveItems([]);
                  }
                }}
                className={
                  type !== "ВСЕ" || viewMode === 'items'
                    ? "inline-flex h-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                    : "inline-flex h-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 text-sm font-medium text-[color:var(--muted)] opacity-50"
                }
              >
                Сбросить
              </button>
            </div>
          </div>

          {type.toLowerCase() === "металлические" && viewMode === 'collections' ? null : null}

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {viewMode === 'collections' ? (
              (filteredCollections.length ? filteredCollections : collections).map((it, idx) => {
                const img = it.image || it.images?.[0] || "/catalog/4.\u041a\u0430\u0440\u043d\u0438\u0437\u044b/\u0411\u0430\u0433\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u043d\u0438\u0437\u044b/1.webp";
                const title = String(it.title || "").trim() || `Коллекция ${idx + 1}`;
                const collectionItems = leafItems.filter((item) => item.collectionSlug === it.collectionSlug);
                return (
                  <button
                    key={`${title}-${idx}-${img}`}
                    type="button"
                    onClick={() => {
                      const collectionItems = leafItems.filter((item) => item.collectionSlug === it.collectionSlug);
                      // Открываем модалку коллекции (с вариантами) всегда
                      setActiveCollection(it);
                      setActiveItems(collectionItems);
                      setActiveModalCollection(it);
                      setActiveItem(collectionItems[0] || null);
                    }}
                    className="group overflow-hidden border border-black/10 bg-white/70 text-left shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      {isVideoSrc(img) ? (
                        <video className="h-full w-full object-contain bg-black/5" src={img} muted playsInline preload="metadata" />
                      ) : (
                        <img
                          alt={it.title || it.collectionSlug || it.url || ""}
                          src={img}
                          className="h-full w-full object-contain bg-black/5 transition duration-300 group-hover:scale-[1.03]"
                        />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.14),rgba(0,0,0,0.50))]" />
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-semibold tracking-tight text-[color:var(--fg)]">{title}</div>
                      <div className="mt-2 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-colors duration-300 group-hover:text-[color:var(--fg)]">
                        Открыть →
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              activeItems.map((it, idx) => {
                const img = it.image || it.images?.[0] || "/catalog/4.\u041a\u0430\u0440\u043d\u0438\u0437\u044b/\u0411\u0430\u0433\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u043d\u0438\u0437\u044b/1.webp";
                const title = String(it.title || "").trim() || `Вариант ${idx + 1}`;
                return (
                  <button
                    key={`${it.collectionSlug}-${title}-${idx}`}
                    type="button"
                    onClick={() => setActiveItem(it)}
                    className="group overflow-hidden border border-black/10 bg-white/70 text-left shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      {isVideoSrc(img) ? (
                        <video className="h-full w-full object-contain bg-black/5" src={img} muted playsInline preload="metadata" />
                      ) : (
                        <img
                          alt={it.title || it.collectionSlug || it.url || ""}
                          src={img}
                          className="h-full w-full object-contain bg-black/5 transition duration-300 group-hover:scale-[1.03]"
                        />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.14),rgba(0,0,0,0.50))]" />
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-semibold tracking-tight text-[color:var(--fg)]">{title}</div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {activeModalCollection && activeItems.length > 0 ? (
            <CorniceCollectionModal
              collection={activeModalCollection}
              items={activeItems}
              onClose={() => {
                setActiveModalCollection(null);
                setActiveItem(null);
              }}
            />
          ) : null}

          {activeItem && !activeModalCollection ? (
            <CornicesModal item={activeItem} collections={collections} onClose={() => setActiveItem(null)} />
          ) : null}
        </>
      )}
    </div>
  );
}
