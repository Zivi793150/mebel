"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { BRAND, CONTACTS, NAV_LINKS } from "@/lib/constants";
import { Container } from "@/components/Container";
import { IconInstagram, IconRuTube, IconTelegram, IconTwoGis, IconVK } from "@/components/icons";

export function Header() {
  const [compact, setCompact] = useState(false);
  const [invert, setInvert] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  function handleNavClick(
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
    opts?: { closeMenu?: boolean },
  ) {
    const closeMenu = opts?.closeMenu ?? false;
    const isHashRoute = href.startsWith("/#");
    if (isHashRoute && pathname === "/") {
      e.preventDefault();
      const hash = href.slice(1);
      const id = hash.startsWith("#") ? hash : null;
      const target = id ? document.querySelector(id) : null;
      if (target instanceof HTMLElement) {
        history.pushState(null, "", hash);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (closeMenu) setMobileOpen(false);
      return;
    }

    if (closeMenu) setMobileOpen(false);
  }

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
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

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
            compact
              ? "mt-3 max-w-[1120px] scale-[0.985] rounded-2xl border border-black/10 bg-[color:var(--bg)]/55 supports-[backdrop-filter]:bg-[color:var(--bg)]/55 shadow-[0_18px_60px_rgba(0,0,0,0.10)] dark:border-white/10"
              : "max-w-[100%] border-b border-black/5 bg-transparent shadow-none dark:border-white/10"
          }`}
        >
          <Container>
            <div className="relative flex h-16 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-4">
                <Link
                  href="/#top"
                  className={`shrink-0 text-sm font-semibold tracking-wide transition hover:opacity-80 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                    invert ? "text-white" : "text-[color:var(--fg)]"
                  }`}
                  aria-label="Наверх"
                >
                  {BRAND.name}
                </Link>

                <nav className="hidden items-center gap-1 lg:flex">
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => handleNavClick(e, l.href)}
                      className={`group inline-flex items-center rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] ${
                        invert
                          ? "text-white/80 hover:text-white"
                          : "text-[color:var(--muted)] hover:text-[color:var(--fg)]"
                      }`}
                    >
                      <span className="relative">
                        {l.label}
                        <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--accent)] transition-transform duration-300 group-hover:scale-x-100" />
                      </span>
                    </a>
                  ))}
                </nav>
              </div>

              <div className="flex flex-nowrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileOpen((v) => !v)}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 lg:hidden ${
                    invert ? "text-white border-white/15 bg-white/5 hover:bg-white/10" : ""
                  }`}
                  aria-label="Открыть меню"
                >
                  <span className="relative block h-4 w-5" aria-hidden="true">
                    <span className="absolute left-0 top-0 h-0.5 w-5 rounded bg-current" />
                    <span className="absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current" />
                    <span className="absolute left-0 top-3 h-0.5 w-5 rounded bg-current" />
                  </span>
                </button>

                <a
                  href={CONTACTS.telegramHref}
                  className={`hidden shrink-0 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 sm:inline-flex ${
                    invert ? "text-white border-white/15 bg-white/5 hover:bg-white/10" : ""
                  }`}
                  aria-label="Написать в Telegram"
                >
                  <IconTelegram className="h-4 w-4" />
                  Telegram
                </a>

                <div className="hidden items-center gap-1 sm:flex">
                  <a
                    href={CONTACTS.vkHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 ${
                      invert ? "text-white border-white/15 bg-white/5 hover:bg-white/10" : ""
                    }`}
                    aria-label="VK"
                  >
                    <IconVK className="h-5 w-5" />
                  </a>
                  <a
                    href={CONTACTS.rutubeHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 ${
                      invert ? "text-white border-white/15 bg-white/5 hover:bg-white/10" : ""
                    }`}
                    aria-label="RuTube"
                  >
                    <IconRuTube className="h-5 w-5" />
                  </a>
                  <a
                    href={CONTACTS.twoGisHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 ${
                      invert ? "text-white border-white/15 bg-white/5 hover:bg-white/10" : ""
                    }`}
                    aria-label="2ГИС"
                  >
                    <IconTwoGis className="h-5 w-5" />
                  </a>
                  {CONTACTS.instagramHref ? (
                    <a
                      href={CONTACTS.instagramHref}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 ${
                        invert ? "text-white border-white/15 bg-white/5 hover:bg-white/10" : ""
                      }`}
                      aria-label="Instagram"
                    >
                      <IconInstagram className="h-5 w-5" />
                    </a>
                  ) : null}
                </div>

                <Link
                  href="/#cta"
                  className={`ml-2 hidden h-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] sm:inline-flex ${
                    invert ? "bg-white text-[#0b1220]" : ""
                  }`}
                >
                  Рассчитать
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-white text-[color:var(--fg)] dark:bg-[#0e1116]">
            <div className="flex h-full flex-col pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
              <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 dark:border-white/10">
                <div className="text-sm font-semibold tracking-wide">{BRAND.name}</div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-black/[0.03] text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                  aria-label="Закрыть"
                >
                  ✕
                </button>
              </div>

              <nav className="flex-1 overflow-auto px-5 py-5">
                <div className="grid gap-2">
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => handleNavClick(e, l.href, { closeMenu: true })}
                      className="inline-flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4 text-base font-semibold transition hover:bg-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
                    >
                      {l.label}
                      <span className="text-[color:var(--muted)]" aria-hidden="true">
                        →
                      </span>
                    </a>
                  ))}
                </div>
              </nav>

              <div className="border-t border-black/5 px-5 py-4 dark:border-white/10">
                <div className="grid gap-3">
                  <a
                    href="/#cta"
                    onClick={(e) => handleNavClick(e, "/#cta", { closeMenu: true })}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  >
                    Рассчитать стоимость
                  </a>
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <IconTelegram className="h-4 w-4" />
                    Написать в Telegram
                  </a>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={CONTACTS.vkHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                      aria-label="VK"
                    >
                      <IconVK className="h-5 w-5" />
                    </a>
                    <a
                      href={CONTACTS.rutubeHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                      aria-label="RuTube"
                    >
                      <IconRuTube className="h-5 w-5" />
                    </a>
                    <a
                      href={CONTACTS.twoGisHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                      aria-label="2ГИС"
                    >
                      <IconTwoGis className="h-5 w-5" />
                    </a>
                    {CONTACTS.instagramHref ? (
                      <a
                        href={CONTACTS.instagramHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                        aria-label="Instagram"
                      >
                        <IconInstagram className="h-5 w-5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
