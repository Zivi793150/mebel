import Link from "next/link";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { ContactButton } from "@/components/ContactButton";
import { CONTACTS } from "@/lib/constants";
import { IconInstagram, IconMax, IconRuTube, IconTelegram, IconTwoGis, IconVK } from "@/components/icons";

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
          {/* Hero */}
          <section className="text-center">
            <h1 className="text-4xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-5xl lg:text-6xl">
              Контакты
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-base leading-7 text-[color:var(--muted)]">
              Подскажем по стоимости, срокам и материалам
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

          {/* Contact Info */}
          <section className="mt-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <div className="space-y-6">
                  <div className="border-b border-[color:var(--gray-lines)] pb-6">
                    <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ТЕЛЕФОН</div>
                    <a className="mt-2 block text-lg text-[color:var(--fg)] hover:opacity-90" href={CONTACTS.phoneHref}>
                      {CONTACTS.phoneDisplay}
                    </a>
                  </div>

                  <div className="border-b border-[color:var(--gray-lines)] pb-6">
                    <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">TELEGRAM</div>
                    <ContactButton className="mt-2 block text-lg text-[color:var(--fg)] hover:opacity-90 text-left">
                      {CONTACTS.telegramHandle}
                    </ContactButton>
                  </div>

                  <div className="border-b border-[color:var(--gray-lines)] pb-6">
                    <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">АДРЕС</div>
                    <p className="mt-2 text-base leading-6 text-[color:var(--muted)]">{CONTACTS.address}</p>
                    <a
                      href={yandexMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-sm text-[color:var(--accent)] hover:opacity-90"
                    >
                      Открыть в Яндекс.Картах →
                    </a>
                  </div>

                  <div className="border-b border-[color:var(--gray-lines)] pb-6">
                    <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">E-MAIL</div>
                    <a className="mt-2 block text-lg text-[color:var(--fg)] hover:opacity-90" href={`mailto:${CONTACTS.email}`}>
                      {CONTACTS.email}
                    </a>
                  </div>

                  <div className="pb-6">
                    <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">МЫ В СОЦСЕТЯХ</div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <a
                        href={CONTACTS.telegramHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                        aria-label="Telegram"
                      >
                        <IconTelegram className="h-5 w-5" />
                      </a>
                      <a
                        href={CONTACTS.vkHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                        aria-label="VK"
                      >
                        <IconVK className="h-5 w-5" />
                      </a>
                      <a
                        href={CONTACTS.rutubeHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                        aria-label="RuTube"
                      >
                        <IconRuTube className="h-5 w-5" />
                      </a>
                      <a
                        href={CONTACTS.twoGisHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                        aria-label="2ГИС"
                      >
                        <IconTwoGis className="h-5 w-5" />
                      </a>
                      {CONTACTS.instagramHref ? (
                        <a
                          href={CONTACTS.instagramHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                          aria-label="Instagram"
                        >
                          <IconInstagram className="h-5 w-5" />
                        </a>
                      ) : null}
                      {CONTACTS.maxHref ? (
                        <a
                          href={CONTACTS.maxHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] text-[color:var(--fg)] transition hover:bg-[color:var(--bg)]"
                          aria-label="MAX"
                        >
                          <IconMax className="h-5 w-5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-6">
                  <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">МЫ НА КАРТЕ</div>
                  
                  <div className="mt-4 relative h-[340px] w-full sm:h-[420px]">
                    <iframe
                      src={yandexWidgetUrl}
                      title="Yandex Map"
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/about"
                      className="inline-flex h-11 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--card)] px-5 text-sm font-medium text-[color:var(--fg)] transition hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      О компании
                    </Link>
                    <Link
                      href="/catalog/curtains"
                      className="inline-flex h-11 items-center justify-center bg-[color:var(--accent)] px-5 text-sm font-medium text-[color:var(--accent-contrast)] transition hover:opacity-95"
                    >
                      В каталог
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
