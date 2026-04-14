"use client";

import Image from "next/image";

import { Container } from "@/components/Container";

type Step = {
  yearLabel: string;
  title: string;
  description: string;
  images: string[];
};

export function AboutStory({ images }: { images?: string[] }) {
  const steps: Step[] = [
    {
      yearLabel: "2002",
      title: "Начало пути",
      description:
        "Татьяна Наумова начинает деятельность — первые проекты и первые стандарты качества.",
      images: [
        "/hronologiya/2002/25October_BesedinaInt2-min.webp",
        "/hronologiya/2002/25October_BesedinaInt4-min.webp",
        "/hronologiya/2002/25October_BesedinaInt9-min.webp",
        "/hronologiya/2002/25October_BesedinaInt11-min.webp",
      ],
    },
    {
      yearLabel: "Рост",
      title: "Доверие и система",
      description:
        "Собственный цех, заказные ткани и проекты под ключ — от идеи до монтажа.",
      images: [
        "/hronologiya/rost/25October_LuplandinaInt2-min.webp",
        "/hronologiya/rost/25October_LuplandinaInt3-min.webp",
        "/hronologiya/rost/25October_LuplandinaInt7-min.webp",
        "/hronologiya/rost/25October_LuplandinaInt14-min.webp",
      ],
    },
    {
      yearLabel: "Сегодня",
      title: "Ведущий салон",
      description:
        "Koenig Room — один из ведущих салонов Калининграда в сфере текстильного и интерьерного дизайна.",
      images: [
        "/hronologiya/segodnya/05_10395_053_.webp",
        "/hronologiya/segodnya/05_10795_053_@maxiimov.webp",
        "/hronologiya/segodnya/57_10679_086_@maxiimov.webp",
        "/hronologiya/segodnya/64_10709_036_@maxiimov.webp",
      ],
    },
  ];

  const getImage = (stepIndex: number, imgIndex: number) => {
    const stepImages = steps[stepIndex]?.images;
    return stepImages?.[imgIndex] || "/hero.webp";
  };

  return (
    <section className="py-14 sm:py-18 bg-[color:var(--bg)]">
      <Container>
        <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ИСТОРИЯ</div>
        <h2 className="mt-4 text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-3xl">
          Хронология
        </h2>

        <div className="mt-10 space-y-10">
          {steps.map((s, idx) => (
            <div key={s.title} className="grid gap-6 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-3">
                <div className="text-3xl font-light text-[color:var(--fg)]">{s.yearLabel}</div>
              </div>

              <div className="lg:col-span-9">
                <div className="border-b border-[color:var(--gray-lines)] pb-6">
                  <div className="text-lg font-medium text-[color:var(--fg)]">{s.title}</div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="relative aspect-[4/3] overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)]"
                    >
                      <Image
                        src={getImage(idx, j)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 240px, 50vw"
                        className="object-cover"
                        loading="eager"
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
