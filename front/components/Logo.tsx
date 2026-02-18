import Image from "next/image";
import Link from "next/link";

import { BRAND } from "@/lib/constants";

export function Logo() {
  return (
    <Link
      href="#top"
      className="group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
      aria-label={BRAND.name}
    >
      <span className="relative h-9 w-9 overflow-hidden rounded-xl border border-black/10 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
        <Image
          src="/logo.png"
          alt={BRAND.name}
          fill
          sizes="36px"
          className="object-contain p-1"
          priority
        />
      </span>
      <span className="text-sm font-semibold tracking-wide text-[color:var(--fg)] group-hover:opacity-90">
        {BRAND.name}
      </span>
    </Link>
  );
}
