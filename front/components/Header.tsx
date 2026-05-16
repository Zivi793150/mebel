"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { BRAND, CATALOG_CATEGORIES, CONTACTS, NAV_LINKS } from "@/lib/constants";
import { Container } from "@/components/Container";
import { ContactButton } from "@/components/ContactButton";
import { IconInstagram, IconMax, IconRuTube, IconTelegram, IconTwoGis, IconVK } from "@/components/icons";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const catalogTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const dropdownGroups = [
    {
      title: "КАТАЛОГ ШТОР",
      items: [
        {
          label: "Шторы для квартиры",
          href: "/catalog/curtains?g=%D0%BA%D0%BE%D0%BC%D0%BD%D0%B0%D1%82%D0%B0&scroll=1",
        },
        { label: "Шторы для дома", href: "/catalog/curtains?t=%D0%B7%D0%B0%D0%B3%D0%BE%D1%80%D0%BE%D0%B4&scroll=1" },
        { label: "Шторы для спальни", href: "/catalog/curtains?t=%D1%81%D0%BF%D0%B0%D0%BB%D1%8C%D0%BD%D0%B8&scroll=1" },
        { label: "Шторы для гостиной", href: "/catalog/curtains?t=%D0%B3%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%BE%D0%B9&scroll=1" },
        { label: "Шторы для кухни", href: "/catalog/curtains?t=%D0%BA%D1%83%D1%85%D0%BD%D0%B8&scroll=1" },
        { label: "Римские шторы", href: "/catalog/roman" },
      ],
    },
    {
      title: "ЖАЛЮЗИ И СИСТЕМЫ",
      items: [
        { label: "Жалюзи", href: "/catalog/blinds" },
        { label: "Рулонные шторы", href: "/catalog/blinds" },
        { label: "Декоративные карнизы", href: "/catalog/rails" },
        { label: "Электрокарнизы", href: "/electro" },
      ],
    },
    {
      title: "ТОВАРЫ",
      items: CATALOG_CATEGORIES.filter((c) =>
        ["rugs", "bedding", "pillows", "decor"].includes(c.slug),
      ).map((c) => ({
        label: c.title,
        href: `/catalog/${c.slug}`,
      })),
    },
  ];

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

  function openCatalog() {
    if (catalogTimeoutRef.current) clearTimeout(catalogTimeoutRef.current);
    setCatalogOpen(true);
  }

  function closeCatalog() {
    catalogTimeoutRef.current = setTimeout(() => setCatalogOpen(false), 150);
  }

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
      <div className="relative">
        <div
          ref={barRef}
          className="border-b border-[color:var(--gray-lines)] bg-[color:var(--bg)]"
        >
          <div className="mx-auto w-full max-w-[90rem] px-2 sm:px-4 lg:px-6">
            <div className="relative flex h-16 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-10 xl:gap-20">
                <Link
                  href="/#top"
                  className="shrink-0 transition hover:opacity-80 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  aria-label="На главную"
                >
                  <img src="/logo.webp" alt={BRAND.name} className="h-10 w-auto object-contain dark:invert" />
                </Link>

                <nav className="relative hidden items-center gap-0.5 xl:flex" onMouseLeave={closeCatalog}>
                  {NAV_LINKS.map((l) => {
                    const isCatalog = l.href === "/#catalog";
                    return (
                      <a
                        key={l.href}
                        href={l.href}
                        onMouseEnter={isCatalog ? openCatalog : closeCatalog}
                        onClick={(e) => handleNavClick(e, l.href)}
                        className="group inline-flex items-center gap-1 px-3 py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      >
                        <span className="relative">
                          {l.label}
                          <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--accent)] transition-transform duration-300 group-hover:scale-x-100" />
                        </span>
                        {isCatalog && (
                          <svg
                            className={`h-3 w-3 transition-transform duration-200 ${catalogOpen ? "rotate-180" : ""}`}
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </a>
                    );
                  })}

                  {catalogOpen ? (
                    <div
                      className="fixed left-0 right-0 top-16 z-50 animate-[slideDown_0.2s_ease-out]"
                      onMouseEnter={openCatalog}
                      onMouseLeave={closeCatalog}
                    >
                      <style jsx>{`
                        @keyframes slideDown {
                          from {
                            opacity: 0;
                            transform: translateY(-10px);
                          }
                          to {
                            opacity: 1;
                            transform: translateY(0);
                          }
                        }
                      `}</style>
                      <div className="border-b border-[color:var(--gray-lines)] bg-[color:var(--bg)] shadow-xl">
                        <div className="mx-auto flex max-w-7xl gap-10 border-t border-[color:var(--gray-lines)] px-2 py-9 sm:px-4 lg:px-6">
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium tracking-wider text-[color:var(--fg)]">
                              КАТЕГОРИИ
                            </div>
                            <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
                              {CATALOG_CATEGORIES.map((cat) => (
                                <li key={cat.slug}>
                                  <a
                                    href={`/catalog/${cat.slug}`}
                                    className="text-sm text-[color:var(--muted)] transition hover:text-[color:var(--fg)]"
                                  >
                                    {cat.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="shrink-0">
                            <div className="flex gap-8">
                              {dropdownGroups.map((g) => (
                                <div key={g.title} className="min-w-[140px]">
                                  <div className="text-xs font-medium tracking-wider text-[color:var(--fg)]">
                                    {g.title}
                                  </div>
                                  <ul className="mt-3 space-y-2 text-sm">
                                    {g.items.map((item) => (
                                      <li key={item.label}>
                                        <a
                                          href={item.href}
                                          className="text-[color:var(--muted)] transition hover:text-[color:var(--fg)]"
                                        >
                                          {item.label}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </nav>
              </div>

              <div className="flex flex-nowrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileOpen((v) => !v)}
                  className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] lg:hidden"
                  aria-label="Открыть меню"
                >
                  <span className="relative block h-4 w-5" aria-hidden="true">
                    <span className="absolute left-0 top-0 h-0.5 w-5 bg-current" />
                    <span className="absolute left-0 top-1.5 h-0.5 w-5 bg-current" />
                    <span className="absolute left-0 top-3 h-0.5 w-5 bg-current" />
                  </span>
                </button>

                <a
                  href={CONTACTS.telegramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  aria-label="Telegram"
                >
                  <IconTelegram className="h-5 w-5" />
                </a>

                <div className="hidden items-center gap-1.5 sm:flex">
                  <a
                    href={CONTACTS.vkHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    aria-label="VK"
                  >
                    <IconVK className="h-5 w-5" />
                  </a>
                  <a
                    href={CONTACTS.rutubeHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    aria-label="RuTube"
                  >
                    <IconRuTube className="h-5 w-5" />
                  </a>
                  <a
                    href={CONTACTS.twoGisHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    aria-label="2ГИС"
                  >
                    <IconTwoGis className="h-5 w-5" />
                  </a>
                  {CONTACTS.instagramHref ? (
                    <a
                      href={CONTACTS.instagramHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      aria-label="Instagram"
                    >
                      <IconInstagram className="h-5 w-5" />
                    </a>
                  ) : null}
                  {CONTACTS.maxHref ? (
                    <a
                      href={CONTACTS.maxHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      aria-label="MAX"
                    >
                      <IconMax className="h-5 w-5" />
                    </a>
                  ) : null}
                </div>

                <ContactButton
                  className="ml-2 hidden h-11 items-center justify-center bg-[color:var(--accent)] px-5 text-sm font-medium text-[color:var(--accent-contrast)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] sm:inline-flex"
                  imageSrc="/foto-na-knopku-1-.webp"
                >
                  Рассчитать
                </ContactButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[color:var(--bg)] text-[color:var(--fg)]">
            <div className="flex h-full flex-col pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
              <div className="flex items-center justify-between border-b border-[color:var(--gray-lines)] px-5 py-4">
                <Link
                  href="/#top"
                  onClick={() => setMobileOpen(false)}
                  className="shrink-0 transition hover:opacity-80 focus:outline-none"
                >
                  <img src="/logo.webp" alt={BRAND.name} className="h-9 w-auto object-contain dark:invert" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
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
                      className="inline-flex items-center justify-between border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-4 py-4 text-base font-medium transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    >
                      {l.label}
                      <span className="text-[color:var(--muted)]" aria-hidden="true">
                        →
                      </span>
                    </a>
                  ))}
                </div>
              </nav>

              <div className="border-t border-[color:var(--gray-lines)] px-5 py-4">
                <div className="grid gap-3">
                  <ContactButton
                    className="inline-flex h-12 items-center justify-center bg-[color:var(--accent)] px-5 text-sm font-medium text-[color:var(--accent-contrast)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    imageSrc="/foto-na-knopku-1-.webp"
                  >
                    Рассчитать стоимость
                  </ContactButton>
                  <ContactButton
                    className="inline-flex h-12 items-center justify-center gap-2 border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-5 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    imageSrc="/foto-na-knopku-1-.webp"
                  >
                    Написать нам
                  </ContactButton>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <a
                      href={CONTACTS.vkHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 w-12 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      aria-label="VK"
                    >
                      <IconVK className="h-5 w-5" />
                    </a>
                    <a
                      href={CONTACTS.rutubeHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 w-12 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      aria-label="RuTube"
                    >
                      <IconRuTube className="h-5 w-5" />
                    </a>
                    <a
                      href={CONTACTS.twoGisHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 w-12 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      aria-label="2ГИС"
                    >
                      <IconTwoGis className="h-5 w-5" />
                    </a>
                    {CONTACTS.instagramHref ? (
                      <a
                        href={CONTACTS.instagramHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-12 w-12 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                        aria-label="Instagram"
                      >
                        <IconInstagram className="h-5 w-5" />
                      </a>
                    ) : null}
                    {CONTACTS.maxHref ? (
                      <a
                        href={CONTACTS.maxHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-12 w-12 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                        aria-label="MAX"
                      >
                        <IconMax className="h-5 w-5" />
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
