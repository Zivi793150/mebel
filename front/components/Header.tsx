"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { BRAND, CATALOG_CATEGORIES, CONTACTS, NAV_LINKS } from "@/lib/constants";
import { Container } from "@/components/Container";
import { IconInstagram, IconWhatsapp } from "@/components/icons";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const [compact, setCompact] = useState(false);
  const [invert, setInvert] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogRender, setCatalogRender] = useState(false);
  const [catalogClosing, setCatalogClosing] = useState(false);
  const [catalogTop, setCatalogTop] = useState<number>(64);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const unmountTimerRef = useRef<number | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function isDarkUnderHeader() {
      if (window.scrollY <= 8) return false;
      if (compact) return false;

      const headerEl = barRef.current;
      const y = Math.max(1, Math.round((headerEl?.getBoundingClientRect().height ?? 64) / 2));
      const x = Math.round(window.innerWidth / 2);
      const stack = document.elementsFromPoint(x, y);

      for (const el of stack) {
        let cur: HTMLElement | null = el as HTMLElement;
        while (cur) {
          if (cur.id === "top") return true;
          if (cur.classList?.contains("kr-dark-section")) return true;
          if (cur.classList?.contains("kr-bw-section")) return true;
          if (cur.classList?.contains("kr-header-invert")) return true;
          cur = cur.parentElement;
        }
      }

      return false;
    }

    function onScroll() {
      setCompact(window.scrollY > 24);
      setInvert(isDarkUnderHeader());
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [compact]);

  useEffect(() => {
    if (!catalogOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setCatalogOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [catalogOpen]);

  useEffect(() => {
    function updateTop() {
      const el = barRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setCatalogTop(Math.round(rect.bottom));
    }

    updateTop();
    window.addEventListener("scroll", updateTop, { passive: true });
    window.addEventListener("resize", updateTop);
    return () => {
      window.removeEventListener("scroll", updateTop);
      window.removeEventListener("resize", updateTop);
    };
  }, []);

  function clearTimers() {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    if (unmountTimerRef.current) window.clearTimeout(unmountTimerRef.current);
    openTimerRef.current = null;
    closeTimerRef.current = null;
    unmountTimerRef.current = null;
  }

  function scheduleOpen() {
    clearTimers();
    openTimerRef.current = window.setTimeout(() => setCatalogOpen(true), 80);
  }

  function scheduleClose() {
    clearTimers();
    closeTimerRef.current = window.setTimeout(() => setCatalogOpen(false), 140);
  }

  useEffect(() => {
    if (catalogOpen) {
      setCatalogClosing(false);
      setCatalogRender(true);
      if (unmountTimerRef.current) {
        window.clearTimeout(unmountTimerRef.current);
        unmountTimerRef.current = null;
      }
      return;
    }

    if (!catalogRender) return;
    setCatalogClosing(true);
    unmountTimerRef.current = window.setTimeout(() => {
      setCatalogRender(false);
      setCatalogClosing(false);
      unmountTimerRef.current = null;
    }, 920);
  }, [catalogOpen, catalogRender]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`relative ${
          compact
            ? "bg-[color:var(--bg)]/55 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]/55"
            : "bg-transparent"
        }`}
      >
        <div
          ref={barRef}
          className={`relative left-1/2 w-full -translate-x-1/2 transition-[max-width,margin,transform,border-radius,box-shadow,background-color,border-color] duration-500 ease-out will-change-transform ${
            compact && !catalogRender
              ? "mt-3 max-w-[1120px] scale-[0.985] rounded-2xl border border-black/10 bg-[color:var(--bg)]/55 supports-[backdrop-filter]:bg-[color:var(--bg)]/55 shadow-[0_18px_60px_rgba(0,0,0,0.10)] dark:border-white/10"
              : "max-w-[100%] border-b border-black/5 bg-transparent shadow-none dark:border-white/10"
          }`}
        >
          <Container>
            <div className="relative flex h-16 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-4">
                <Link
                  href="#top"
                  className={`shrink-0 text-sm font-semibold tracking-wide transition hover:opacity-80 ${
                    invert ? "text-white" : "text-[color:var(--fg)]"
                  }`}
                  aria-label="Наверх"
                >
                  {BRAND.name}
                </Link>

                <nav
                  className="hidden items-center gap-1 lg:flex"
                  onMouseLeave={() => scheduleClose()}
                >
                  {NAV_LINKS.map((l) => {
                    const isCatalog = l.href === "#catalog";
                    return (
                      <div
                        key={l.href}
                        className="relative"
                        onMouseEnter={() => {
                          if (isCatalog) scheduleOpen();
                          else setCatalogOpen(false);
                        }}
                        onMouseLeave={() => {
                          if (isCatalog) scheduleClose();
                        }}
                      >
                        <Link
                          href={l.href}
                          className={`group inline-flex items-center rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] ${
                            invert
                              ? "text-white/80 hover:text-white"
                              : "text-[color:var(--muted)] hover:text-[color:var(--fg)]"
                          } ${isCatalog ? "" : ""}`}
                        >
                          <span className="relative">
                            {l.label}
                            <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--accent)] transition-transform duration-300 group-hover:scale-x-100" />
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </nav>
              </div>

              <div className="flex flex-nowrap items-center gap-2">
                <a
                  href={CONTACTS.phoneHref}
                  className={`hidden shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:hover:bg-white/10 sm:inline-flex ${
                    invert ? "text-white hover:bg-white/10" : "text-[color:var(--fg)]"
                  }`}
                  aria-label={`Позвонить: ${CONTACTS.phoneDisplay}`}
                >
                  {CONTACTS.phoneDisplay}
                </a>

              <a
                href={`mailto:${CONTACTS.email}`}
                className={`hidden shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-sm hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:hover:bg-white/10 lg:inline-flex ${
                  invert
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : "text-[color:var(--muted)] hover:text-[color:var(--fg)]"
                }`}
                aria-label={`Написать: ${CONTACTS.email}`}
              >
                {CONTACTS.email}
              </a>

              <div className="hidden items-center gap-1 sm:flex">
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  aria-label="Instagram"
                >
                  <IconInstagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  aria-label="WhatsApp"
                >
                  <IconWhatsapp className="h-5 w-5" />
                </a>
              </div>

              <ThemeToggle />

              <Link
                href="#cta"
                className={`ml-2 hidden h-16 items-center justify-center px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] sm:inline-flex -mr-4 sm:-mr-6 lg:-mr-8 ${
                  compact
                    ? "rounded-r-2xl bg-[color:var(--accent)]"
                    : "rounded-none bg-[color:var(--accent)]"
                }`}
              >
                Рассчитать
              </Link>
            </div>
          </div>
          </Container>

        </div>
      </div>

      {catalogRender ? (
        <div
          className={`pointer-events-none fixed left-0 right-0 hidden lg:block`}
          style={{ top: catalogTop }}
          onMouseEnter={() => {
            clearTimers();
            setCatalogOpen(true);
          }}
          onMouseLeave={() => scheduleClose()}
        >
          <div
            className={`pointer-events-auto w-full border-t border-black/5 bg-[color:var(--bg)]/55 supports-[backdrop-filter]:bg-[color:var(--bg)]/55 shadow-[0_18px_60px_rgba(0,0,0,0.12)] backdrop-blur transition-[opacity,transform] duration-[520ms] ease-out dark:border-white/10 transform-gpu ${
              catalogOpen && !catalogClosing
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          >
            <div className="mx-auto w-full px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {CATALOG_CATEGORIES.map((c, idx) => (
                  <Link
                    key={c.title}
                    href="#catalog"
                    className={`group flex-none rounded-xl px-2 py-2 text-sm font-semibold text-[color:var(--fg)] transition hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]`}
                    style={{
                      animationName:
                        catalogOpen && !catalogClosing
                          ? ("kr-snap-in" as any)
                          : ("kr-snap-out" as any),
                      animationDuration: "520ms",
                      animationTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      animationFillMode: "both",
                      animationDelay: `${Math.min(idx * 55, 330)}ms`,
                    }}
                  >
                    <span className="relative">
                      {c.title}
                      <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--accent)] transition-transform duration-300 group-hover:scale-x-100" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
