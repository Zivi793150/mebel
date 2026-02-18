import { Container } from "@/components/Container";

const FEATURES = [
  {
    title: "Ткани и фактуры",
    description: "Подбираем материалы под свет, цвет стен и мебель — чтобы интерьер выглядел дороже.",
  },
  {
    title: "Функциональность",
    description: "Blackout, полупрозрачные, защита от выгорания — не только красиво, но и удобно.",
  },
  {
    title: "Декор и фурнитура",
    description: "Подхваты, кисти, ленты и карнизы — акценты, которые делают проект завершённым.",
  },
  {
    title: "Пошив и монтаж",
    description: "Аккуратные швы, точные размеры, чистая установка — финальный вид решает всё.",
  },
];

export function CurtainsFeature() {
  return (
    <section id="curtains" className="py-14 sm:py-18">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-3xl">
              Сильнее всего — шторы
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Здесь “вау” появляется быстрее всего: фактура ткани, свет, складка,
              правильная длина. Мы делаем это премиально — и визуально, и по
              исполнению.
            </p>

            <div className="mt-6 overflow-hidden rounded-3xl border border-black/5 bg-white/50 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="relative aspect-[16/10]">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/0-3scene.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.50),transparent_60%)]" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-sm font-semibold text-white">Складка, свет, длина</div>
                  <div className="mt-1 text-xs leading-5 text-white/75">
                    Пара секунд — и видно, почему это выглядит дороже.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-black/5 bg-[color:var(--accent-soft)] p-6 shadow-sm dark:border-white/10">
              <div className="text-sm font-semibold text-[color:var(--fg)]">
                Быстрый сценарий покупки
              </div>
              <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                1) Выбираем стиль → 2) уточняем задачу (свет/приватность) → 3)
                предлагаем ткани → 4) фиксируем стоимость и сроки.
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                >
                  <div className="text-sm font-semibold text-[color:var(--fg)]">
                    {f.title}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    {f.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-3xl">
              <div className="relative aspect-[21/9]">
                <img
                  src="/logo2.png"
                  alt="Koenig Room"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
