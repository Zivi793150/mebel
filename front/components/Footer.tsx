import { CONTACTS } from "@/lib/constants";
import { Container } from "@/components/Container";
import { IconInstagram, IconWhatsapp } from "@/components/icons";

export function Footer() {
  return (
    <footer id="contacts" className="border-t border-black/5 dark:border-white/10">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="text-lg font-semibold text-[color:var(--fg)]">
              Koenig Room
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-[color:var(--muted)]">
              Премиальные шторы, жалюзи и интерьерный декор. Подбор, пошив,
              установка — в едином стандарте качества.
            </p>
          </div>

          <div className="md:col-span-4">
            <div className="text-sm font-semibold text-[color:var(--fg)]">
              Связь с нами
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <a
                className="text-[color:var(--fg)] hover:opacity-90"
                href={CONTACTS.phoneHref}
              >
                {CONTACTS.phoneDisplay}
              </a>
              <a
                className="text-[color:var(--fg)] hover:opacity-90"
                href={`mailto:${CONTACTS.email}`}
              >
                {CONTACTS.email}
              </a>
              <div className="text-[color:var(--muted)]">{CONTACTS.address}</div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-sm font-semibold text-[color:var(--fg)]">
              Соцсети
            </div>
            <div className="mt-3 flex items-center gap-2">
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                aria-label="Instagram"
              >
                <IconInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-[color:var(--fg)] shadow-sm backdrop-blur transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                aria-label="WhatsApp"
              >
                <IconWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-black/5 py-6 text-xs text-[color:var(--muted)] dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Koenig Room</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[color:var(--fg)]">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-[color:var(--fg)]">
              Публичная оферта
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
