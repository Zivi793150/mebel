"use client";

import { useMemo } from "react";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { ContactButton } from "@/components/ContactButton";

type FaqItem = {
  q: string;
  a: string;
};

export default function FaqPage() {
  const items: FaqItem[] = useMemo(
    () => [
      {
        q: "Сколько занимает заказ?",
        a: "Срок изготовления зависит от сложности пошива и наличия ткани. Если это ткани из Москвы, то срок пошива заказа от двух недель и более.",
      },
      {
        q: "Вы выезжаете на замер?",
        a: "Да. Замеры позволяют учесть особенности помещения, окон и создать изделие, идеально подходящее по размеру и стилю. После замеров наш дизайнер предложит вам 2–3 варианта оформления.",
      },
      {
        q: "Можно ли заказать только пошив?",
        a: "Да, вы можете заказать пошив. Но для идеального оформления мы рекомендуем вам делать замеры с нашим специалистом.",
      },
      {
        q: "Как подобрать ткань под освещение в интерьере?",
        a: "Мы учитываем расположение окон, естественное и искусственное освещение, назначение комнаты и желаемую приватность. Можно подобрать как мягкие ткани, так и блэкаут.",
      },
      {
        q: "С какими категориями изделий вы работаете?",
        a: "Шторы, карнизы, жалюзи, плиссе, римские шторы, австрийские шторы, декоративные аксессуары, текстиль для спальни, постельное белье и декоративные подушки.",
      },
      {
        q: "Сколько стоит проект?",
        a: "Стоимость зависит от материалов (ткани, карнизов, фурнитуры), а также стоимости услуг по пошиву, оформлению и монтажу. Мы готовим для вас итоговую смету после замеров и согласования.",
      },
      {
        q: "Можно ли работать с вашим дизайнером удалённо?",
        a: "Конечно! Мы успешно реализуем проекты по всей РФ и даже за рубежом. Нужно прислать фото окна в вашем интерьере и примерные размеры. Далее с вами свяжется наш дизайнер, который согласует желаемый вариант оформления, пришлет фото и видео образцов, а также инструкцию, как правильно замерить окно, чтобы исключить возможность ошибки.",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main className="py-14 sm:py-18">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Hero */}
            <section className="text-center">
              <h1 className="text-4xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-5xl lg:text-6xl">
                FAQ
              </h1>
              <p className="mt-4 max-w-xl mx-auto text-base leading-7 text-[color:var(--muted)]">
                Частые вопросы по срокам, процессу и стоимости
              </p>
              <div className="mt-8">
                <ContactButton
                  className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]"
                  imageSrc="/foto-na-knopku-1-.webp"
                >
                  Напишите нам
                </ContactButton>
              </div>
            </section>

            {/* FAQ List */}
            <div className="mt-12 space-y-0">
              {items.map((it, idx) => (
                <details
                  key={it.q}
                  className="group border-b border-[color:var(--gray-lines)] py-5"
                >
                  <summary className="cursor-pointer list-none text-sm font-medium text-[color:var(--fg)] outline-none">
                    <div className="flex items-start gap-4">
                      <div className="text-xs font-semibold tracking-[0.2em] text-[color:var(--muted)]">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
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
      <MobileCtaBar />
    </div>
  );
}
