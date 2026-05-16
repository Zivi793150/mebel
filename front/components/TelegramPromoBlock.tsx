import Image from "next/image";
import { Container } from "./Container";
import { CONTACTS } from "@/lib/constants";

export function TelegramPromoBlock() {
  return (
    <section className="relative h-[300px] w-full overflow-hidden sm:h-[350px]">
      <Image
        src="/ab1.webp"
        alt="Телеграм-канал"
        fill
        className="object-cover brightness-[0.6]"
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium tracking-wide text-white/90 sm:text-base">
              Посмотрите портфолио и почерпните идеи для интерьера
            </p>
            <h2 className="mt-4 text-3xl font-semibold uppercase tracking-[0.1em] text-white sm:text-5xl lg:text-6xl">
              Присоединяйтесь к нашему каналу
            </h2>
            <div className="mt-8">
              <a
                href={CONTACTS.telegramHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center bg-white/20 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition hover:bg-white/30 sm:text-xs"
              >
                Присоединиться к телеграм-каналу
              </a>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
