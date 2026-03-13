"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";

import { LeadRequestModal } from "@/components/LeadRequestModal";
import { IconTelegram } from "@/components/icons";

export type CurtainTypeItem = {
  source?: string;
  kind?: string;
  url: string;
  title?: string;
  description?: string;
  image?: string;
  images?: string[];
  group?: string;
};

function normGroup(g?: string) {
  const s = String(g || "").trim();
  if (!s) return "";
  const u = s.toUpperCase();
  if (u.includes("ПОМЕЩ")) return "ПОМЕЩЕНИЕ";
  if (u.includes("КОМН")) return "КОМНАТА";
  if (u.includes("СТИЛ")) return "СТИЛЬ";
  return u;
}

function normTitle(t?: string) {
  const s = String(t || "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  const beforeColon = s.split(":")[0]?.trim();
  if (beforeColon && beforeColon.length >= 4 && beforeColon.length <= 44) return beforeColon;
  return s;
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
          "mt-2 flex h-11 w-full items-center justify-between rounded-2xl border px-3 text-left text-sm shadow-sm outline-none transition " +
          (isDisabled
            ? "cursor-not-allowed border-black/10 bg-black/[0.02] text-[color:var(--muted)]/50 dark:border-white/10 dark:bg-white/[0.03]"
            : "border-black/10 bg-white/70 text-[color:var(--fg)] hover:bg-white/90 focus:ring-2 focus:ring-[color:var(--accent)]/30 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10")
        }
      >
        <span className="truncate pr-3">{selectedLabel}</span>
        <span aria-hidden="true" className={"text-[color:var(--muted)] transition " + (open ? "rotate-180" : "")}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-black/10 bg-white/90 shadow-xl backdrop-blur dark:border-white/10 dark:bg-black/50">
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
                      ? "cursor-not-allowed text-[color:var(--muted)]/40"
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

function CurtainsTypeModal({ item, onClose }: { item: CurtainTypeItem; onClose: () => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(wrapRef, onClose);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const images = useMemo(() => {
    const arr = [...(item.images || [])].filter(Boolean);
    if (item.image) arr.unshift(item.image);
    return Array.from(new Set(arr)).slice(0, 10);
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

  const image = images[activeIdx] || images[0] || "/catalog/decor.jpg";
  const [leadOpen, setLeadOpen] = useState(false);

  const thumbsVisibleCount = 4;
  const canThumbUp = thumbStart > 0;
  const canThumbDown = thumbStart + thumbsVisibleCount < images.length;
  const visibleThumbs = images.slice(thumbStart, thumbStart + thumbsVisibleCount);

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
          <h2 className="text-xl font-semibold sm:text-2xl">{item.title || "Вид штор"}</h2>
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
                    onClick={() => setThumbStart((v) => Math.min(Math.max(0, images.length - thumbsVisibleCount), v + 1))}
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
                  <img alt={item.title || ""} className="h-full w-full object-cover" src={image} />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.12),rgba(0,0,0,0.28))]" />
                </div>

                {images.length > 1 ? (
                  <div className="mt-3 flex gap-2 overflow-x-auto sm:hidden">
                    {images.map((src, idx) => {
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
              <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ЗАЧЕМ</div>
              <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {item.description ||
                  "Подбираем этот вид, когда нужно попасть в свет, приватность и финальный вид окна. Подскажем ткань и посадку под вашу комнату."}
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
                      productType: "curtain_type",
                      source: item.source,
                      kind: item.kind,
                      url: item.url,
                      title: item.title,
                      category: item.group,
                      image,
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

export function CurtainTypesList({
  items,
}: {
  items: CurtainTypeItem[];
}) {
  const [active, setActive] = useState<CurtainTypeItem | null>(null);

  const [open, setOpen] = useState<Record<string, boolean>>({
    ПОМЕЩЕНИЕ: false,
    КОМНАТА: false,
    СТИЛЬ: true,
    ПРОЧЕЕ: false,
  });

  const grouped = useMemo(() => {
    const cleaned = (items || [])
      .filter((i) => i && (i.title || i.url))
      .map((i) => ({
        ...i,
        title: (i.title || "").trim(),
        description: (i.description || "").trim(),
        group: normGroup(i.group) || "ПРОЧЕЕ",
      }))
      .sort((a, b) => String(a.title || a.url).localeCompare(String(b.title || b.url)));

    const byGroup = new Map<string, CurtainTypeItem[]>();
    for (const it of cleaned) {
      const arr = byGroup.get(it.group || "ПРОЧЕЕ") || [];
      arr.push(it);
      byGroup.set(it.group || "ПРОЧЕЕ", arr);
    }

    const order = ["ПОМЕЩЕНИЕ", "КОМНАТА", "СТИЛЬ", "ПРОЧЕЕ"];
    return order
      .map((g) => ({ group: g, items: byGroup.get(g) || [] }))
      .filter((x) => x.items.length > 0);
  }, [items]);

  function toggleGroup(g: string) {
    setOpen((prev) => ({ ...prev, [g]: !prev[g] }));
  }

  function Columns({ list }: { list: CurtainTypeItem[] }) {
    const left: CurtainTypeItem[] = [];
    const right: CurtainTypeItem[] = [];
    list.forEach((it, idx) => (idx % 2 === 0 ? left.push(it) : right.push(it)));

    return (
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="grid gap-4">
          {left.map((it) => (
            <button
              key={it.url}
              type="button"
              onClick={() => setActive(it)}
              className="text-left text-lg font-medium tracking-tight text-[color:var(--fg)] transition hover:text-[color:var(--accent)]"
            >
              {it.title || it.url}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {right.map((it) => (
            <button
              key={it.url}
              type="button"
              onClick={() => setActive(it)}
              className="text-left text-lg font-medium tracking-tight text-[color:var(--fg)] transition hover:text-[color:var(--accent)]"
            >
              {it.title || it.url}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-3">
        {grouped.map(({ group, items }) => {
          const isOpen = !!open[group];
          return (
            <div key={group} className="rounded-2xl border border-black/10 bg-white/60 px-5 py-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
              >
                <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">{group}</div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-sm font-semibold text-[color:var(--fg)] transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">
                  {isOpen ? "−" : "+"}
                </div>
              </button>

              {isOpen ? <Columns list={items} /> : null}
            </div>
          );
        })}
      </div>

      {active ? <CurtainsTypeModal item={active} onClose={() => setActive(null)} /> : null}
    </div>
  );
}

export function CurtainTypesCatalog({ items }: { items: CurtainTypeItem[] }) {
  const [active, setActive] = useState<CurtainTypeItem | null>(null);
  const [group, setGroup] = useState<string>("ВСЕ");
  const [type, setType] = useState<string>("ВСЕ");

  const searchParams = useSearchParams();
  const pendingTypeRef = useRef<string>("");
  const pendingOpenRef = useRef<boolean>(false);
  const pendingScrollRef = useRef<boolean>(false);
  const skipTypeResetRef = useRef<boolean>(false);
  const firstCardRef = useRef<HTMLButtonElement | null>(null);

  const cleaned = useMemo(() => {
    return (items || [])
      .filter((i) => i && (i.title || i.url))
      .map((i) => ({
        ...i,
        title: (i.title || "").trim(),
        description: (i.description || "").trim(),
        group: normGroup(i.group) || "ПРОЧЕЕ",
      }));
  }, [items]);

  useEffect(() => {
    const g = String(searchParams?.get("g") || "").trim();
    const t = String(searchParams?.get("t") || "").trim();
    const open = String(searchParams?.get("open") || "").trim();
    const scroll = String(searchParams?.get("scroll") || "").trim();

    pendingTypeRef.current = t;
    pendingOpenRef.current = open === "1" || open.toLowerCase() === "true";
    pendingScrollRef.current = scroll === "1" || scroll.toLowerCase() === "true" || pendingOpenRef.current;

    if (!g) return;
    const wanted = g.toUpperCase();
    if (wanted.includes("ПОМЕЩ")) setGroup("ПОМЕЩЕНИЕ");
    else if (wanted.includes("КОМН")) setGroup("КОМНАТА");
    else if (wanted.includes("СТИЛ")) setGroup("СТИЛЬ");
  }, [searchParams]);

  const groups = useMemo(() => {
    const set = new Set(cleaned.map((i) => i.group).filter(Boolean));
    const order = ["ПОМЕЩЕНИЕ", "КОМНАТА", "СТИЛЬ", "ПРОЧЕЕ"];
    const arr = order.filter((g) => set.has(g));
    for (const g of Array.from(set).sort()) if (!arr.includes(g)) arr.push(g);
    return arr;
  }, [cleaned]);

  const typesForGroup = useMemo(() => {
    const pool = group === "ВСЕ" ? cleaned : cleaned.filter((i) => i.group === group);
    const set = new Set(pool.map((i) => normTitle(i.title)).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [cleaned, group]);

  useEffect(() => {
    const raw = String(pendingTypeRef.current || "").trim();
    if (!raw) return;

    const needle = raw.toLowerCase();
    // Search across ALL cleaned items, not just typesForGroup
    const allTypes = Array.from(new Set(cleaned.map((i) => normTitle(i.title)).filter(Boolean)));
    const exact = allTypes.find((x) => x.toLowerCase() === needle);
    const incl = allTypes.find((x) => x.toLowerCase().includes(needle));
    const best = exact || incl;
    if (best) {
      setType(best);
      skipTypeResetRef.current = true;
    }
  }, [cleaned]);

  const filtered = useMemo(() => {
    let result = cleaned
      .filter((i) => (group === "ВСЕ" ? true : i.group === group))
      .filter((i) => (type === "ВСЕ" ? true : normTitle(i.title) === type));
    
    // Sort by relevance to pending type if URL params present
    const pendingType = String(pendingTypeRef.current || "").trim().toLowerCase();
    if (pendingType) {
      result = [...result].sort((a, b) => {
        const aTitle = normTitle(a.title).toLowerCase();
        const bTitle = normTitle(b.title).toLowerCase();
        const aExact = aTitle === pendingType ? 2 : aTitle.includes(pendingType) ? 1 : 0;
        const bExact = bTitle === pendingType ? 2 : bTitle.includes(pendingType) ? 1 : 0;
        return bExact - aExact;
      });
    }
    
    return result;
  }, [cleaned, group, type]);

  useEffect(() => {
    if (filtered.length === 0) return;
    if (!pendingScrollRef.current && !pendingOpenRef.current) return;

    requestAnimationFrame(() => {
      if (firstCardRef.current) firstCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (pendingOpenRef.current) {
      setActive(filtered[0] || null);
      pendingOpenRef.current = false;
    }

    pendingScrollRef.current = false;
  }, [filtered]);

  useEffect(() => {
    if (skipTypeResetRef.current) {
      skipTypeResetRef.current = false;
      return;
    }
    if (type !== "ВСЕ" && !typesForGroup.includes(type)) setType("ВСЕ");
  }, [type, typesForGroup]);

  const canReset = group !== "ВСЕ" || type !== "ВСЕ";

  const groupOptions = useMemo(() => {
    return [{ value: "ВСЕ", label: "Все" }, ...groups.map((g) => ({ value: g, label: g }))];
  }, [groups]);

  const typeOptions = useMemo(() => {
    return [{ value: "ВСЕ", label: "Все" }, ...typesForGroup.map((t) => ({ value: t, label: t }))];
  }, [typesForGroup]);

  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-3 lg:grid-cols-[1fr,auto] lg:items-center">
        <div className="grid gap-4 lg:grid-cols-[1fr,1fr,auto] lg:items-end">
          <div>
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">КАТАЛОГ</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <FilterSelect label="Группа" value={group} onChange={setGroup} options={groupOptions} />
              <FilterSelect label="Тип" value={type} onChange={setType} options={typeOptions} isDisabled={typesForGroup.length === 0} />
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="whitespace-nowrap text-sm text-[color:var(--muted)]">
              Показано: <span className="font-semibold text-[color:var(--fg)]">{filtered.length}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-start lg:justify-end">
          <button
            type="button"
            disabled={!canReset}
            onClick={() => {
              setGroup("ВСЕ");
              setType("ВСЕ");
            }}
            className={
              canReset
                ? "inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                : "inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] px-4 text-sm font-semibold text-[color:var(--muted)] opacity-70 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
            }
          >
            Сбросить
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it, idx) => {
          const img = (it.images && it.images[0]) || it.image || "/catalog/curtains.jpg";
          return (
            <button
              key={it.url}
              ref={idx === 0 ? firstCardRef : undefined}
              type="button"
              onClick={() => setActive(it)}
              className="group block overflow-hidden rounded-3xl border border-black/10 bg-white/60 text-left shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={img}
                  alt={it.title || ""}
                  className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.18),rgba(0,0,0,0.52))]" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">
                      {normTitle(it.title) || it.url}
                    </div>
                    <div className="mt-1 text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">
                      {it.group}
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] transition-colors duration-300 group-hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:group-hover:bg-white/[0.10]">
                    <span
                      aria-hidden="true"
                      className="text-[color:var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </div>
                </div>
                <div className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">
                  {it.description || "Откройте подробности и примеры, чтобы подобрать решение под ваш интерьер."}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {active ? <CurtainsTypeModal item={active} onClose={() => setActive(null)} /> : null}
    </div>
  );
}
