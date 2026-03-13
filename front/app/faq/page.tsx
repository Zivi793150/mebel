"use client";

import { useMemo, useState } from "react";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type FaqItem = {
  q: string;
  a: string;
};

export default function FaqPage() {
  const items: FaqItem[] = useMemo(
    () => [
      {
        q: "Сколько занимает заказ?",
        a: "Срок изготовления зависит от  сложности пошива и  наличия ткани , если это ткани из Москвы, то срок пошива заказа от двух недель и более.",
      },
      {
        q: "Вы выезжаете на замер?",
        a: "Да. Замеры позволяют  учесть особенности помещения,  окон  и создать изделие , идеально подходящее  по размеру и стилю. После замеров наш дизайнер предложит вам 2–3  варианта оформления.",
      },
      {
        q: "Можно ли заказать только пошив?",
        a: "Да, вы можете заказать пошив.Но для идеального оформления мы рекомендуем вам  делать замеры с нашим специалистом.",
      },
      {
        q: "Как подобрать   ткань   под освещение в  интерьере ?",
        a: "Мы учитываем расположение окон, естественное и искусственное  освещение, назначение комнаты и желаемую приватность. Можно подобрать как мягкие ткани , так и блэкаут.",
      },
      {
        q: "С какими категориями изделий вы работаете?",
        a: "Шторы, карнизы, жалюзи, плиссе, римские шторы,австрийские шторы, декоративные аксессуары, текстиль для спальни, постельное белье  и декоративные подушки.",
      },
      {
        q: "Сколько стоит проект?",
        a: "Стоимость зависит от материалов  (ткани,  карнизов, фурнитуры) а также стоимости услуг по пошиву, оформлению и монтажа. Мы готовим для вас  итоговую смету после замеров  и согласования.",
      },
      {
        q: "Можно ли работать с вашим дизайнером удалённо?",
        a: "Конечно! Мы успешно реализуем проекты по всей РФ и даже за рубежом. Нужно прислать фото окна в вашем интерьере и примерные размеры. Далее с вами свяжется наш дизайнер, который согласует желаемый вариант оформления, пришлет фото и видео образцов, а также инструкцию, как правильно замерить окно, чтобы исключить возможность ошибки Рассчитываем стоимость, если Вас все устраивает, то переходим к оплате и оформлению заказа. Или вносим изменения, прорабатывая заказ, пока Вы не получите именно тот вариант, что хотели! После подписания договора и внесения предоплаты Ваш заказ отправится на производство. В обозначенные сроки мы отправим готовые изделия, аккуратно и надежно упакованные, выбранной Вами транспортной компанией. Вам останется только повесить шторы и наслаждаться ими!",
      },
    ],
    [],
  );

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => (it.q + " " + it.a).toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">FAQ</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Частые вопросы</h1>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Короткие ответы по срокам, процессу и стоимости. Если не нашли вопрос — напишите нам.
            </p>

            <div className="mt-6">
              <label className="sr-only" htmlFor="faq-search">
                Поиск
              </label>
              <input
                id="faq-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по вопросам…"
                className="h-12 w-full rounded-2xl border border-black/10 bg-white/70 px-4 text-sm text-[color:var(--fg)] shadow-sm backdrop-blur outline-none transition focus:ring-2 focus:ring-[color:var(--accent)]/30 dark:border-white/10 dark:bg-white/5"
              />
            </div>

            <div className="mt-8 space-y-3">
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-white/60 p-5 text-sm text-[color:var(--muted)] dark:border-white/10 dark:bg-white/5">
                  Ничего не найдено. Попробуйте другой запрос.
                </div>
              ) : null}

              {filtered.map((it) => (
                <details
                  key={it.q}
                  className="group rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur transition dark:border-white/10 dark:bg-white/5"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[color:var(--fg)] outline-none">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-6 w-6 flex-none rounded-full border border-black/10 bg-white/70 text-[color:var(--muted)] shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10" />
                      <div className="flex-1">
                        {it.q}
                        <div className="mt-3 grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
                          <div className="overflow-hidden">
                            <div className="text-sm font-normal leading-6 text-[color:var(--muted)] opacity-0 transition-[opacity,transform] duration-300 ease-out -translate-y-1 group-open:opacity-100 group-open:translate-y-0">
                              {it.a}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-auto mt-0.5 text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)] transition-transform duration-300 ease-out group-open:rotate-45">
                        {"+"}
                      </div>
                    </div>
                  </summary>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
