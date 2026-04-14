"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatarSrc?: string;
};

type MarqueeItem =
  | {
      kind: "testimonial";
      t: Testimonial;
    }
  | {
      kind: "photo";
      id: string;
      imageSrc: string;
    };

function Column({
  items,
  speed,
  className,
}: {
  items: MarqueeItem[];
  speed: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [offsetPct, setOffsetPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    let lastTs = 0;

    const tick = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const dt = Math.min(50, ts - lastTs);
      lastTs = ts;

      setOffsetPct((p) => {
        const next = p + (dt * speed) / 1000;
        return next % 50;
      });

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [speed]);

  const doubled = useMemo(() => items.concat(items), [items]);

  return (
    <div ref={wrapRef} className={"overflow-hidden " + (className ?? "")}>
      <ul
        className="m-0 flex list-none flex-col gap-6 bg-transparent p-0 pb-6"
        style={{ transform: `translateY(-${offsetPct}%)` }}
      >
        {doubled.map((t, idx) => (
          <li key={(t.kind === "photo" ? t.id : t.t.name) + idx} className="max-w-xs w-full">
            {t.kind === "photo" ? (
              <div className="relative overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image alt="" src={t.imageSrc} fill sizes="320px" className="object-cover" />
                </div>
              </div>
            ) : (
              <div
                tabIndex={0}
                className="cursor-default select-none border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-6 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30"
              >
                <blockquote className="m-0 p-0">
                  <p className="m-0 text-sm leading-relaxed text-[color:var(--muted)]">
                    {t.t.quote}
                  </p>
                  <footer className="mt-4 flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden border border-[color:var(--gray-lines)]">
                      {t.t.avatarSrc ? (
                        <Image
                          alt={"Avatar of " + t.t.name}
                          src={t.t.avatarSrc}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[color:var(--card)] text-xs font-semibold text-[color:var(--muted)]">
                          {t.t.name
                            .split(" ")
                            .slice(0, 2)
                            .map((s) => s[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <cite className="not-italic text-sm font-medium leading-5 text-[color:var(--fg)]">
                        {t.t.name}
                      </cite>
                      <span className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">
                        {t.t.role}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReviewsMarquee({
  testimonials,
  photoCards,
  columns = 3,
}: {
  testimonials: Testimonial[];
  photoCards?: string[];
  columns?: 1 | 2 | 3;
}) {
  const cols = useMemo(() => {
    const insertEvery = 3;
    const photo = (photoCards ?? []).filter(Boolean);

    const mix: MarqueeItem[] = [];
    let photoIdx = 0;
    testimonials.forEach((t, idx) => {
      mix.push({ kind: "testimonial", t });
      if (photo.length > 0 && (idx + 1) % insertEvery === 0) {
        const src = photo[photoIdx % photo.length]!;
        mix.push({ kind: "photo", id: "p-" + idx + "-" + photoIdx, imageSrc: src });
        photoIdx += 1;
      }
    });

    const c: MarqueeItem[][] = Array.from({ length: columns }, () => []);
    mix.forEach((it, idx) => c[idx % columns].push(it));
    return c;
  }, [columns, photoCards, testimonials]);

  const speeds = useMemo(() => {
    const base = 2;
    if (columns === 1) return [base];
    if (columns === 2) return [base, base * 1.25];
    return [base, base * 1.35, base * 1.1];
  }, [columns]);

  return (
    <div
      className="flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
      role="region"
      aria-label="Scrolling Testimonials"
    >
      <Column items={cols[0] ?? []} speed={speeds[0] ?? 10} className="w-full max-w-xs" />
      {columns >= 2 ? (
        <Column items={cols[1] ?? []} speed={speeds[1] ?? 12} className="hidden w-full max-w-xs md:block" />
      ) : null}
      {columns >= 3 ? (
        <Column items={cols[2] ?? []} speed={speeds[2] ?? 11} className="hidden w-full max-w-xs lg:block" />
      ) : null}
    </div>
  );
}
