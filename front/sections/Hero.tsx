import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Container } from "@/components/Container";

export function Hero() {
  const title =
    "Каталог, который закрывает окна, свет и настроение интерьера — в одном месте.";
  const titleWords = title.split(" ");

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Koenig Room"
          fill
          sizes="100vw"
          className="object-cover scale-[1.04] blur-[2px] brightness-[0.62] dark:brightness-[0.48]"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,255,255,0.10),transparent_55%),linear-gradient(to_bottom,rgba(10,12,18,0.55),rgba(10,12,18,0.62),rgba(10,12,18,0.78))] dark:bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(to_bottom,rgba(8,12,20,0.58),rgba(8,12,20,0.68),rgba(8,12,20,0.84))]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_80%_80%,rgba(0,0,0,0.35),transparent_60%)]" />
      </div>

      <Container>
        <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">
          <div className="relative z-10 lg:col-span-7">
            <h1
              className="kr-word-title max-w-[46rem] text-[clamp(1.7rem,2.3vw,3.25rem)] font-semibold leading-tight tracking-tight text-white"
              aria-label={title}
              style={{ textShadow: "0 18px 60px rgba(0,0,0,0.55)" }}
            >
              {titleWords.map((w, i) => (
                <span key={i}>
                  <span className="kr-word" style={{ "--i": i } as CSSProperties}>
                    {w}
                  </span>
                  {i === titleWords.length - 1 ? "" : " "}
                </span>
              ))}
            </h1>

            <p
              className="mt-4 max-w-xl text-pretty text-base leading-7 text-white sm:text-lg"
              style={{ textShadow: "0 14px 44px rgba(0,0,0,0.55)" }}
            >
              Подбираем ткани и решения под стиль пространства. Шьём, собираем,
              устанавливаем. Чистый премиум без лишнего шума.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#cta"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-[#0b1220] shadow-sm transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Рассчитать стоимость
              </Link>
              <Link
                href="#catalog"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 bg-white/0 px-5 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Смотреть каталог
              </Link>
            </div>
          </div>

          <div className="relative z-10 lg:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-[520px] sm:max-w-[760px] lg:max-w-[980px]">
              <Image
                src="/logo.png"
                alt="Koenig Room"
                fill
                sizes="1240px"
                className="object-contain scale-[1.18] lg:scale-[1.45] xl:scale-[1.65]"
                style={{
                  filter:
                    "drop-shadow(0 0 1px rgba(255,255,255,0.95)) drop-shadow(0 0 3px rgba(255,255,255,0.85)) drop-shadow(0 0 14px rgba(230,242,255,0.55)) drop-shadow(0 0 32px rgba(210,232,255,0.42)) drop-shadow(0 18px 60px rgba(0,0,0,0.55))",
                }}
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
