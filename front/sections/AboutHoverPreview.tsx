"use client";

import Image from "next/image";


type PreviewItem = {
  key: string;
  label: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
};

export function AboutHoverPreview({
  items,
  paragraphs,
}: {
  items: PreviewItem[];
  paragraphs: string[];
}) {
  return (
    <div className="space-y-6">
      {paragraphs.map((p, idx) => (
        <p key={idx} className="text-sm leading-6 text-[color:var(--muted)]">
          {p}
        </p>
      ))}

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.key} className="border-b border-[color:var(--gray-lines)] pb-6">
            <div className="relative aspect-[4/3] overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)]">
              <Image
                alt={item.title}
                src={item.imageSrc}
                fill
                sizes="(min-width: 1024px) 200px, 50vw"
                className="object-cover"
              />
            </div>
            <div className="mt-1 text-base font-medium text-[color:var(--fg)]">{item.title}</div>
            {item.subtitle && (
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{item.subtitle}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
