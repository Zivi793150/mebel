"use client";

import { Container } from "@/components/Container";
import { CONTACTS } from "@/lib/constants";
import { ContactButton } from "@/components/ContactButton";


export function DesignersContact() {
  return (
    <section id="contact" className="bg-[color:var(--sand)] py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <div className="mb-8">
              <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Стать
              </span>
              <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                партнёром
              </span>
            </div>
            <p className="text-base leading-7 text-[color:var(--muted)] sm:text-lg">
              Присоединяйтесь к нашей программе для дизайнеров. Получайте особые условия, приоритетное обслуживание и полную поддержку на всех этапах проекта.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[color:var(--bg)] text-[color:var(--fg)]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-[color:var(--fg)]">Адрес</div>
                  <div className="text-sm text-[color:var(--muted)]">{CONTACTS.address}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[color:var(--bg)] text-[color:var(--fg)]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-[color:var(--fg)]">Телефон</div>
                  <div className="text-sm text-[color:var(--muted)]">{CONTACTS.phoneDisplay}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-[color:var(--bg)] text-[color:var(--fg)]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-[color:var(--fg)]">Режим работы</div>
                  <div className="text-sm text-[color:var(--muted)]">
                    <div>пн-пт 10:00 - 19:00</div>
                    <div>сб 11:00 - 17:00</div>
                    <div>вс выходной</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--bg)] p-6 sm:p-8">
            <h3 className="text-lg font-medium text-[color:var(--fg)]">
              Записаться на встречу
            </h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Руководитель отдела по работе с дизайнерами свяжется с вами
            </p>

            <div className="mt-6 grid gap-3">
              <ContactButton className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-6 text-sm font-medium text-white transition hover:opacity-90" imageSrc="/devochka-dizayneram.webp" useRandomImage={false}>
                Связаться
              </ContactButton>

              <a
                href={CONTACTS.phoneHref}
                className="inline-flex h-12 items-center justify-center border border-[color:var(--divider)] bg-transparent px-6 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--sand)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Позвонить: {CONTACTS.phoneDisplay}
              </a>

              <div className="bg-[color:var(--sand)] p-4">
                <p className="text-xs leading-5 text-[color:var(--muted)]">
                  <span className="font-medium text-[color:var(--fg)]">Рады видеть вас в нашем салоне текстиля</span> с удобным паркингом. По всем вопросам можете обращаться к руководителю отдела по работе с дизайнерами.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
