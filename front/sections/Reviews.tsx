"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Container } from "@/components/Container";

const REVIEWS = [
  {
    name: "Анна",
    text: "Очень аккуратная работа: складка, длина, монтаж — всё идеально. Интерьер стал значительно дороже выглядеть.",
  },
  {
    name: "Сергей",
    text: "Быстро предложили несколько решений и тканей. Понравилось, что не навязывали, а объясняли по делу.",
  },
  {
    name: "Екатерина",
    text: "Сильный декор и фурнитура — именно это искала. Итог получился как на визуализации дизайнера.",
  },
  {
    name: "Мария",
    text: "Супер сервис: замер, подбор тканей и монтаж прошли спокойно. Результат выглядит очень дорого.",
  },
  {
    name: "Илья",
    text: "Понравилось, что сразу предложили несколько вариантов под интерьер и бюджет. Всё в срок.",
  },
  {
    name: "Наталья",
    text: "Качество пошива отличное, складка ровная. Мастера аккуратные, ничего не испачкали и не повредили.",
  },
  {
    name: "Ольга",
    text: "Очень деликатно подобрали оттенки и фактуры. Смотрится спокойно, но при этом дорого.",
  },
  {
    name: "Дмитрий",
    text: "Монтаж аккуратный, всё выровняли идеально. Комната стала выглядеть цельнее и теплее.",
  },
];

type ReviewItem =
  | { kind: "review"; name: string; text: string }
  | { kind: "photo"; src: string; alt: string };

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], seed = 42) {
  const out = [...arr];
  const rnd = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function mixReviewsAndPhotos(reviews: ReviewItem[], photos: ReviewItem[], seed = 17) {
  const rnd = mulberry32(seed);
  const out: ReviewItem[] = [];

  let r = 0;
  let p = 0;
  let run = 0;

  while (r < reviews.length || p < photos.length) {
    const canReview = r < reviews.length;
    const canPhoto = p < photos.length;

    if (!canReview && canPhoto) {
      out.push(photos[p++]);
      run = 0;
      continue;
    }

    if (!canPhoto && canReview) {
      out.push(reviews[r++]);
      run += 1;
      continue;
    }

    const mustPhoto = run >= 2;
    const pickPhoto = mustPhoto ? true : rnd() < 0.22;
    if (pickPhoto) {
      out.push(photos[p++]);
      run = 0;
    } else {
      out.push(reviews[r++]);
      run += 1;
    }
  }

  return out;
}

function stars(n = 5) {
  return "★★★★★".slice(0, n);
}

export function Reviews() {
  const [expanded, setExpanded] = useState(false);

  const items: ReviewItem[] = useMemo(
    () => {
      const reviews = shuffle(
        REVIEWS.map((r) => ({ kind: "review", ...r }) as ReviewItem),
        31,
      );
      const photos = shuffle(
        [
          { kind: "photo", src: "/hero2.jpg", alt: "Интерьер" },
          { kind: "photo", src: "/gray_hero.jpg", alt: "Ткань" },
          { kind: "photo", src: "/1step.png", alt: "Процесс" },
          { kind: "photo", src: "/2step.png", alt: "Процесс" },
          { kind: "photo", src: "/3step.png", alt: "Процесс" },
          { kind: "photo", src: "/hero.jpg", alt: "Интерьер" },
        ] as ReviewItem[],
        47,
      );

      return mixReviewsAndPhotos(reviews, photos, 17);
    },
    [],
  );

  const visible = expanded ? items.slice(0, 14) : items.slice(0, 6);

  return (
    <section id="reviews" className="bg-[#eef0f3] py-14 sm:py-18">
      <Container>
        <div className="text-xs font-semibold tracking-[0.32em] text-black/55">
          ОТЗЫВЫ
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
          Что говорят клиенты
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60 sm:text-base">
          Коротко и по делу — как в хорошем каталоге.
        </p>

        <div className="relative mt-10">
          <div className="columns-1 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
            {visible.map((it, idx) => {
              if (it.kind === "photo") {
                const rnd = mulberry32(900 + idx)();
                const ratio =
                  rnd < 0.33
                    ? "aspect-[4/3]"
                    : rnd < 0.66
                      ? "aspect-[3/4]"
                      : "aspect-[16/10]";
                return (
                  <figure
                    key={`${it.src}-${idx}`}
                    className="mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
                  >
                    <div className={`relative ${ratio}`}>
                      <Image
                        src={it.src}
                        alt={it.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </figure>
                );
              }

              return (
                <figure
                  key={`${it.name}-${idx}`}
                  className="mb-4 break-inside-avoid rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm leading-none tracking-[0.2em] text-black">
                      {stars(5)}
                    </div>
                    <div className="text-xs font-medium text-black/45">Google</div>
                  </div>
                  <blockquote className="mt-3 text-sm leading-6 text-black">
                    “{it.text}”
                  </blockquote>
                  <figcaption className="mt-4 text-xs font-semibold tracking-wide text-black/55">
                    {it.name}
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {!expanded ? (
            <div className="pointer-events-none relative z-10 -mt-64 h-64">
              <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(120%_100%_at_50%_100%,rgba(238,240,243,0.95)_0%,rgba(238,240,243,0.8)_35%,rgba(238,240,243,0.2)_70%,rgba(238,240,243,0)_100%)] blur-2xl" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(238,240,243,0),rgba(238,240,243,0.18),rgba(238,240,243,0.55),rgba(238,240,243,0.82),rgba(238,240,243,1))]" />
            </div>
          ) : null}

          {!expanded ? (
            <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Показать больше
              </button>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
