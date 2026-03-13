"use client";

import { Container } from "@/components/Container";
import { CONTACTS } from "@/lib/constants";

export function DesignersContact() {
  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--divider)] bg-gradient-to-br from-[color:var(--accent-soft)] to-transparent p-8 shadow-lg dark:border-white/10 sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[color:var(--accent)]/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[color:var(--accent)]/5 blur-2xl" />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)] uppercase">
                Стать партнёром
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Начните сотрудничество с Koenig Room
              </h2>
              <p className="mt-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                Присоединяйтесь к нашей программе для дизайнеров. Получайте особые условия, приоритетное обслуживание и полную поддержку на всех этапах проекта.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--fg)]">Адрес шоу-рума</div>
                    <div className="text-sm text-[color:var(--muted)]">г. Калининград, ул. М. Гвардии 34к2</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--fg)]">Телефон</div>
                    <div className="text-sm text-[color:var(--muted)]">{CONTACTS.phoneDisplay}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--fg)]">Режим работы</div>
                    <div className="text-sm text-[color:var(--muted)]">Ежедневно с 10:00 до 19:00</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--divider)] bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-white/5 dark:border-white/10 sm:p-8">
              <h3 className="text-xl font-semibold text-[color:var(--fg)]">
                Записаться на встречу
              </h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Руководитель отдела по работе с дизайнерами свяжется с вами
              </p>

              <div className="mt-6 grid gap-3">
                <a
                  href={CONTACTS.telegramHref}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[color:var(--accent)] px-6 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-md transition hover:opacity-95 hover:scale-[1.02]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Написать в Telegram
                </a>

                <a
                  href={CONTACTS.phoneHref}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-[color:var(--divider)] bg-white/70 px-6 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 dark:bg-white/5 dark:border-white/10"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Позвонить: {CONTACTS.phoneDisplay}
                </a>

                <div className="rounded-xl bg-[color:var(--accent-soft)] p-4">
                  <p className="text-xs leading-5 text-[color:var(--muted)]">
                    <span className="font-semibold text-[color:var(--fg)]">Рады видеть вас в нашем шоу-руме</span> с удобным паркингом. По всем вопросам можете обращаться к руководителю отдела по работе с дизайнерами.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
