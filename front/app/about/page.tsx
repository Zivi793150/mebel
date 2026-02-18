import { Container } from "@/components/Container";

export default function AboutPage() {
  return (
    <main className="py-14 sm:py-18">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
              О НАС
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
              Koenig Room
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
              Мы — крупнейший магазин интерьерного текстиля и декора в Калининграде.
              Делаем под ключ: подбор тканей и систем, пошив, монтаж, финальная настройка.
            </p>

            <div className="mt-7">
              <a
                href="/#catalog"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
              >
                Перейти в каталог
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/15 dark:bg-white/5">
                <div className="text-sm font-semibold text-[color:var(--fg)]">Премиум как стандарт</div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Контроль посадки, складки и монтажа — именно это делает результат визуально дороже.
                </div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/15 dark:bg-white/5">
                <div className="text-sm font-semibold text-[color:var(--fg)]">Спокойный сервис</div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Вы заранее знаете этапы и сроки. Мы ведём проект от идеи до финального вида.
                </div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/15 dark:bg-white/5">
                <div className="text-sm font-semibold text-[color:var(--fg)]">Материалы и партнёры</div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Подбираем ткани и решения под свет, интерьер и сценарий комнаты — без компромиссов.
                </div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/15 dark:bg-white/5">
                <div className="text-sm font-semibold text-[color:var(--fg)]">Под ключ</div>
                <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Замер, подбор, пошив, монтаж. Ваша задача — выбрать ощущение, остальное сделаем мы.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
