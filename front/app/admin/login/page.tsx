"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = useMemo(() => {
    const raw = String(searchParams?.get("next") || "").trim();
    return raw && raw.startsWith("/admin") ? raw : "/admin";
  }, [searchParams]);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorText("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    }).catch(() => null);

    if (!res || !res.ok) {
      setStatus("error");
      setErrorText("Неверный логин или пароль");
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Админка</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">Войдите, чтобы редактировать каталог.</p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-3 rounded-3xl border border-black/10 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <label className="grid gap-1">
            <span className="text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)]">ЛОГИН</span>
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="h-11 rounded-2xl border border-black/10 bg-white/80 px-4 text-sm text-[color:var(--fg)] shadow-sm outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-white/[0.06]"
              autoComplete="username"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)]">ПАРОЛЬ</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="h-11 rounded-2xl border border-black/10 bg-white/80 px-4 text-sm text-[color:var(--fg)] shadow-sm outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-white/[0.06]"
              autoComplete="current-password"
            />
          </label>

          {status === "error" ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
              {errorText}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className={
              status === "loading"
                ? "mt-2 inline-flex h-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] opacity-70"
                : "mt-2 inline-flex h-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:opacity-95 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
            }
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
