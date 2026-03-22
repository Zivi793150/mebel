"use client";

import { Container } from "@/components/Container";

export function Team() {
  return (
    <section className="bg-[color:var(--bg)] py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="mb-8">
              <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Команда
              </span>
              <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                дизайнеров
              </span>
            </div>
            <a
              href="#cta"
              className="inline-flex h-12 items-center justify-center border border-[color:var(--fg)] bg-transparent px-8 text-xs font-normal uppercase tracking-[0.15em] text-[color:var(--fg)] transition hover:bg-[color:var(--fg)] hover:text-[color:var(--bg)]"
            >
              Пригласить дизайнера
            </a>
          </div>
          <div className="lg:col-span-6">
            <div className="text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              <p className="mb-4">
                При создании текстиля для Вас мы черпаем вдохновение из текстильных традиций всего мира, продумываем каждую деталь, используем чувственные текстуры и насыщенные цвета.
              </p>
              <p className="mb-4">
                Собрали огромную библиотеку дизайнерских тканей, наши коллекции отличаются редкими материалами, особенным дизайном и традиционными методами изготовления.
              </p>
              <p className="mb-4">
                Создали высокотехнологичный цех с современным оборудованием и мастерами высокого уровня, автоматизировали все процессы и сами проверяем качество каждой ткани перед использованием в производстве.
              </p>
              <p>
                Все наши дизайнеры имеют высшее художественное образование, любят свое дело и всегда подбирают идеальные ткани и цветовую гамму под Ваш интерьер.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
