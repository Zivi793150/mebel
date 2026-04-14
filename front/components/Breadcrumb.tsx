"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbJsonLd } from "./JsonLd";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

const ROUTE_LABELS: Record<string, string> = {
  "": "Главная",
  about: "О нас",
  catalog: "Каталог",
  designers: "Дизайнерам",
  himchistka: "Химчистка",
  reviews: "Отзывы",
  curtains: "Шторы",
  blinds: "Жалюзи",
  rails: "Карнизы",
  decor: "Декор",
  pillows: "Подушки",
  bedding: "Постельное бельё",
  rugs: "Ковры",
  roman: "Римские шторы",
  aluminum: "Алюминиевые жалюзи",
  wooden: "Деревянные жалюзи",
  metallic: "Металлические карнизы",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [{ label: "Главная", href: "/" }];

  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = ROUTE_LABELS[segment] || segment;
    // Последний элемент без ссылки
    if (segment === segments[segments.length - 1]) {
      items.push({ label });
    } else {
      items.push({ label, href: currentPath });
    }
  });

  // JSON-LD для хлебных крошек
  const jsonLdItems = items
    .filter((item): item is { label: string; href: string } => !!item.href)
    .map((item) => ({
      name: item.label,
      url: `https://koenigroom.ru${item.href}`,
    }));

  return (
    <>
      <BreadcrumbJsonLd items={jsonLdItems} />
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[color:var(--gray-lines)] bg-[color:var(--bg)] py-3"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {index === 0 ? (
                  <Link
                    href="/"
                    className="flex items-center gap-1 text-[color:var(--muted)] transition hover:text-[color:var(--fg)]"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                ) : index === items.length - 1 ? (
                  <span className="font-medium text-[color:var(--fg)]" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href || "/"}
                    className="text-[color:var(--muted)] transition hover:text-[color:var(--fg)]"
                  >
                    {item.label}
                  </Link>
                )}
                {index < items.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-[color:var(--muted)]" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
