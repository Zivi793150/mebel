"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Scenario = {
  id: "quiet" | "warm" | "zone" | "care";
  label: string;
  title: string;
  subtitle: string;
  bullets: { title: string; text: string }[];
  imageSrc: string;
  proof: { metric: string; note: string }[];
  cta: { href: string; label: string };
};

export function RugsWhyShowcase({ images }: { images?: string[] }) {
  const scenarios: Scenario[] = useMemo(
    () => [
      {
        id: "quiet",
        label: "Тише",
        title: "Снимаем эхо и делаем комнату мягче",
        subtitle:
          "Ковёр работает как “акустический слой”: звук становится собраннее, а интерьер — спокойнее.",
        bullets: [
          {
            title: "Комфорт для голоса",
            text: "В гостиной и спальне звук перестаёт “летать”, разговор звучит спокойнее.",
          },
          {
            title: "Меньше шумов",
            text: "Шаги, игрушки и бытовые звуки становятся менее резкими.",
          },
          {
            title: "Премиум-ощущение",
            text: "Тишина и тактильность дают эффект “дороже”, даже без ярких деталей.",
          },
        ],
        imageSrc: "/catalog/rugs.jpg",
        proof: [
          { metric: "1 слой", note: "и комната уже воспринимается собраннее" },
          { metric: "0 хаоса", note: "палитру держит фактура" },
          { metric: "+ уют", note: "без лишнего декора" },
        ],
        cta: { href: "#cta", label: "Подобрать под мою комнату" },
      },
      {
        id: "warm",
        label: "Теплее",
        title: "Тепло под ногами — каждый день",
        subtitle:
          "Утро в спальне и детская — там ковёр ощущается сразу. Подбираем ворс и основу под сценарий.",
        bullets: [
          {
            title: "Тактильность",
            text: "Не просто “красиво”, а приятно жить: поверхность, по которой хочется ходить.",
          },
          {
            title: "Стабильность",
            text: "Выбираем основу так, чтобы ковёр не “гулял” и лежал ровно.",
          },
          {
            title: "Практичность",
            text: "Сразу учитываем стирку/чистку и ваш ритм жизни.",
          },
        ],
        imageSrc: "/catalog/bed.jpg",
        proof: [
          { metric: "7:00", note: "комфорт с первого шага" },
          { metric: "− холод", note: "ощущение теплее в зоне кровати" },
          { metric: "+ ритм", note: "меньше стресса по утрам" },
        ],
        cta: { href: "#cta", label: "Хочу комфортный вариант" },
      },
      {
        id: "zone",
        label: "Собрать зону",
        title: "Ковёр делает комнату “цельной”",
        subtitle:
          "Правильный размер и посадка под мебель собирают композицию. Комната сразу выглядит дороже.",
        bullets: [
          {
            title: "Правильный масштаб",
            text: "Опираемся на диван/кровать и оставляем поля — без эффекта “маленький коврик”.",
          },
          {
            title: "Порядок в кадре",
            text: "Ковёр держит мебель в одной зоне — интерьер выглядит как продуманный проект.",
          },
          {
            title: "Цвет без риска",
            text: "Подбираем так, чтобы ковёр не спорил, а связывал палитру комнаты.",
          },
        ],
        imageSrc: "/catalog/pillows.jpg",
        proof: [
          { metric: "1 правило", note: "передние ножки мебели на ковре" },
          { metric: "2 варианта", note: "даём на выбор по смелости" },
          { metric: "3 минуты", note: "и понятно, что лучше" },
        ],
        cta: { href: "#cta", label: "Подобрать размер" },
      },
      {
        id: "care",
        label: "Без нервов",
        title: "Чтобы было красиво и не страшно за уход",
        subtitle:
          "Дети, питомцы, кухня рядом — учитываем это заранее. Подбираем материал и плотность под реальность.",
        bullets: [
          {
            title: "Логика ухода",
            text: "Сразу говорим, что можно чистить дома, а что лучше отдавать в химчистку.",
          },
          {
            title: "Пятна и следы",
            text: "Выбираем фактуру, которая прощает мелкие следы и не выглядит “замученной”.",
          },
          {
            title: "Гигиена",
            text: "Под ваш сценарий подбираем плотность и состав — без лишней пыли и запахов.",
          },
        ],
        imageSrc: "/catalog/decor.jpg",
        proof: [
          { metric: "дети/питомцы", note: "закладываем сразу" },
          { metric: "1 подсказка", note: "что делать при пятне" },
          { metric: "спокойно", note: "не “бережём ковёр”, а живём" },
        ],
        cta: { href: "#cta", label: "Подобрать практичный" },
      },
    ],
    []
  );

  const derivedScenarios = useMemo(() => {
    if (!images || images.length === 0) return scenarios;
    return scenarios.map((s, idx) => ({
      ...s,
      imageSrc: images[idx % images.length] || s.imageSrc,
    }));
  }, [images, scenarios]);

  const [active, setActive] = useState<Scenario["id"]>("quiet");
  const scenario = derivedScenarios.find((s) => s.id === active) ?? derivedScenarios[0];

  return (
    <section className="relative overflow-hidden bg-[color:var(--bg)]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#00000014_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute -left-28 top-16 h-80 w-80 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
        <div className="absolute -right-28 bottom-16 h-80 w-80 rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.04]" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col items-center px-4 pt-18 text-center sm:pt-24">
          <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ЗАЧЕМ</div>
          <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
            Ковёр — это тишина, тепло и собранный интерьер
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
            Выберите, что для вас важнее — и мы подберём решение так, чтобы выглядело дорого и было удобно каждый день.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {derivedScenarios.map((s) => {
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(s.id)}
                  className={
                    isActive
                      ? "inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-xs font-semibold tracking-[0.26em] text-[color:var(--accent-contrast)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      : "inline-flex h-10 items-center justify-center rounded-full bg-black/[0.03] px-5 text-xs font-semibold tracking-[0.26em] text-[color:var(--fg)]/75 shadow-sm backdrop-blur transition hover:bg-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                  }
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-6">
              <div className="pt-2">
                <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">СЦЕНАРИЙ</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
                  {scenario.title}
                </div>
                <div className="mt-3 text-sm leading-6 text-[color:var(--muted)] sm:text-base">{scenario.subtitle}</div>

                <div className="mt-10 space-y-6">
                  {scenario.bullets.map((b) => (
                    <div key={b.title} className="grid gap-2 border-b border-black/5 pb-6 last:border-b-0 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" aria-hidden="true" />
                        <div className="text-base font-semibold tracking-tight text-[color:var(--fg)]">{b.title}</div>
                      </div>
                      <div className="pl-5 text-sm leading-6 text-[color:var(--muted)]">{b.text}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={scenario.cta.href}
                    className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                  >
                    {scenario.cta.label}
                  </a>
                  <a
                    href="#rugs-catalog"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-black/[0.03] px-5 text-sm font-semibold text-[color:var(--fg)]/85 shadow-sm backdrop-blur transition hover:bg-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                  >
                    Каталог <span aria-hidden="true" className="ml-2">→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="group relative h-full min-h-[520px] overflow-hidden rounded-[28px] bg-black/[0.03] shadow-[0_26px_90px_rgba(0,0,0,0.18)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 dark:bg-white/[0.05] dark:shadow-[0_26px_90px_rgba(0,0,0,0.55)]">
                <Image
                  src={scenario.imageSrc}
                  alt="Ковры"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-[transform,filter] duration-700 group-hover:scale-[1.06] group-hover:saturate-[1.08]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.22),rgba(0,0,0,0.82))]" />

                <div className="relative z-10 flex h-full flex-col justify-end p-8">
                  <div className="text-xs font-semibold tracking-[0.28em] text-white/75">БЫСТРО</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Подбор по 2 фото</div>
                  <div className="mt-3 max-w-md text-sm leading-6 text-white/80">
                    Комната + мебель. Мы предложим 2–3 варианта и объясним разницу по фактуре, размеру и уходу.
                  </div>
                  <a
                    href="#cta"
                    className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black shadow-sm transition group-hover:shadow-md"
                  >
                    Спросить <span aria-hidden="true" className="ml-2">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-18 pt-10 sm:pb-24" />
        </div>
      </div>
    </section>
  );
}
