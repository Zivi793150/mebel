import Link from "next/link";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CONTACTS } from "@/lib/constants";
import { CTA } from "@/sections/CTA";

export default function ContactsPage() {
  const coords = { lat: 54.7206719, lon: 20.5636115 };
  const yandexMapsUrl =
    `https://yandex.ru/maps/?ll=${coords.lon}%2C${coords.lat}&z=16&pt=${coords.lon}%2C${coords.lat}%2Cpm2rdm`;
  const yandexWidgetUrl =
    `https://yandex.ru/map-widget/v1/?ll=${coords.lon}%2C${coords.lat}&z=16&pt=${coords.lon}%2C${coords.lat}%2Cpm2rdm`;

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main className="py-14 sm:py-18">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
                КОНТАКТЫ
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                Свяжитесь с нами
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                Подскажем по стоимости, срокам и материалам, предложим 2–3 решения под ваш интерьер.
                Можно написать в мессенджер или приехать в салон.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={CONTACTS.telegramHref}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                >
                  Написать в Telegram
                </a>
                <a
                  href={CONTACTS.phoneHref}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  Позвонить
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/15 dark:bg-white/5">
                  <div className="text-sm font-semibold text-[color:var(--fg)]">Телефон</div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    <a className="text-[color:var(--fg)] hover:opacity-90" href={CONTACTS.phoneHref}>
                      {CONTACTS.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/15 dark:bg-white/5">
                  <div className="text-sm font-semibold text-[color:var(--fg)]">Telegram</div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    <a className="text-[color:var(--fg)] hover:opacity-90" href={CONTACTS.telegramHref}>
                      {CONTACTS.telegramHandle}
                    </a>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/15 dark:bg-white/5 sm:col-span-2">
                  <div className="text-sm font-semibold text-[color:var(--fg)]">Адрес</div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{CONTACTS.address}</div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href={yandexMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-white/70 px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      Открыть в Яндекс.Картах
                    </a>
                    <a
                      href={CONTACTS.phoneHref}
                      className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                    >
                      Построить маршрут по телефону
                    </a>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/15 dark:bg-white/5">
                  <div className="text-sm font-semibold text-[color:var(--fg)]">E-mail</div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    <a className="text-[color:var(--fg)] hover:opacity-90" href={`mailto:${CONTACTS.email}`}>
                      {CONTACTS.email}
                    </a>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/15 dark:bg-white/5">
                  <div className="text-sm font-semibold text-[color:var(--fg)]">Соцсети</div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">koenigroom</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-black/10 bg-white/50 p-6 backdrop-blur dark:border-white/15 dark:bg-white/5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--fg)]">Мы на карте</div>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
                      Калининград, улица Молодой Гвардии, 34к2
                    </p>
                  </div>
                  <a
                    href={yandexMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-white/70 px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    Открыть
                  </a>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5">
                  <div className="relative h-[340px] w-full sm:h-[420px]">
                    <iframe
                      src={yandexWidgetUrl}
                      title="Yandex Map"
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/about"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    О компании
                  </Link>
                  <Link
                    href="/catalog/curtains"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95"
                  >
                    В каталог
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <div className="mt-14">
          <CTA />
        </div>
      </main>

      <Footer />
    </div>
  );
}
