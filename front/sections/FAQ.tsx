import { Container } from "@/components/Container";

const FAQ_ITEMS = [
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
              <summary className="cursor-pointer list-none text-sm font-semibold text-[color:var(--fg)] outline-none">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    {i.q}
                    <div className="mt-3 grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <div className="text-sm font-normal leading-6 text-[color:var(--muted)] opacity-0 transition-[opacity,transform] duration-300 ease-out -translate-y-1 group-open:opacity-100 group-open:translate-y-0">
                          {i.a}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto mt-0.5 text-[color:var(--muted)] transition-transform duration-300 ease-out group-open:rotate-45">
                    +
                  </div>
                </div>
              </summary>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
