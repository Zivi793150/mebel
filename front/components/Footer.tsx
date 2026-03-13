"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACTS, CATALOG_CATEGORIES } from "@/lib/constants";
import { Container } from "@/components/Container";
import { IconInstagram, IconRuTube, IconTelegram, IconTwoGis, IconVK } from "@/components/icons";
import { ThemeToggle } from "@/components/ThemeToggle";

const catalogGroups = [
  {
    title: "КАТАЛОГ ШТОР",
    items: [
      { label: "Шторы для квартиры", href: "/catalog/curtains?g=%D0%BA%D0%BE%D0%BC%D0%BD%D0%B0%D1%82%D0%B0&scroll=1" },
      { label: "Шторы для дома", href: "/catalog/curtains?t=%D0%B7%D0%B0%D0%B3%D0%BE%D1%80%D0%BE%D0%B4&scroll=1" },
      { label: "Шторы для спальни", href: "/catalog/curtains?t=%D1%81%D0%BF%D0%B0%D0%BB%D1%8C%D0%BD%D0%B8&scroll=1" },
      { label: "Шторы для гостиной", href: "/catalog/curtains?t=%D0%B3%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%BE%D0%B9&scroll=1" },
      { label: "Шторы для кухни", href: "/catalog/curtains?t=%D0%BA%D1%83%D1%85%D0%BD%D0%B8&scroll=1" },
      { label: "Римские шторы", href: "/catalog/blinds/roman" },
    ],
  },
  {
    title: "ЖАЛЮЗИ И СИСТЕМЫ",
    items: [
      { label: "Жалюзи", href: "/catalog/blinds" },
      { label: "Рулонные шторы", href: "/catalog/blinds" },
      { label: "Декоративные карнизы", href: "/catalog/rails" },
      { label: "Электрокарнизы", href: "/catalog/blinds/roman?t=%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE&scroll=1&open=1" },
    ],
  },
  {
    title: "ТОВАРЫ",
    items: CATALOG_CATEGORIES.filter(c => ["rugs", "bedding", "pillows", "decor"].includes(c.slug)).map(c => ({
      label: c.title,
      href: `/catalog/${c.slug}`,
    })),
  },
  {
    title: "УСЛУГИ",
    items: [
      { label: "Дизайн штор", href: "/designers" },
      { label: "Пошив штор", href: "/#catalog" },
      { label: "Выезд дизайнера", href: "/designers" },
      { label: "Монтаж карнизов", href: "/#catalog" },
    ],
  },
];

function AccordionSection({ title, items, defaultOpen = false }: { title: string; items: { label: string; href: string }[]; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/5 dark:border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-semibold tracking-wider text-[color:var(--fg)]">{title}</span>
        <span className={`text-[color:var(--muted)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"}`}
      >
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="block text-sm text-[color:var(--muted)] transition hover:text-[color:var(--fg)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer id="contacts" className="border-t border-black/5 dark:border-white/10">
      <Container>
        {/* Аккордеон категорий - мобильный вид */}
        <div className="py-6 md:hidden">
          {catalogGroups.map((group) => (
            <AccordionSection key={group.title} title={group.title} items={group.items} />
          ))}
        </div>

        {/* Десктоп сетка */}
        <div className="hidden gap-8 py-12 md:grid md:grid-cols-12">
          {/* О компании */}
          <div className="md:col-span-4">
            <div className="text-lg font-semibold text-[color:var(--fg)]">
              Koenig Room
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-[color:var(--muted)]">
              Премиальные шторы, жалюзи и интерьерный декор. Подбор, пошив,
              установка — в едином стандарте качества.
            </p>

            <div className="mt-6">
              <a
                href={CONTACTS.telegramHref}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
              >
                Написать в Telegram
              </a>
              <div className="mt-2 text-xs text-[color:var(--muted)]">
                Ответим и предложим 2–3 решения под ваш интерьер
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a
                href={CONTACTS.telegramHref}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5"
                aria-label="Telegram"
              >
                <IconTelegram className="h-5 w-5" />
              </a>
              <a
                href={CONTACTS.vkHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5"
                aria-label="VK"
              >
                <IconVK className="h-5 w-5" />
              </a>
              <a
                href={CONTACTS.rutubeHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5"
                aria-label="RuTube"
              >
                <IconRuTube className="h-5 w-5" />
              </a>
              <a
                href={CONTACTS.twoGisHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5"
                aria-label="2ГИС"
              >
                <IconTwoGis className="h-5 w-5" />
              </a>
              {CONTACTS.instagramHref ? (
                <a
                  href={CONTACTS.instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5"
                  aria-label="Instagram"
                >
                  <IconInstagram className="h-5 w-5" />
                </a>
              ) : null}
              <a
                href={CONTACTS.phoneHref}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 px-3 text-sm text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5"
              >
                {CONTACTS.phoneDisplay}
              </a>
              <div className="h-10"><ThemeToggle /></div>
            </div>
            <div className="mt-2 text-xs text-[color:var(--muted)]">{CONTACTS.address}</div>
            {CONTACTS.instagramHref ? (
              <div className="mt-1 text-[10px] text-[color:var(--muted)]">Instagram — запрещённая соцсеть на территории РФ</div>
            ) : null}
          </div>

          {/* Каталог штор */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-wider text-[color:var(--fg)]">КАТАЛОГ ШТОР</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {catalogGroups[0].items.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[color:var(--muted)] hover:text-[color:var(--fg)] transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Жалюзи и системы */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-wider text-[color:var(--fg)]">ЖАЛЮЗИ И СИСТЕМЫ</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {catalogGroups[1].items.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[color:var(--muted)] hover:text-[color:var(--fg)] transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Товары */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-wider text-[color:var(--fg)]">ТОВАРЫ</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {catalogGroups[2].items.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[color:var(--muted)] hover:text-[color:var(--fg)] transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Навигация */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-wider text-[color:var(--fg)]">НАВИГАЦИЯ</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="text-[color:var(--muted)] hover:text-[color:var(--fg)] transition">Главная</Link></li>
              <li><Link href="/catalog" className="text-[color:var(--muted)] hover:text-[color:var(--fg)] transition">Каталог</Link></li>
              <li><Link href="/designers" className="text-[color:var(--fg)] hover:opacity-90">Дизайнерам</Link></li>
              <li><Link href="/about" className="text-[color:var(--muted)] hover:text-[color:var(--fg)] transition">О нас</Link></li>
              <li><Link href="/contacts" className="text-[color:var(--muted)] hover:text-[color:var(--fg)] transition">Контакты</Link></li>
            </ul>
          </div>
        </div>

        {/* Мобильная навигация под аккордеоном */}
        <div className="border-t border-black/5 py-6 md:hidden">
          <h3 className="mb-4 text-xs font-semibold tracking-wider text-[color:var(--fg)]">НАВИГАЦИЯ</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/" className="text-[color:var(--muted)]">Главная</Link>
            <Link href="/catalog" className="text-[color:var(--muted)]">Каталог</Link>
            <Link href="/designers" className="text-[color:var(--fg)] font-medium">Дизайнерам</Link>
            <Link href="/about" className="text-[color:var(--muted)]">О нас</Link>
            <Link href="/contacts" className="text-[color:var(--muted)]">Контакты</Link>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a href={CONTACTS.telegramHref} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5">
              <IconTelegram className="h-5 w-5" />
            </a>
            <a href={CONTACTS.vkHref} target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5">
              <IconVK className="h-5 w-5" />
            </a>
            <a href={CONTACTS.rutubeHref} target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5">
              <IconRuTube className="h-5 w-5" />
            </a>
            <a href={CONTACTS.twoGisHref} target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5">
              <IconTwoGis className="h-5 w-5" />
            </a>
            {CONTACTS.instagramHref ? (
              <a href={CONTACTS.instagramHref} target="_blank" rel="noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5">
                <IconInstagram className="h-5 w-5" />
              </a>
            ) : null}
            <a href={CONTACTS.phoneHref} className="inline-flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white/70 px-4 text-sm dark:border-white/10 dark:bg-white/5">
              {CONTACTS.phoneDisplay}
            </a>
          </div>
          <div className="mt-3 text-xs text-[color:var(--muted)]">{CONTACTS.address}</div>
          {CONTACTS.instagramHref ? (
            <div className="mt-1 text-[10px] text-[color:var(--muted)]">Instagram — запрещённая соцсеть на территории РФ</div>
          ) : null}
          <div className="mt-4"><ThemeToggle /></div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col gap-2 border-t border-black/5 py-6 text-xs text-[color:var(--muted)] dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Koenig Room</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[color:var(--fg)]">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-[color:var(--fg)]">
              Публичная оферта
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
