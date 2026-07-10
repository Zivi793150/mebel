"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { ContactModal } from "@/components/ContactModal";
import { IconTelegram } from "@/components/icons";

type RugItem = {
  title?: string;
  priceText?: string;
  image?: string;
  images?: string[];
  url?: string;
  style?: string;
  collection?: string;
  color?: string;
};

const STYLE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "abstract", label: "Абстрактный" },
  { value: "amorphous", label: "Аморфный" },
  { value: "art", label: "Искусство" },
  { value: "art_deco", label: "Арт Деко" },
  { value: "bordered", label: "С рамкой" },
  { value: "floral", label: "Цветочный" },
  { value: "solid", label: "Однотонный" },
  { value: "ethnic", label: "Этнический" },
  { value: "geometric", label: "Геометрический" },
  { value: "classic", label: "Классический" },
  { value: "modern", label: "Современный" },
  { value: "patchwork", label: "Пэчворк" },
];

const COLLECTION_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "amorph", label: "Аморфный" },
  { value: "coral", label: "Коралловый" },
  { value: "crystal", label: "Кристалл" },
  { value: "ethnique", label: "Этнический" },
  { value: "istanbul", label: "Стамбул" },
  { value: "marquise", label: "Маркиз" },
  { value: "marrakesh", label: "Марракеш" },
  { value: "monochrome", label: "Монохром" },
  { value: "oriental", label: "Ориентальный" },
  { value: "patch", label: "Пэч (лоскутный)" },
  { value: "pearl", label: "Жемчуг" },
  { value: "plain", label: "Простой" },
  { value: "sapphire", label: "Сапфир" },
  { value: "shell", label: "Ракушка" },
  { value: "trinty", label: "Троица" },
  { value: "vintage", label: "Винтаж" },
];

const COLOR_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "beige", label: "Бежевый" },
  { value: "white", label: "Белый" },
  { value: "multi", label: "Многоцветный" },
  { value: "ecru", label: "Экрю" },
  { value: "grey", label: "Серый" },
  { value: "brown", label: "Коричневый" },
  { value: "red", label: "Красный" },
  { value: "blue", label: "Синий" },
  { value: "purple", label: "Фиолетовый" },
  { value: "pink", label: "Розовый" },
  { value: "yellow", label: "Желтый" },
  { value: "black", label: "Черный" },
  { value: "orange", label: "Оранжевый" },
  { value: "green", label: "Зеленый" },
];

function normalizePrice(priceText?: string) {
  if (!priceText) return "";
  return priceText.replace(/\s+/g, " ").trim();
}

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
          "mt-2 flex h-11 w-full items-center justify-between border px-3 text-left text-sm shadow-sm outline-none transition " +
          (isDisabled
            ? "cursor-not-allowed border-black/10 bg-black/[0.02] text-[color:var(--muted)]/50 dark:border-white/10 dark:bg-white/[0.03]"
            : "border-black/10 bg-white/70 text-[color:var(--fg)] hover:bg-white/90 focus:ring-2 focus:ring-[color:var(--accent)]/30 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10")
        }
      >
        <span className="truncate pr-3">{selectedLabel}</span>
        <span
          aria-hidden="true"
          className={"text-[color:var(--muted)] transition " + (open ? "rotate-180" : "")}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden border border-black/10 bg-white/90 shadow-xl dark:border-white/10 dark:bg-black/50">
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
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition " +
                    (disabled
                      ? "cursor-not-allowed bg-black/[0.02] text-[color:var(--muted)]/40 dark:bg-white/[0.02]"
                      : active
                        ? "bg-[color:var(--accent)]/12 text-[color:var(--fg)]"
                        : "text-[color:var(--fg)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]")
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

function RugDetailsModal({
  item,
  onClose,
}: {
  item: RugItem;
  onClose: () => void;
}) {
  const current = item.image || "/hero.webp";
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(wrapRef, onClose);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const chips = [
    item.style ? { label: "Стиль", value: item.style } : null,
    item.collection ? { label: "Коллекция", value: item.collection } : null,
    item.color ? { label: "Цвет", value: item.color } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/45 p-4 overflow-y-auto py-8">
      <div
        ref={wrapRef}
        className="w-full max-w-xl border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-5"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="inline-flex h-8 w-8 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] transition hover:bg-[color:var(--card)]"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold truncate px-2">{item.title || "Product Details"}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] transition hover:bg-[color:var(--card)]"
          >
            ✕
          </button>
        </div>

        <div className="my-3 h-px w-full bg-black/10 dark:bg-white/10" />

        <div className="relative aspect-[4/3] w-full overflow-hidden border border-black/10 bg-black/5">
          <img
            alt=""
            src={current}
            className="absolute inset-0 h-full w-full object-cover blur-md saturate-[0.3] opacity-55 scale-105"
            aria-hidden="true"
          />
          {isVideoSrc(current) ? (
            <video
              src={current}
              autoPlay
              muted
              loop
              playsInline
              className="relative h-full w-full object-contain object-center"
            />
          ) : (
            <img alt="" className="relative h-full w-full object-contain object-center" src={current} />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.35),transparent_60%)] pointer-events-none" />
        </div>

        <div className="mt-4 border border-[color:var(--gray-lines)] bg-[color:var(--bg)] p-4">
          {chips.length ? (
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <div
                  key={c.label}
                  className="border border-black/10 bg-white/70 px-3 py-1 text-xs text-[color:var(--fg)] dark:border-white/10 dark:bg-white/[0.06]"
                  title={c.label}
                >
                  <span className="text-[color:var(--muted)]">{c.label}: </span>
                  <span className="font-semibold">{c.value}</span>
                </div>
              ))}
            </div>
          ) : null}

          {item.priceText ? (
            <div className="mt-3">
              <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ЦЕНА</div>
              <div className="mt-1 text-xl font-semibold text-[color:var(--fg)]">
                {normalizePrice(item.priceText)}
              </div>
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 flex-1 items-center justify-center border border-black/10 bg-white/70 px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 min-w-[140px]"
              >
                Открыть на сайте
              </a>
            ) : null}

            <button
              type="button"
              onClick={() => setLeadOpen(true)}
              className="inline-flex h-10 flex-1 items-center justify-center bg-[color:var(--green)] px-4 text-sm font-medium text-white transition hover:opacity-90 min-w-[140px]"
            >
              Связаться
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 flex-1 items-center justify-center border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10] min-w-[100px]"
            >
              Закрыть
            </button>
          </div>

          {leadOpen ? (
            <ContactModal
              onClose={() => setLeadOpen(false)}
              imageSrc="/foto-na-knopku-1-.webp"
              context={{
                productType: "rug",
                title: item.title,
                url: item.url,
                category: item.collection,
                image: current,
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function RugsStyleCatalog({ items }: { items: RugItem[] }) {
  const [style, setStyle] = useState<string>("all");
  const [collection, setCollection] = useState<string>("all");
  const [color, setColor] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(20);
  const [activeItem, setActiveItem] = useState<RugItem | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const available = useMemo(() => {
    return {
      style: new Set(items.map((i) => i.style).filter(Boolean) as string[]),
      collection: new Set(items.map((i) => i.collection).filter(Boolean) as string[]),
      color: new Set(items.map((i) => i.color).filter(Boolean) as string[]),
    };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (style !== "all" && i.style !== style) return false;
      if (collection !== "all" && i.collection !== collection) return false;
      if (color !== "all" && i.color !== color) return false;
      return true;
    });
  }, [collection, color, items, style]);

  useEffect(() => {
    setVisibleCount(20);
  }, [style, collection, color]);

  const visible = useMemo(() => {
    return filtered.slice(0, Math.max(0, visibleCount));
  }, [filtered, visibleCount]);

  return (
    <div className="grid gap-6">
      <div className="sticky top-16 z-30 border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-4">
        <div className="flex items-center justify-between gap-3 sm:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setStyle("all");
                setCollection("all");
                setColor("all");
              }}
              className="inline-flex h-10 items-center justify-center border border-black/10 bg-white/70 px-3 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              Сбросить
            </button>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="inline-flex h-10 items-center justify-center border border-black/10 bg-white/70 px-3 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              aria-expanded={mobileFiltersOpen}
            >
              Фильтры <span className={"ml-2 transition " + (mobileFiltersOpen ? "rotate-180" : "")}>▾</span>
            </button>
          </div>
        </div>

        {mobileFiltersOpen ? (
          <div className="mt-4 grid gap-3 sm:hidden">
            <FilterSelect
              label="СТИЛЬ"
              value={style}
              onChange={setStyle}
              options={[
                { value: "all", label: "Все" },
                ...STYLE_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                  disabled: !available.style.has(o.value),
                })),
              ]}
            />
            <FilterSelect
              label="КОЛЛЕКЦИЯ"
              value={collection}
              onChange={setCollection}
              options={[
                { value: "all", label: "Все" },
                ...COLLECTION_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                  disabled: !available.collection.has(o.value),
                })),
              ]}
            />
            <FilterSelect
              label="ЦВЕТ"
              value={color}
              onChange={setColor}
              options={[
                { value: "all", label: "Все" },
                ...COLOR_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                  disabled: !available.color.has(o.value),
                })),
              ]}
            />
          </div>
        ) : null}

        <div className="hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-3">
            <FilterSelect
              label="СТИЛЬ"
              value={style}
              onChange={setStyle}
              options={[
                { value: "all", label: "Все" },
                ...STYLE_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                  disabled: !available.style.has(o.value),
                })),
              ]}
            />
          </div>

          <div className="lg:col-span-4">
            <FilterSelect
              label="КОЛЛЕКЦИЯ"
              value={collection}
              onChange={setCollection}
              options={[
                { value: "all", label: "Все" },
                ...COLLECTION_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                  disabled: !available.collection.has(o.value),
                })),
              ]}
            />
          </div>

          <div className="lg:col-span-3">
            <FilterSelect
              label="ЦВЕТ"
              value={color}
              onChange={setColor}
              options={[
                { value: "all", label: "Все" },
                ...COLOR_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                  disabled: !available.color.has(o.value),
                })),
              ]}
            />
          </div>

          <div className="flex items-center justify-between gap-3 sm:col-span-2 lg:col-span-2 lg:justify-end">
            <button
              type="button"
              onClick={() => {
                setStyle("all");
                setCollection("all");
                setColor("all");
              }}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-black/10 bg-white/50 p-8 text-center backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="text-lg font-semibold text-[color:var(--fg)]">Ковры не найдены</div>
            <div className="mt-3 text-sm text-[color:var(--muted)]">
              Больше ковров на сайте{" "}
              <a
                href="https://koenigcarpet.ru"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[color:var(--accent)] underline underline-offset-2 transition hover:opacity-80"
              >
                koenigcarpet.ru
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((it, idx) => {
              const current = it.image || "/hero.webp";
              return (
                <button
                  key={(it.url || it.title || "rug") + idx}
                  type="button"
                  onClick={() => setActiveItem(it)}
                  className="block text-left"
                  aria-label={it.title || "Ковёр"}
                >
                  <div className="group overflow-hidden border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                    <div className="relative w-full overflow-hidden border border-black/10 bg-black/5" style={{ aspectRatio: '340/480' }}>
                      {/* Blurred background */}
                      <img
                        alt=""
                        src={current}
                        className="absolute inset-0 h-full w-full object-cover blur-md saturate-[0.3] opacity-55 scale-105"
                        aria-hidden="true"
                      />
                      {/* Main content */}
                      {isVideoSrc(current) ? (
                        <video
                          src={current}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="relative h-full w-full object-cover object-center"
                        />
                      ) : (
                        <img alt="" className="relative h-full w-full object-cover object-center" src={current} />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.35),transparent_60%)] pointer-events-none" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold tracking-tight text-[color:var(--fg)] truncate">
                            {it.title || "Ковёр"}
                          </div>
                          <div className="mt-0.5 text-[10px] font-semibold tracking-[0.2em] text-[color:var(--muted)] truncate">
                            {normalizePrice(it.priceText) || ""}
                          </div>
                        </div>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-black/10 bg-black/[0.03] transition-colors duration-300 group-hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:group-hover:bg-white/[0.10]">
                          <span
                            aria-hidden="true"
                            className="text-[10px] text-[color:var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5"
                          >
                            →
                          </span>
                        </div>
                      </div>
                      {it.url && (
                        <a
                          href={it.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2 block w-full text-center border border-black/10 bg-[color:var(--accent)]/10 px-2 py-1.5 text-[10px] font-semibold tracking-wider text-[color:var(--accent)] transition hover:bg-[color:var(--accent)]/20 hover:text-[color:var(--accent)] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.12]"
                        >
                          Перейти на ковер →
                        </a>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {filtered.length > visible.length ? (
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => setVisibleCount((v) => v + 20)}
            className="inline-flex h-12 items-center justify-center gap-2 border border-black/10 bg-white/70 px-6 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            aria-label="Показать ещё"
          >
            Показать ещё
            <span aria-hidden="true" className="text-[color:var(--muted)]">
              ↓
            </span>
          </button>
          <a
            href="https://koenigcarpet.ru"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:opacity-95"
          >
            Больше ковров на koenigcarpet.ru →
          </a>
        </div>
      ) : (
        <div className="flex justify-center">
          <a
            href="https://koenigcarpet.ru"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:opacity-95"
          >
            Больше ковров на koenigcarpet.ru →
          </a>
        </div>
      )}

      {activeItem ? <RugDetailsModal item={activeItem} onClose={() => setActiveItem(null)} /> : null}
    </div>
  );
}
