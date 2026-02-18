import { Container } from "@/components/Container";

export function Trust() {
  return (
    <section className="py-12 sm:py-14">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
              ПОЧЕМУ KOENIG ROOM
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl">
              Премиум — это процесс
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Вы получаете результат, который выглядит дороже — потому что мы
              контролируем каждую деталь.
            </p>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-semibold text-[color:var(--muted)]">
              01
            </div>
            <div className="mt-3 text-lg font-semibold text-[color:var(--fg)]">
              Подбор под интерьер
            </div>
            <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Свет, цвет стен, мебель и фактура ткани — собираем гармонию.
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-semibold text-[color:var(--muted)]">
              02
            </div>
            <div className="mt-3 text-lg font-semibold text-[color:var(--fg)]">
              Сильный декор
            </div>
            <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Карнизы, фурнитура, аксессуары — именно они дают “дорого”.
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-semibold text-[color:var(--muted)]">
              03
            </div>
            <div className="mt-3 text-lg font-semibold text-[color:var(--fg)]">
              Пошив и контроль качества
            </div>
            <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Складка, длина, швы, посадка — внимание к мелочам видно сразу.
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-semibold text-[color:var(--muted)]">
              04
            </div>
            <div className="mt-3 text-lg font-semibold text-[color:var(--fg)]">
              Монтаж и финальный вид
            </div>
            <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Установка — часть премиума. Делаем аккуратно и чисто.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
