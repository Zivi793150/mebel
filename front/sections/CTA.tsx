import { Container } from "@/components/Container";
import { ContactButton } from "@/components/ContactButton";
import { CONTACTS } from "@/lib/constants";

interface CTAProps {
  imageSrc?: string;
}

export function CTA({ imageSrc = "/foto-na-knopku-1-.webp" }: CTAProps) {
  return (
    <section id="cta" className="py-14 sm:py-18">
      <Container>
        <div className="relative overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)] p-6 sm:p-10">
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
                <ContactButton
                  className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-5 text-sm font-medium text-white transition hover:opacity-90"
                  imageSrc={imageSrc}
                >
                  Связаться
                </ContactButton>
                <a
                  href={CONTACTS.phoneHref}
                  className="inline-flex h-12 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] px-5 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--gray-lines)]"
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
