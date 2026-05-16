"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";

import { ContactModal } from "@/components/ContactModal";
import { IconTelegram } from "@/components/icons";
import { normalizeClientImageUrl } from "@/lib/clientUtils";

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

function CurtainsTypeModal({ item, onClose }: { item: CurtainTypeItem; onClose: () => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(wrapRef, onClose);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const images = useMemo(() => {
    const arr = [...(item.images || [])].filter(Boolean).map(normalizeClientImageUrl);
    if (item.image) arr.unshift(normalizeClientImageUrl(item.image));
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

  const image = images[activeIdx] || images[0] || "/catalog/5.-dekor-furnitura/50007.webp";
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4">
      <div
        ref={wrapRef}
        className="w-full max-w-7xl border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-6"
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
          <h2 className="text-xl font-medium sm:text-2xl">{item.title || "Вид штор"}</h2>
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
          <div className="relative lg:col-span-8">
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
                              ? "overflow-hidden border border-[color:var(--fg)] bg-[color:var(--card)]"
                              : "overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)] transition hover:bg-[color:var(--bg)]"
                          }
                        >
                          <div className="relative aspect-square">
                            <img alt="" src={src} className="h-full w-full object-contain bg-black/5" />
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
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-[color:var(--gray-lines)]">
                  {/* Blurred background for vertical/small images */}
                  <img
                    alt=""
                    src={image}
                    className="absolute inset-0 h-full w-full object-cover blur-md saturate-[0.3] opacity-55 scale-105"
                    aria-hidden="true"
                  />
                  {/* Main image */}
                  <img
                    alt={item.title || ""}
                    className="relative h-full w-full object-contain object-center"
                    src={image}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.35),transparent_60%)] pointer-events-none" />
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
                              ? "h-16 w-16 flex-none overflow-hidden border border-[color:var(--fg)]"
                              : "h-16 w-16 flex-none overflow-hidden border border-[color:var(--gray-lines)] transition hover:bg-[color:var(--bg)]"
                          }
                        >
                          <img alt="" src={src} className="h-full w-full object-contain bg-black/5" />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="border border-[color:var(--gray-lines)] bg-[color:var(--bg)] p-5">
              <div className="text-sm leading-6 text-[color:var(--muted)]">
                {item.description ||
                  "Подбираем этот вид, когда нужно попасть в свет, приватность и финальный вид окна. Подскажем ткань и посадку под вашу комнату."}
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
                    className="inline-flex h-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
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
        const aDesc = String(a.description || "").toLowerCase();
        const bDesc = String(b.description || "").toLowerCase();
        const aGroup = String(a.group || "").toLowerCase();
        const bGroup = String(b.group || "").toLowerCase();
        
        // Check title match
        const aTitleExact = aTitle === pendingType ? 3 : aTitle.includes(pendingType) ? 2 : 0;
        const bTitleExact = bTitle === pendingType ? 3 : bTitle.includes(pendingType) ? 2 : 0;
        
        // Check description match
        const aDescMatch = aDesc.includes(pendingType) ? 1 : 0;
        const bDescMatch = bDesc.includes(pendingType) ? 1 : 0;
        
        // Check group match
        const aGroupMatch = aGroup.includes(pendingType) ? 1 : 0;
        const bGroupMatch = bGroup.includes(pendingType) ? 1 : 0;
        
        const aScore = aTitleExact + aDescMatch + aGroupMatch;
        const bScore = bTitleExact + bDescMatch + bGroupMatch;
        return bScore - aScore;
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
    <div className="border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-6 sm:p-8">
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
                ? "inline-flex h-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                : "inline-flex h-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 text-sm font-medium text-[color:var(--muted)] opacity-50"
            }
          >
            Сбросить
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it, idx) => {
          const img = normalizeClientImageUrl(it.image || (it.images && it.images[0]) || "/catalog/1.shtory-i-tkani/1.1.avstriyskie/avstriyskie-na-ikonku.webp");
          return (
            <button
              key={it.url}
              type="button"
              onClick={() => setActive(it)}
              className="group block overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-left transition duration-300 hover:bg-[color:var(--bg)]"
            >
              <div className="relative w-full pt-[75%] overflow-hidden bg-black/5">
                <img
                  src={img}
                  alt={it.title || ""}
                  className="absolute inset-0 block !h-full !w-full !object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_70%)]" />
              </div>
              <div className="p-5">
                <div className="text-lg font-medium text-[color:var(--fg)]">
                  {normTitle(it.title) || it.url}
                </div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">
                  {it.group}
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
