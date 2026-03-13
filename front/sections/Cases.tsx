import Image from "next/image";

import { Container } from "@/components/Container";
import { CONTACTS } from "@/lib/constants";

type CaseItem = {
  title: string;
  goal: string;
  solution: string;
  result: string;
  imageSrc: string;
  badge: string;
};

const BASE_CASES: CaseItem[] = [
  {
    badge: "СПАЛЬНЯ",
    title: "Blackout без тяжести",
    goal: "Полное затемнение и тишина — без ощущения “глухой стены”.",
    solution: "Комбо: плотный blackout + мягкий верхний слой, точная длина и посадка.",
    result: "Комната выглядит дороже, сон — комфортнее.",
    imageSrc: "/hero2.jpg",
  },
  {
    badge: "ГОСТИНАЯ",
    title: "Панорамные окна",
    goal: "Сохранить вид и свет, но добавить приватность вечером.",
    solution: "Полупрозрачные ткани с правильной фактурой + аккуратный потолочный карниз.",
    result: "Лёгкость днём, комфорт вечером.",
    imageSrc: "/hero.jpg",
  },
  {
    badge: "КУХНЯ / ОФИС",
    title: "Свет под контролем",
    goal: "Убрать блики и перегрев, не затемняя комнату полностью.",
    solution: "Жалюзи/рулонные системы под сценарий света + чистый монтаж.",
    result: "Работать и отдыхать стало проще — без раздражающих бликов.",
    imageSrc: "/gray_hero.jpg",
  },
];

export function Cases({ images }: { images?: string[] }) {
  const derivedCases = BASE_CASES.map((c, idx) => ({
    ...c,
    imageSrc: images?.[idx] || c.imageSrc,
  }));

  return (
    <section aria-label="Проекты" className="py-14 sm:py-18">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
              ПРОЕКТЫ
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
              Коротко: задача → решение → результат
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Это макетные примеры — показывают, как мы думаем: сначала цель, потом материалы и
              монтаж, затем финальный “дорогой” вид.
            </p>
          </div>

          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <a
              href={CONTACTS.telegramHref}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            >
              Обсудить проект в Telegram
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {derivedCases.map((c) => (
            <article
              key={c.title}
              className="group overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={c.imageSrc}
                  alt={c.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.62),transparent_60%)]" />
                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
                  {c.badge}
                </div>
              </div>

              <div className="p-6">
                <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">
                  {c.title}
                </div>

                <div className="mt-4 grid gap-3 text-sm leading-6 text-[color:var(--muted)]">
                  <div>
                    <span className="font-semibold text-[color:var(--fg)]">Задача:</span> {c.goal}
                  </div>
                  <div>
                    <span className="font-semibold text-[color:var(--fg)]">Решение:</span> {c.solution}
                  </div>
                  <div>
                    <span className="font-semibold text-[color:var(--fg)]">Итог:</span> {c.result}
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href={CONTACTS.telegramHref}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-black/10 bg-white/70 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Подобрать под мой интерьер
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
