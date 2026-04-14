"use client";

import Image from "next/image";
import { Container } from "@/components/Container";
import { CONTACTS } from "@/lib/constants";

type AdvantageItem = {
  number: string;
  title: string;
  description: string;
  videoUrl?: string;
};

const ADVANTAGES: AdvantageItem[] = [
  {
    number: "01",
    title: "Салон недалеко от центра города",
    description: "Просторная парковка рядом. 30 000 образцов тканей в наличии и под заказ.",
  },
  {
    number: "02",
    title: "Собственный цех и производство",
    description: "Профессиональное оборудование, профиля и электрокарнизы под заказ, мастера высокой квалификации.",
  },
  {
    number: "03",
    title: "Премиум качество пошива",
    description: "Качественные нитки и фурнитура, идеальные складки, строчки, швы и идеальный вид на долгие годы.",
  },
  {
    number: "04",
    title: "Гарантия 1 год",
    description: "Мы уверены в качестве наших тканей и пошива, и предоставляем гарантию на готовые изделия сроком 1 год.",
  },
  {
    number: "05",
    title: "Всё берем на себя",
    description: "Подготовка эскизов, производство, пошив и оформление.",
  },
  {
    number: "06",
    title: "Химчистка текстиля",
    description: "Выезд и снятие штор на объекте, чистка, стирка и утюжка, обратный монтаж, вывешивание и отпаривание.",
  },
];

export function Advantages() {
  return (
    <section className="bg-[color:var(--bg)] py-16 sm:py-20">
      <Container>
        <div className="mb-8">
          <span className="inline-block text-2xl font-light tracking-[0.01em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-4xl">
            Салон интерьерного текстиля
          </span>
          <Image
            src="/logo.webp"
            alt="Koenig Room"
            width={320}
            height={200}
            className="ml-2 inline-block sm:ml-4"
            loading="eager"
            priority
          />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((item) => (
            <article
              key={item.number}
              className="group relative bg-[color:var(--bg)] p-6 transition hover:bg-[color:var(--sand)]"
            >
              <div className="flex items-start justify-between border-b border-[color:var(--gray-lines)] pb-4">
                <div className="text-xl font-medium text-[color:var(--fg)]">
                  {item.number}
                </div>
                {item.videoUrl && (
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[color:var(--green)] transition hover:text-[color:var(--fg)]"
                    aria-label="Смотреть видео"
                  >
                    <span>Смотреть</span>
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 0.875C0.55775 0.875 0.375 1.80362 0.375 9.05625C0.375 16.3089 0.55775 17.2375 11 17.2375C21.4423 17.2375 21.625 16.3089 21.625 9.05625C21.625 1.80362 21.4423 0.875 11 0.875ZM14.4053 9.41112L9.63469 11.6381C9.21713 11.8315 8.875 11.6147 8.875 11.1536V6.95887C8.875 6.49881 9.21713 6.281 9.63469 6.47437L14.4053 8.70138C14.8229 8.89688 14.8229 9.21562 14.4053 9.41112Z" fill="currentColor"/>
                    </svg>
                  </a>
                )}
              </div>
              <h3 className="mt-4 text-lg font-medium text-[color:var(--fg)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#cta"
            className="inline-flex h-12 items-center justify-center rounded-none bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]"
          >
            Заказать звонок
          </a>
        </div>
      </Container>
    </section>
  );
}
