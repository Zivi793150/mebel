"use client";

import Image from "next/image";
import { Container } from "@/components/Container";

type Step = {
  number: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    description: "Встретимся в шоу-руме или приедем к вам домой с образцами и визуалами коллекций, расскажем и покажем свойства тканей, поможем с выбором и сделаем точные замеры",
  },
  {
    number: "02",
    description: "Профессиональные дизайнеры создадут для Вас уникальный проект и 3D-модель",
  },
  {
    number: "03",
    description: "Сделаем расчет и предложим два варианта комплектации под Ваш бюджет",
  },
  {
    number: "04",
    description: "Проверим вашу ткань на световом оборудовании, чтобы исключить все дефекты",
  },
  {
    number: "05",
    description: "Наши мастера отошьют шторы и текстиль в технологичном цехе с применением немецкой фурнитуры и проверкой качества на каждом этапе по 30 параметрам",
  },
  {
    number: "06",
    description: "Дизайнеры сами повесят шторы, выровняют каждую складочку и расскажут, как ухаживать за текстилем, чтобы сохранить его первозданный вид в течение 10 лет",
  },
  {
    number: "07",
    description: "Расскажем, как управлять своей коллекцией текстиля в зависимости от сезона и типа помещения: спальни, гостиной или детской комнаты",
  },
  {
    number: "08",
    description: "Все комплектующие мы храним на собственном складе, и в случае обнаружения каких-то дефектов – приедем, заберем и всё бесплатно исправим",
  },
  {
    number: "09",
    description: "Обеспечиваем постгарантийное обслуживание, бережную стирку и химчистку, приезжаем, снимаем, чистим и возвращаем на окна",
  },
];

export function WorkSteps() {
  return (
    <section className="bg-[color:var(--bg)] py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-4">
              <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Порядок
              </span>
              <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Работы
              </span>
            </div>
            <p className="text-sm text-[color:var(--muted)] sm:text-base">
              Как мы работаем
            </p>

            <div className="relative mt-8 aspect-[4/5] overflow-hidden">
              <Image
                src="/gray_hero.jpg"
                alt="Порядок работы"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <a
                href="#cta"
                className="absolute bottom-6 left-6 inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]"
              >
                Получить консультацию
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-6 sm:grid-cols-2">
              {STEPS.map((step) => (
                <div key={step.number} className="border-b border-[color:var(--gray-lines)] pb-6">
                  <div className="text-xl font-medium text-[color:var(--fg)]">
                    {step.number}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
