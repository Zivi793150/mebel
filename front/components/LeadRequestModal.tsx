"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import { IconTelegram } from "@/components/icons";
import { CONTACTS } from "@/lib/constants";

function useOnClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      handler();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [handler, ref]);
}

export type LeadContext = {
  productType: string;
  source?: string;
  kind?: string;
  url?: string;
  title?: string;
  category?: string;
  image?: string;
  images?: string[];
};

export function LeadRequestModal({
  context,
  onClose,
}: {
  context: LeadContext;
  onClose: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(wrapRef, onClose);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorText, setErrorText] = useState<string>("");

  const title = useMemo(() => context.title || "Заявка", [context.title]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function onSubmit() {
    if (status === "sending") return;

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();

    if (cleanName.length < 2) {
      setStatus("error");
      setErrorText("Проверьте имя.");
      return;
    }
    if (cleanPhone.length < 7) {
      setStatus("error");
      setErrorText("Проверьте телефон.");
      return;
    }
    if (cleanMessage.length < 3) {
      setStatus("error");
      setErrorText("Добавьте сообщение.");
      return;
    }

    setStatus("sending");
    setErrorText("");
    try {
      const res = await fetch("/api/lead-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          message: cleanMessage,
          context,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string; detail?: string }
          | null;
        const msg =
          data?.detail ||
          data?.error ||
          `Ошибка отправки (${res.status})`;
        setErrorText(msg);
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorText("Не удалось отправить. Проверьте соединение.");
      setStatus("error");
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div
        ref={wrapRef}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl border border-black/10 bg-white/90 p-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-black/70"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            ←
          </button>
          <h3 className="px-3 text-center text-lg font-semibold sm:text-xl">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="my-4 h-px w-full bg-black/10 dark:bg-white/10" />

        {status === "sent" ? (
          <div className="grid gap-3">
            <div className="rounded-3xl border border-black/10 bg-white/60 p-6 text-sm text-[color:var(--fg)] shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              Заявка отправлена. Мы свяжемся с вами.
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="text-sm font-semibold text-[color:var(--fg)]">Остались вопросы?</div>
              <div className="mt-2 text-sm text-[color:var(--muted)]">Напишите нам напрямую в Telegram.</div>
              <div className="mt-4">
                <a
                  href={CONTACTS.telegramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:opacity-95 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                >
                  <IconTelegram className="h-5 w-5" />
                  Написать нам напрямую
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {context.title || context.category ? (
              <div className="rounded-3xl border border-black/10 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ТОВАР</div>
                <div className="mt-2 text-sm text-[color:var(--fg)]">
                  {context.title ? <div className="font-semibold">{context.title}</div> : null}
                  {context.category ? <div className="text-[color:var(--muted)]">{context.category}</div> : null}
                </div>
              </div>
            ) : null}

            <label className="grid gap-1">
              <span className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ИМЯ</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-2xl border border-black/10 bg-white/80 px-4 text-sm text-[color:var(--fg)] shadow-sm outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-white/[0.06]"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ТЕЛЕФОН</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-2xl border border-black/10 bg-white/80 px-4 text-sm text-[color:var(--fg)] shadow-sm outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-white/[0.06]"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">СООБЩЕНИЕ</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-[color:var(--fg)] shadow-sm outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-white/[0.06]"
              />
            </label>

            {status === "error" ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
                {errorText || "Не удалось отправить. Проверьте данные."}
              </div>
            ) : null}

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={onSubmit}
                disabled={status === "sending"}
                className={
                  status === "sending"
                    ? "inline-flex h-11 items-center justify-center rounded-2xl bg-black/10 px-4 text-sm font-semibold text-[color:var(--muted)] shadow-sm dark:bg-white/10"
                    : "inline-flex h-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:opacity-95 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                }
              >
                Отправить
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
              >
                Закрыть
              </button>
            </div>

            <div className="mt-1 text-sm text-[color:var(--muted)]">
              Остались вопросы?{" "}
              <a
                href={CONTACTS.telegramHref}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[color:var(--fg)] underline decoration-black/20 underline-offset-4 hover:decoration-black/40 dark:decoration-white/20 dark:hover:decoration-white/40"
              >
                Напишите нам напрямую
              </a>
              .
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
