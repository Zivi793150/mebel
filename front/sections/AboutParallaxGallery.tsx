"use client";

import Image from "next/image";

import { Container } from "@/components/Container";


type GalleryItem = {
  id: string;
  no: string;
  title: string;
  kind: string;
  year: string;
  note: string;
  imageSrc: string;
};

export function AboutParallaxGallery({ images }: { images?: string[] }) {
  // Always use local hronologiya images, ignore MongoDB URLs
  const localImages = [
    "/hronologiya/2002/25October_BesedinaInt2-min.webp",
    "/hronologiya/2002/25October_BesedinaInt4-min.webp",
    "/hronologiya/2002/25October_BesedinaInt9-min.webp",
    "/hronologiya/rost/25October_LuplandinaInt2-min.webp",
    "/hronologiya/rost/25October_LuplandinaInt3-min.webp",
    "/hronologiya/rost/25October_LuplandinaInt7-min.webp",
    "/hronologiya/segodnya/05_10395_053_.webp",
    "/hronologiya/segodnya/05_10795_053_@maxiimov.webp",
    "/hronologiya/segodnya/57_10679_086_@maxiimov.webp",
  ];

  const getImage = (idx: number) => localImages[idx % localImages.length];

  const items: GalleryItem[] = [
    {
      id: "start",
      no: "01",
      title: "Первые проекты",
      kind: "История",
      year: "2002",
      note: "Начало пути и первые стандарты качества.",
      imageSrc: getImage(2),
    },
    {
      id: "studio",
      no: "02",
      title: "Салон и цех",
      kind: "Процесс",
      year: "2010+",
      note: "Собственный цех, заказные ткани, монтаж под ключ.",
      imageSrc: getImage(7),
    },
    {
      id: "design",
      no: "03",
      title: "Текстильный дизайн",
      kind: "Подбор",
      year: "Сегодня",
      note: "Свет, фактуры и детали — как единая история интерьера.",
      imageSrc: getImage(12),
    },
    {
      id: "partners",
      no: "04",
      title: "Партнёры и коллекции",
      kind: "Качество",
      year: "2× в год",
      note: "Обновляем коллекции и держим уровень материалов.",
      imageSrc: getImage(18),
    },
    {
      id: "result",
      no: "05",
      title: "Результат",
      kind: "Финал",
      year: "Всегда",
      note: "Аккуратно, точно и с уважением к вашему дому.",
      imageSrc: getImage(23),
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-[color:var(--bg)]">
      <Container>
        <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ПРОЦЕСС</div>
        <h2 className="mt-4 text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-3xl">
          Этапы работы
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="border border-[color:var(--gray-lines)] bg-[color:var(--card)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  alt={it.title}
                  src={it.imageSrc}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">
                  <span>{it.no}</span>
                  <span>{it.kind.toUpperCase()}</span>
                </div>
                <div className="mt-2 text-lg font-medium text-[color:var(--fg)]">{it.title}</div>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{it.note}</p>
                <div className="mt-2 text-xs text-[color:var(--muted)]">{it.year}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
