"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Container } from "@/components/Container";

const CATALOG_REVIEW_PHOTOS = [
  "/catalog/1.shtory-i-tkani/1.1.avstriyskie/photo_2026-03-02_16-21-17.webp",
  "/catalog/1.shtory-i-tkani/1.13.shtory-v-spalnyu/IMG_1426-HDR.webp",
  "/catalog/1.shtory-i-tkani/1.13.shtory-v-spalnyu/IMG_1500-HDR.webp",
  "/catalog/1.shtory-i-tkani/1.14-shtory-na-lyuversah/1.webp",
  "/catalog/1.shtory-i-tkani/1.15-shtory-v-vannuyu/photo_2026-03-12_17-12-04.webp",
  "/catalog/1.shtory-i-tkani/1.11.-shtory-kabinet/photo_2025-10-07_15-26-09.webp",
];

const REVIEWS = [
  {
    name: "Анна Медведева",
    text: "Хочу выразить благодарность всему коллективу за ваш труд! Я в восторге от штор. Заказывала шторы в три комнаты, результатом довольна на все 100%. В Центре шикарный выбор тканей на любой вкус.",
    photos: ["/catalog/1.shtory-i-tkani/1.13.shtory-v-spalnyu/IMG_1426-HDR.webp", "/catalog/1.shtory-i-tkani/1.13.shtory-v-spalnyu/IMG_1500-HDR.webp"],
  },
  {
    name: "Александр И.",
    text: "Спасибо огромное за шторы в моей новой квартире! Качество материалов, пошив и сервис на высоте! Пошив продуман во всех деталях.",
    photos: [],
  },
  {
    name: "Екатерина",
    text: "Я стала счастливой обладательницей прекрасных штор. Устроил их подход к подбору штор. Когда я покупаю, предварительно посмотрев смонтированный ролик с примерами - я просто влюбилась в их сервис.",
    photos: ["/catalog/1.shtory-i-tkani/1.14-shtory-na-lyuversah/1.webp"],
  },
  {
    name: "Марина Кутовая",
    text: "Хочу сказать слова благодарности Юлии за отличную работу. Обращаюсь уже не в первый раз, заказывала шторы в спальню и гостиную.",
    photos: [],
  },
  {
    name: "Рамиль Ш.",
    text: "Все супер, качество штор отличное, все сроки соблюдены, сервис на высшем уровне. Отдельно хочется поблагодарить менеджера Татьяну.",
    photos: ["/catalog/1.shtory-i-tkani/1.15-shtory-v-vannuyu/photo_2026-03-12_17-12-04.webp"],
  },
  {
    name: "Анна Коровина",
    text: "Хочу выразить огромную благодарность дизайнеру Наталье Белановой за шикарно проведенную работу! Наталья - высококвалифицированный профессионал своего дела!",
    photos: [],
  },
  {
    name: "Ольга",
    text: "Заказывали в салоне римские шторы на электроприводе на балкон. Огромное спасибо дизайнеру Анастасии за помощь в подборе идеальной ткани.",
    photos: ["/catalog/1.shtory-i-tkani/1.1.avstriyskie/photo_2026-03-02_16-21-17.webp"],
  },
  {
    name: "Александр",
    text: "Мы проехали много магазинов по всему городу, нигде не удовлетворили наш запрос. Обратившись к дизайнеру Татьяне мы получили максимально развернутый ассортимент. Результат превзошёл все мои ожидания.",
    photos: [],
  },
];

type ReviewItem =
  | { kind: "review"; name: string; text: string; photos: string[] }
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

export function Reviews() {
  const [expanded, setExpanded] = useState(false);

  const items: ReviewItem[] = useMemo(
    () => {
      const reviews = shuffle(
        REVIEWS.map((r) => ({ kind: "review" as const, ...r }) as ReviewItem),
        31,
      );

      const photos = shuffle(
        CATALOG_REVIEW_PHOTOS.map((src) => ({ kind: "photo" as const, src, alt: "Интерьер" }) as ReviewItem),
        47,
      );

      return mixReviewsAndPhotos(reviews, photos, 17);
    },
    [],
  );

  const visible = expanded ? items.slice(0, 14) : items.slice(0, 6);

  return (
    <section className="bg-[color:var(--bg)] py-16 sm:py-20">
      <Container>
        <div className="mb-8">
          <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
            Сотни клиентов
          </span>
          <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
            рекомендуют нас
          </span>
          <span className="ml-2 inline-block font-['Rozovii_Chulok',cursive] text-xl tracking-normal text-[color:var(--green)] sm:ml-4 sm:text-3xl lg:text-4xl" style={{ transform: 'rotate(-6deg)' }}>
            отзывы
          </span>
        </div>

        <div className="relative mt-10">
          <div className="columns-1 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
            {visible.map((it, idx) => {
              if (it.kind === "photo") {
                return (
                  <figure
                    key={`${it.src}-${idx}`}
                    className="mb-4 break-inside-avoid overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)]"
                  >
                    <div className="relative aspect-[4/3]">
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
                  className="mb-4 break-inside-avoid border border-[color:var(--gray-lines)] bg-[color:var(--bg)] p-6"
                >
                  <div className="text-lg font-medium text-[color:var(--fg)]">
                    {it.name}
                  </div>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-4 w-4 text-[color:var(--green)]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 1.729a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-1.729a1 1 0 00-1.175 0l-2.8 1.729c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
                    "{it.text}"
                  </blockquote>
                  {it.photos.length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {it.photos.slice(0, 2).map((src, i) => (
                        <div key={i} className="relative h-16 w-16 overflow-hidden">
                          <Image
                            src={src}
                            alt={`Фото ${i + 1}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </figure>
              );
            })}
          </div>

          {!expanded ? (
            <div className="pointer-events-none relative z-10 -mt-64 h-64">
              <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(120%_100%_at_50%_100%,var(--bg)_0%,var(--bg)_35%,color-mix(in_srgb,var(--bg)_20%,transparent)_70%,transparent_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--bg)_0.18,var(--bg)_0.55,var(--bg)_0.82,var(--bg)_1)]" />
            </div>
          ) : null}

          {!expanded ? (
            <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]"
              >
                Показать больше
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="https://novosibirsk.flamp.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center border border-[color:var(--fg)] bg-transparent px-8 text-xs font-normal uppercase tracking-[0.15em] text-[color:var(--fg)] transition hover:bg-[color:var(--fg)] hover:text-[color:var(--bg)]"
          >
            Больше отзывов на FLAMP
          </a>
          <a
            href="https://yandex.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center border border-[color:var(--fg)] bg-transparent px-8 text-xs font-normal uppercase tracking-[0.15em] text-[color:var(--fg)] transition hover:bg-[color:var(--fg)] hover:text-[color:var(--bg)]"
          >
            Больше отзывов на Яндекс
          </a>
        </div>
      </Container>
    </section>
  );
}
