"use client";

import { useState } from "react";

import { Container } from "@/components/Container";

type ShowreelItem = {
  title: string;
  thumbnail: string;
  videoId: string;
};

const SHOWREELS: ShowreelItem[] = [
  {
    title: "С электрокарнизами дома становятся комфортнее и уютнее",
    thumbnail: "/hero.jpg",
    videoId: "67d4a1d297c6c7988a4c34192c1be7de",
  },
  {
    title: "Римские шторы на электрокарнизе",
    thumbnail: "/hero2.jpg",
    videoId: "f0a9406529ddcad0ecbe65bf67a3e2f9",
  },
  {
    title: "Деревянные жалюзи на электроприводе",
    thumbnail: "/gray_hero.jpg",
    videoId: "ecc6ba48a101544d8a6ec795a9ed9206",
  },
  {
    title: "Раздвижной карниз ONVIZ с усиленными каретками",
    thumbnail: "/hero.jpg",
    videoId: "0dcd622f104107db98bad6a5f748b4a4",
  },
  {
    title: "Алиса, закрой шторы!",
    thumbnail: "/hero2.jpg",
    videoId: "b6782223c072e66de4d640ab82fb2589",
  },
  {
    title: "Будущее наступило!",
    thumbnail: "/gray_hero.jpg",
    videoId: "16f5f624500f61044c76035e11a2b273",
  },
];

export function Showreels() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="bg-[#f5f5f5] py-14 sm:py-18">
      <Container>
        <div className="text-xs font-semibold tracking-[0.32em] text-black/55">
          ВИДЕО
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
          Шоурил реализованных проектов
        </h2>
      </Container>

      <div className="mt-8 overflow-x-auto">
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8">
          {SHOWREELS.map((item) => (
            <div
              key={item.videoId}
              className="relative w-[280px] flex-shrink-0 overflow-hidden rounded-2xl bg-black sm:w-[320px]"
            >
              {/* Thumbnail */}
              <div
                className="relative aspect-video cursor-pointer bg-cover bg-center"
                style={{ backgroundImage: `url(${item.thumbnail})` }}
                onClick={() => setActiveVideo(item.videoId)}
              >
                <div className="absolute inset-0 bg-black/30" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:scale-105">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Container>
        <div className="mt-8">
          <a
            href="#cta"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-black/20 bg-white px-5 text-sm font-semibold text-black shadow-sm transition hover:bg-black/5"
          >
            Записаться на замер
          </a>
        </div>
      </Container>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative aspect-video w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://rutube.ru/play/embed/${activeVideo}`}
              className="h-full w-full rounded-2xl"
              allowFullScreen
            />
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg"
              aria-label="Закрыть"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
