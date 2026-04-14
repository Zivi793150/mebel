"use client";

import Image from "next/image";
import { Container } from "@/components/Container";

type ServiceItem = {
  title: string;
  description: string;
  imageSrc: string;
};

const SERVICES: ServiceItem[] = [
  {
    title: "Дизайн штор",
    description: "Визуализация эскизов, подбор материалов и фурнитуры под Ваш бюджет",
    imageSrc: "/predlagaem/dizayn-shtor_1238.webp",
  },
  {
    title: "Оформление текстилем",
    description: "Все виды текстиля, интерьерный и брендированный текстиль",
    imageSrc: "/predlagaem/oformlenie-tekstilem-11.webp",
  },
  {
    title: "Электрокарнизы",
    description: "Устройства для дистанционного управления шторами и жалюзями",
    imageSrc: "/predlagaem/elektrokarnizy-.webp",
  },
  {
    title: "Солнцезащитные системы",
    description: "Рулонные шторы, Шторы-плиссе, Деревянные и Алюминиевые жалюзи",
    imageSrc: "/predlagaem/solnczaschit-sist7390.webp",
  },
  {
    title: "Навеска и отпаривание штор",
    description: "Развесим и отпарим шторы в рамках оформления Ваших окон текстилем",
    imageSrc: "/himchistka/3.-ustanovka-na-obekte-.webp",
  },
  {
    title: "Химчистка штор",
    description: "Профессиональная бережная чистка текстиля и штор под ключ",
    imageSrc: "/himchistka/chistka-i-vosstanovlenie-1-.webp",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-[color:var(--sand)] py-16 sm:py-20">
      <Container>
        <div className="mb-8">
          <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
            Что мы
          </span>
          <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
            предлагаем
          </span>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((item, idx) => (
            <article
              key={idx}
              className="group relative overflow-hidden bg-[color:var(--bg)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  loading="eager"
                  priority
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-[color:var(--fg)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
