"use client";

import Link from "next/link";

import { CONTACTS } from "@/lib/constants";

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-[color:var(--bg)]/78 p-3 backdrop-blur dark:border-white/10 sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <a
          href={CONTACTS.phoneHref}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          Позвонить
        </a>
        <Link
          href="#cta"
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
        >
          Рассчитать
        </Link>
      </div>
    </div>
  );
}
