"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type PreviewItem = {
  key: string;
  label: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
};

type Token =
  | { type: "text"; value: string }
  | { type: "link"; key: string; value: string };

function tokenize(text: string, keys: Record<string, string>): Token[] {
  const entries = Object.entries(keys);
  if (entries.length === 0) return [{ type: "text", value: text }];

  const pattern = entries
    .map(([, v]) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|");

  const re = new RegExp(`(${pattern})`, "g");
  const parts = text.split(re).filter((p) => p.length > 0);

  return parts.map((part) => {
    const hit = entries.find(([, v]) => v === part);
    if (!hit) return { type: "text", value: part };
    return { type: "link", key: hit[0], value: part };
  });
}

export function AboutHoverPreview({
  items,
  paragraphs,
}: {
  items: PreviewItem[];
  paragraphs: string[];
}) {
  const byKey = useMemo(() => new Map(items.map((it) => [it.key, it])), [items]);
  const keyToLabel = useMemo(() => Object.fromEntries(items.map((it) => [it.key, it.label])), [items]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      const x = e.clientX;
      const y = e.clientY;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setPos({ x, y });
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const onResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const active = activeKey ? byKey.get(activeKey) : null;

  const x = Math.min(pos.x + 18, dimensions.width - 320);
  const y = Math.min(pos.y + 18, dimensions.height - 260);

  return (
    <div ref={containerRef} className="relative">
      <div className="space-y-4 text-[15px] leading-7 text-[color:var(--muted)] sm:text-base">
        {paragraphs.map((p) => {
          const tokens = tokenize(p, keyToLabel);
          return (
            <p
              key={p}
              className={
                "[text-wrap:balance] transition-all duration-500 " +
                (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
              }
            >
              {tokens.map((t, idx) => {
                if (t.type === "text") return <span key={idx}>{t.value}</span>;

                const isActive = activeKey === t.key;
                return (
                  <span
                    key={idx}
                    className={
                      "font-semibold text-[color:var(--fg)] cursor-pointer transition-colors relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:w-0 after:bg-[linear-gradient(90deg,var(--accent),rgba(254,202,87,1),rgba(72,219,251,1))] after:transition-all after:duration-300 hover:after:w-full" +
                      (isActive ? " opacity-100" : "")
                    }
                    onMouseEnter={() => setActiveKey(t.key)}
                    onMouseLeave={() => setActiveKey(null)}
                  >
                    {t.value}
                  </span>
                );
              })}
            </p>
          );
        })}
      </div>

      <div
        className={
          "pointer-events-none fixed z-[1000] transition-all duration-200 " +
          (active ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95")
        }
        style={{ left: x, top: y }}
      >
        {active ? (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/85 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/75">
            <div className="p-2">
              <div className="relative h-[160px] w-[280px] overflow-hidden rounded-xl bg-black/5">
                <Image
                  alt={active.title}
                  src={active.imageSrc}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.10),rgba(0,0,0,0.25))]" />
              </div>
              <div className="px-2 pb-2 pt-3">
                <div className="text-sm font-semibold text-[color:var(--fg)]">{active.title}</div>
                {active.subtitle ? (
                  <div className="mt-1 text-xs text-[color:var(--muted)]">{active.subtitle}</div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
