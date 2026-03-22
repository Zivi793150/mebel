import Link from "next/link";

import { Container } from "@/components/Container";
import { CONTACTS } from "@/lib/constants";

export function PromoBlock() {
  return (
    <section className="bg-[#1a1a1a] py-14 sm:py-18">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-xs font-semibold tracking-[0.32em] text-white/50">
              БЕСПЛАТНО
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Визуализация текстиля в подарок
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
              Закажите дизайн-проект штор и получите 3D-визуализацию бесплатно. 
              Увидите, как текстиль будет смотреться в вашем интерьере до начала работ.
            </p>
            <div className="mt-6">
              <Link
                href="#cta"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black shadow-sm transition hover:bg-white/90"
              >
                Получить визуализацию
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-white/10">3D</div>
                <div className="mt-2 text-sm text-white/40">Визуализация вашего проекта</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
