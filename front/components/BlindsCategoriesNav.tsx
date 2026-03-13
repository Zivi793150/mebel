"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { BlindsTypeModal, type BlindsTypeItem } from "@/components/BlindsTypesCatalog";

type CategoryCard = {
  subslug: string;
  title: string;
  text: string;
  imageIdx: number;
};

function matchSubslug(subslug: string, item: BlindsTypeItem) {
  const s = `${subslug}`.toLowerCase();
  const t = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  if (s === "wood") return /(дерев|бамбук)/i.test(t);
  if (s === "aluminum") return /(алюм|металл)/i.test(t);
  if (s === "pleated") return /(плиссе|plisse|pliss|плис)/i.test(t);
  if (s === "roller") return /(рулон|рол|кассет|зебра|день\s*ночь)/i.test(t);
  if (s === "roman") return /(римск)/i.test(t);
  return false;
}

export function BlindsCategoriesNav({
  categories,
  koenigImages,
  items,
}: {
  categories: CategoryCard[];
  koenigImages: string[];
  items: BlindsTypeItem[];
}) {
  const cleaned = useMemo(() => {
    return (items || [])
      .filter((i) => i && i.url)
      .map((i) => ({
        ...i,
        title: String(i.title || "").trim(),
        description: String(i.description || "").trim(),
      }));
  }, [items]);

  const [active, setActive] = useState<BlindsTypeItem | null>(null);

  function openForSubslug(subslug: string) {
    const matched = cleaned.filter((it) => matchSubslug(subslug, it));
    setActive((matched[0] || cleaned[0]) ?? null);
  }

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const img = koenigImages[c.imageIdx % Math.max(1, koenigImages.length)] || "/catalog/blinds.jpg";
          return (
            <button
              key={c.subslug}
              type="button"
              onClick={() => openForSubslug(c.subslug)}
              className="block text-left"
              aria-label={c.title}
            >
              <div className="group h-full overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={img}
                    alt={c.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-[transform,filter] duration-300 ease-in-out group-hover:scale-[1.05] group-hover:saturate-[1.06]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.14),rgba(0,0,0,0.50))]" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">{c.title}</div>
                      <div className="mt-1 text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ТИП</div>
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
                  <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{c.text}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {active ? <BlindsTypeModal item={active} onClose={() => setActive(null)} /> : null}
    </>
  );
}
