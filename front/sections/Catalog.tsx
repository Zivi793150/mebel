import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/Container";
import { CATALOG_CATEGORIES } from "@/lib/constants";

export function Catalog() {
  return (
    <section id="catalog" className="pb-14 pt-8 sm:pb-18 sm:pt-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
              ЧТО МЫ ПРЕДЛАГАЕМ
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
              Каталог
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Полный ассортимент Koenig Room. Быстро покажем категории и дальше
              сфокусируемся на самом сильном — шторах.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Link
              href="#cta"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            >
              Подобрать решение
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-4 lg:gap-y-14">
          {CATALOG_CATEGORIES.map((c, idx) => (
            <div key={c.title} className="group">
              <div
                className={`relative h-[380px] overflow-hidden rounded-lg border border-black/10 bg-white/25 shadow-sm transition-[transform,height,background-color,box-shadow] duration-500 dark:border-white/10 dark:bg-white/[0.03] group-hover:h-[460px] ${
                  c.emphasis ? "border-[color:var(--accent)]/40" : ""
                } group-hover:-translate-y-0.5 group-hover:bg-white/35 group-hover:shadow-md dark:group-hover:bg-white/[0.06]`}
              >
                <Image
                  src={c.imageSrc}
                  alt={c.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_70%)] opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex min-h-[168px] flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold tracking-[0.28em] text-white/70">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="h-px flex-1 bg-white/20" />
                    </div>

                    <div className="mt-3 min-h-[3.25rem] text-lg font-semibold leading-tight tracking-tight text-white">
                      {c.title}
                    </div>

                    <div className="mt-2 max-h-0 overflow-hidden text-sm leading-6 text-white/80 opacity-0 transition-[max-height,opacity] duration-500 group-hover:max-h-28 group-hover:opacity-100">
                      {c.description}
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="inline-flex h-10 items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition group-hover:opacity-95">
                        Заказать <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
