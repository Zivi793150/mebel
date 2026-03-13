import { Container } from "@/components/Container";
import { CONTACTS } from "@/lib/constants";

export function CTA() {
  return (
    <section id="cta" className="py-14 sm:py-18">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-[color:var(--accent-soft)] p-6 shadow-sm dark:border-white/10 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_20%_20%,rgba(0,0,0,0.06),transparent_60%)] dark:bg-[radial-gradient(700px_circle_at_20%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="relative grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-3xl">
                Напишите нам
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
                И мы сделаем расчет и предложим два варианта комплектации под Ваш бюджет
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="grid gap-3">
                <a
                  href={CONTACTS.telegramHref}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                >
                  Написать в Telegram
                </a>
                <a
                  href={CONTACTS.phoneHref}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  Позвонить: {CONTACTS.phoneDisplay}
                </a>
                <div className="text-center text-xs text-[color:var(--muted)]">
                  Ответим и предложим 2–3 решения под ваш стиль
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
