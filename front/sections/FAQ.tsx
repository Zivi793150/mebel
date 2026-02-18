import { Container } from "@/components/Container";

const FAQ_ITEMS = [
  {
    q: "Сколько занимает подбор и расчёт?",
    a: "Обычно 5–15 минут: уточняем задачу, стиль интерьера и даём ориентир по стоимости. Точный расчёт — после уточнения размеров и ткани.",
  },
  {
    q: "Вы делаете только шторы?",
    a: "Нет. У нас полный каталог: жалюзи, римские, карнизы, декор/фурнитура, ковры, текстиль для спальни и аксессуары.",
  },
  {
    q: "Можно ли подобрать решение под конкретный интерьер?",
    a: "Да. Мы отталкиваемся от света, стен, мебели, и собираем гармонию: ткань + карниз + декор. Это и создаёт премиальный итог.",
  },
  {
    q: "Монтаж входит?",
    a: "Мы работаем комплексно: от подбора до установки. Формат и стоимость зависят от категории и задач — уточним при заявке.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-14 sm:py-18">
      <Container>
        <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
          FAQ
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
          Вопросы и ответы
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
          Снимаем сомнения до заявки — это ускоряет решение и повышает конверсию.
        </p>

        <div className="mt-8 grid gap-3">
          {FAQ_ITEMS.map((i) => (
            <details
              key={i.q}
              className="group rounded-2xl border border-black/5 bg-white/60 p-5 shadow-sm backdrop-blur open:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:open:bg-white/10"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[color:var(--fg)]">
                {i.q}
                <span className="text-[color:var(--muted)] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {i.a}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
