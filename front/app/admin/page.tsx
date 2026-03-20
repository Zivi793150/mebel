"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getSchema } from "@/lib/adminSchemas";

type CollectionInfo = { name: string; count: number | null };

type DocRow = {
  _id: unknown;
  title?: string;
  slug?: string;
  url?: string;
  kind?: string;
  type?: string;
  variant?: string;
};

function stringifyId(v: unknown) {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v && "$oid" in (v as any)) return String((v as any).$oid);
  return String((v as any).toString?.() || "");
}

function pretty(obj: unknown) {
  return JSON.stringify(obj, null, 2);
}

function ensureString(v: unknown) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function ensureNumber(v: unknown) {
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function ensureBoolean(v: unknown) {
  return Boolean(v);
}

function ensureStringArray(v: unknown) {
  if (Array.isArray(v)) return v.map((x) => ensureString(x)).filter(Boolean);
  return [] as string[];
}

function normalizeImageFields(doc: Record<string, unknown>) {
  const image = ensureString(doc.image);
  const images = ensureStringArray(doc.images);
  const uniq = Array.from(new Set([image, ...images].filter(Boolean)));
  return {
    image: image || uniq[0] || "",
    images: uniq,
  };
}

function buildDefaultDoc() {
  return {
    source: "",
    kind: "",
    title: "",
    description: "",
    url: "",
    image: "",
    images: [] as string[],
  };
}

export default function AdminPage() {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [collection, setCollection] = useState<string>("");
  const [q, setQ] = useState<string>("");
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [doc, setDoc] = useState<Record<string, unknown> | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);
  const [docText, setDocText] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canEdit = Boolean(collection);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/collections").catch(() => null);
      const data = (res && res.ok ? await res.json().catch(() => null) : null) as
        | { collections?: CollectionInfo[] }
        | null;
      const cols = data?.collections || [];
      setCollections(cols);
      if (!collection && cols.length) setCollection(cols[0].name);
    })();
  }, [collection]);

  async function loadList() {
    if (!collection) return;
    setLoading(true);
    try {
      const url = new URL(window.location.origin + "/api/admin/docs");
      url.searchParams.set("collection", collection);
      if (q.trim()) url.searchParams.set("q", q.trim());
      const res = await fetch(url.toString()).catch(() => null);
      const data = (res && res.ok ? await res.json().catch(() => null) : null) as
        | { docs?: DocRow[]; total?: number }
        | null;
      setDocs(data?.docs || []);
      setTotal(Number(data?.total || 0));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
    setActiveId(null);
    setDoc(null);
    setDocText("");
    setAdvancedOpen(false);
  }, [collection]);

  async function openDoc(id: string) {
    if (!collection) return;
    setLoading(true);
    try {
      const url = new URL(window.location.origin + "/api/admin/doc");
      url.searchParams.set("collection", collection);
      url.searchParams.set("id", id);
      const res = await fetch(url.toString()).catch(() => null);
      const data = (res && res.ok ? await res.json().catch(() => null) : null) as
        | { doc?: Record<string, unknown> | null }
        | null;
      setActiveId(id);
      const raw = (data?.doc as any) || null;
      if (raw && typeof raw === "object") {
        const next = { ...raw } as Record<string, unknown>;
        const img = normalizeImageFields(next);
        next.image = img.image;
        next.images = img.images;
        setDoc(next);
        setDocText(pretty(next));
      } else {
        setDoc(null);
        setDocText(pretty({}));
      }
      setAdvancedOpen(false);
    } finally {
      setLoading(false);
    }
  }

  async function createNew() {
    setActiveId("__new__");
    const base = buildDefaultDoc();
    setDoc(base as any);
    setDocText(pretty(base));
    setAdvancedOpen(false);
  }

  async function saveDoc() {
    if (!collection || !activeId) return;
    setSaving(true);
    try {
      if (!doc) {
        alert("Нет данных для сохранения");
        return;
      }

      const normalized = { ...doc } as Record<string, unknown>;
      const img = normalizeImageFields(normalized);
      normalized.image = img.image;
      normalized.images = img.images;

      if (activeId === "__new__") {
        const res = await fetch("/api/admin/doc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection, doc: normalized }),
        }).catch(() => null);
        const data = (res && res.ok ? await res.json().catch(() => null) : null) as { id?: string } | null;
        if (!res || !res.ok || !data?.id) {
          alert("Не удалось создать");
          return;
        }
        await loadList();
        await openDoc(data.id);
        return;
      }

      const res = await fetch("/api/admin/doc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, id: activeId, doc: normalized }),
      }).catch(() => null);

      if (!res || !res.ok) {
        alert("Не удалось сохранить");
        return;
      }

      await loadList();
      await openDoc(activeId);
    } finally {
      setSaving(false);
    }
  }

  async function deleteDoc(id: string) {
    if (!collection) return;
    const ok = confirm("Удалить документ?" + "\n" + id);
    if (!ok) return;

    const url = new URL(window.location.origin + "/api/admin/doc");
    url.searchParams.set("collection", collection);
    url.searchParams.set("id", id);
    const res = await fetch(url.toString(), { method: "DELETE" }).catch(() => null);
    if (!res || !res.ok) {
      alert("Не удалось удалить");
      return;
    }

    if (activeId === id) {
      setActiveId(null);
      setActiveDoc(null);
      setDocText("");
    }
    await loadList();
  }

  async function uploadFiles(files: FileList | null) {
    if (!collection || !files || files.length === 0) return;

    const form = new FormData();
    form.set("collection", collection);
    Array.from(files).forEach((f) => form.append("files", f));

    const res = await fetch("/api/admin/upload", { method: "POST", body: form }).catch(() => null);
    const data = (res && res.ok ? await res.json().catch(() => null) : null) as { files?: string[] } | null;
    const uploaded = data?.files || [];
    if (uploaded.length === 0) {
      alert("Загрузка не удалась");
      return;
    }

    setDoc((prev) => {
      const base = (prev && typeof prev === "object" ? { ...prev } : buildDefaultDoc()) as Record<string, unknown>;
      const current = normalizeImageFields(base);
      const nextImages = Array.from(new Set([...current.images, ...uploaded].filter(Boolean)));
      base.images = nextImages;
      base.image = current.image || uploaded[0] || "";
      setDocText(pretty(base));
      return base;
    });
  }

  const selectedCollectionInfo = useMemo(
    () => collections.find((c) => c.name === collection) || null,
    [collections, collection],
  );

  const schema = useMemo(() => getSchema(collection), [collection]);
  const effectiveSchema = useMemo(() => {
    return (
      schema || {
        title: collection || "Документы",
        supportsImages: true,
        fields: [
          { key: "title", label: "Название", type: "string" as const },
          { key: "description", label: "Описание", type: "text" as const },
          { key: "source", label: "Источник", type: "string" as const },
          { key: "kind", label: "Тип (kind)", type: "string" as const },
          { key: "url", label: "URL", type: "string" as const },
        ],
      }
    );
  }, [collection, schema]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    window.location.href = "/admin/login";
  }

  function setFieldValue(key: string, value: unknown) {
    setDoc((prev) => {
      const base = (prev && typeof prev === "object" ? { ...prev } : buildDefaultDoc()) as Record<string, unknown>;
      base[key] = value;
      const img = normalizeImageFields(base);
      base.image = img.image;
      base.images = img.images;
      setDocText(pretty(base));
      return base;
    });
  }

  const images = useMemo(() => {
    if (!doc) return [] as string[];
    return normalizeImageFields(doc).images;
  }, [doc]);

  const mainImage = useMemo(() => {
    if (!doc) return "";
    return normalizeImageFields(doc).image;
  }, [doc]);

  function removeImage(src: string) {
    if (!doc) return;
    const next = { ...doc } as Record<string, unknown>;
    const img = normalizeImageFields(next);
    const filtered = img.images.filter((x) => x !== src);
    next.images = filtered;
    next.image = img.image === src ? filtered[0] || "" : img.image;
    setDoc(next);
    setDocText(pretty(next));
  }

  function setMainImage(src: string) {
    if (!doc) return;
    const next = { ...doc } as Record<string, unknown>;
    const img = normalizeImageFields(next);
    next.image = src;
    next.images = Array.from(new Set([src, ...img.images].filter(Boolean)));
    setDoc(next);
    setDocText(pretty(next));
  }

  function renderField(field: { key: string; label: string; type: string; placeholder?: string }) {
    const value = doc ? (doc as any)[field.key] : undefined;

    if (field.type === "text") {
      return (
        <label key={field.key} className="grid gap-1">
          <span className="text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)]">{field.label}</span>
          <textarea
            value={ensureString(value)}
            onChange={(e) => setFieldValue(field.key, e.target.value)}
            rows={4}
            placeholder={field.placeholder}
            className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-[color:var(--fg)] shadow-sm outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-white/[0.06]"
          />
        </label>
      );
    }

    if (field.type === "number") {
      return (
        <label key={field.key} className="grid gap-1">
          <span className="text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)]">{field.label}</span>
          <input
            value={String(value ?? "")}
            onChange={(e) => setFieldValue(field.key, e.target.value === "" ? "" : Number(e.target.value))}
            type="number"
            placeholder={field.placeholder}
            className="h-11 rounded-2xl border border-black/10 bg-white/80 px-4 text-sm text-[color:var(--fg)] shadow-sm outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-white/[0.06]"
          />
        </label>
      );
    }

    if (field.type === "boolean") {
      return (
        <label key={field.key} className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
          <span className="font-semibold text-[color:var(--fg)]">{field.label}</span>
          <input
            checked={ensureBoolean(value)}
            onChange={(e) => setFieldValue(field.key, e.target.checked)}
            type="checkbox"
            className="h-5 w-5"
          />
        </label>
      );
    }

    if (field.type === "string_array") {
      const arr = ensureStringArray(value);
      return (
        <label key={field.key} className="grid gap-1">
          <span className="text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)]">{field.label}</span>
          <textarea
            value={arr.join("\n")}
            onChange={(e) => {
              const next = e.target.value
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter(Boolean);
              setFieldValue(field.key, next);
            }}
            rows={3}
            placeholder={field.placeholder}
            className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-[color:var(--fg)] shadow-sm outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-white/[0.06]"
          />
        </label>
      );
    }

    return (
      <label key={field.key} className="grid gap-1">
        <span className="text-xs font-semibold tracking-[0.24em] text-[color:var(--muted)]">{field.label}</span>
        <input
          value={ensureString(value)}
          onChange={(e) => setFieldValue(field.key, e.target.value)}
          placeholder={field.placeholder}
          className="h-11 rounded-2xl border border-black/10 bg-white/80 px-4 text-sm text-[color:var(--fg)] shadow-sm outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-white/[0.06]"
        />
      </label>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Админка</h1>
            <div className="mt-1 text-sm text-[color:var(--muted)]">MongoDB: koenig</div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
          >
            Выйти
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">КОЛЛЕКЦИЯ</div>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="mt-3 h-11 w-full rounded-2xl border border-black/10 bg-white/80 px-3 text-sm shadow-sm outline-none dark:border-white/10 dark:bg-white/[0.06]"
              >
                {collections.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} {typeof c.count === "number" ? `(${c.count})` : ""}
                  </option>
                ))}
              </select>

              <div className="mt-5 grid gap-2">
                <div className="grid grid-cols-[1fr,auto] gap-2">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Поиск (title/slug/url/kind...)"
                    className="h-11 rounded-2xl border border-black/10 bg-white/80 px-4 text-sm shadow-sm outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-white/[0.06]"
                  />
                  <button
                    type="button"
                    onClick={loadList}
                    disabled={!canEdit || loading}
                    className={
                      !canEdit || loading
                        ? "inline-flex h-11 items-center justify-center rounded-2xl bg-black/5 px-4 text-sm font-semibold text-[color:var(--muted)] dark:bg-white/5"
                        : "inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                    }
                  >
                    Найти
                  </button>
                </div>

                <button
                  type="button"
                  onClick={createNew}
                  disabled={!canEdit}
                  className={
                    !canEdit
                      ? "inline-flex h-11 items-center justify-center rounded-2xl bg-black/5 px-4 text-sm font-semibold text-[color:var(--muted)] dark:bg-white/5"
                      : "inline-flex h-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:opacity-95 active:translate-y-px"
                  }
                >
                  + Добавить
                </button>

                <div className="mt-2 text-sm text-[color:var(--muted)]">
                  Показано: <span className="font-semibold text-[color:var(--fg)]">{docs.length}</span> / {total}
                </div>
              </div>

              <div className="mt-5 max-h-[60vh] overflow-auto rounded-2xl border border-black/10 bg-white/50 p-2 dark:border-white/10 dark:bg-white/[0.03]">
                {docs.map((d) => {
                  const id = stringifyId(d._id);
                  const label = d.title || d.slug || d.url || id;
                  const isActive = activeId === id;
                  return (
                    <div key={id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openDoc(id)}
                        className={
                          "my-1 flex-1 rounded-xl px-3 py-2 text-left text-sm transition " +
                          (isActive
                            ? "bg-[color:var(--accent)]/12 text-[color:var(--fg)]"
                            : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]")
                        }
                      >
                        <div className="font-medium text-[color:var(--fg)]">{label}</div>
                        <div className="mt-0.5 text-xs text-[color:var(--muted)]">
                          {(d.kind || "").toString()} {(d.type || "").toString()} {(d.variant || "").toString()}
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDoc(id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-sm shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                        aria-label="Удалить"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}

                {docs.length === 0 ? (
                  <div className="p-4 text-sm text-[color:var(--muted)]">Ничего не найдено.</div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">РЕДАКТОР</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    {collection}
                    {selectedCollectionInfo ? "" : ""}
                    {activeId ? ` / ${activeId}` : ""}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => uploadFiles(e.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!activeId}
                    className={
                      !activeId
                        ? "inline-flex h-11 items-center justify-center rounded-2xl bg-black/5 px-4 text-sm font-semibold text-[color:var(--muted)] dark:bg-white/5"
                        : "inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                    }
                  >
                    Загрузить фото
                  </button>

                  <button
                    type="button"
                    onClick={saveDoc}
                    disabled={!activeId || saving}
                    className={
                      !activeId || saving
                        ? "inline-flex h-11 items-center justify-center rounded-2xl bg-black/5 px-4 text-sm font-semibold text-[color:var(--muted)] dark:bg-white/5"
                        : "inline-flex h-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:opacity-95 active:translate-y-px"
                    }
                  >
                    Сохранить
                  </button>
                </div>
              </div>

              <div className="mt-4">
                {!activeId ? (
                  <div className="rounded-2xl border border-black/10 bg-white/50 p-6 text-sm text-[color:var(--muted)] dark:border-white/10 dark:bg-white/[0.03]">
                    Выберите документ слева или нажмите “Добавить”.
                  </div>
                ) : (
                  <div className="grid gap-5 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                      <div className="grid gap-3">
                        <div className="rounded-3xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                          <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">
                            ПОЛЯ — {effectiveSchema.title}
                          </div>
                          <div className="mt-4 grid gap-3">
                            {effectiveSchema.fields.map((f) => renderField(f))}
                          </div>
                        </div>

                        {effectiveSchema.supportsImages !== false ? (
                          <div className="rounded-3xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ФОТО</div>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                              >
                                + Загрузить
                              </button>
                            </div>

                            <div className="mt-4 grid gap-3">
                              {images.length ? (
                                <div className="grid gap-3 sm:grid-cols-3">
                                  {images.map((src) => {
                                    const isMain = src === mainImage;
                                    return (
                                      <div
                                        key={src}
                                        className={
                                          "overflow-hidden rounded-2xl border bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5 " +
                                          (isMain ? "border-[color:var(--accent)] ring-2 ring-[color:var(--accent)]" : "border-black/10")
                                        }
                                      >
                                        <div className="relative aspect-[4/3]">
                                          <img src={src} alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 p-2">
                                          <button
                                            type="button"
                                            onClick={() => setMainImage(src)}
                                            className={
                                              "inline-flex h-9 items-center justify-center rounded-xl border px-2 text-xs font-semibold shadow-sm transition " +
                                              (isMain
                                                ? "border-[color:var(--accent)] bg-[color:var(--accent)]/10 text-[color:var(--fg)]"
                                                : "border-black/10 bg-black/[0.03] text-[color:var(--fg)] hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]")
                                            }
                                          >
                                            Главное
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => removeImage(src)}
                                            className="inline-flex h-9 items-center justify-center rounded-xl border border-black/10 bg-white/70 px-2 text-xs font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                                          >
                                            Удалить
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="rounded-2xl border border-black/10 bg-white/50 p-4 text-sm text-[color:var(--muted)] dark:border-white/10 dark:bg-white/[0.03]">
                                  Фото пока не загружены.
                                </div>
                              )}

                              <div className="text-xs text-[color:var(--muted)]">
                                Подсказка: “Главное” = поле <span className="font-semibold text-[color:var(--fg)]">image</span>,
                                список = <span className="font-semibold text-[color:var(--fg)]">images</span>.
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="rounded-3xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                        <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">ПРЕВЬЮ</div>

                        <div className="mt-4 overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5">
                          <div className="relative aspect-[4/3] bg-black/[0.03] dark:bg-white/[0.04]">
                            {mainImage ? <img src={mainImage} alt="" className="h-full w-full object-cover" /> : null}
                          </div>
                          <div className="p-5">
                            <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)]">
                              {ensureString(doc?.title) || ensureString(doc?.slug) || "(без названия)"}
                            </div>
                            <div className="mt-2 text-sm leading-6 text-[color:var(--muted)] whitespace-pre-line">
                              {ensureString(doc?.description) || "Описание не задано."}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setAdvancedOpen((v) => !v)}
                          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                        >
                          {advancedOpen ? "Скрыть расширенный режим" : "Расширенный режим (JSON)"}
                        </button>

                        {advancedOpen ? (
                          <div className="mt-3 grid gap-2">
                            <textarea
                              value={docText}
                              onChange={(e) => setDocText(e.target.value)}
                              spellCheck={false}
                              className="h-[34vh] w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-4 py-3 font-mono text-xs leading-5 text-[color:var(--fg)] shadow-sm outline-none dark:border-white/10 dark:bg-white/[0.06]"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  try {
                                    const parsed = JSON.parse(docText);
                                    if (!parsed || typeof parsed !== "object") throw new Error("bad");
                                    const next = { ...(parsed as Record<string, unknown>) };
                                    const img = normalizeImageFields(next);
                                    next.image = img.image;
                                    next.images = img.images;
                                    setDoc(next);
                                    setDocText(pretty(next));
                                  } catch {
                                    alert("JSON невалидный");
                                  }
                                }}
                                className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                              >
                                Применить JSON
                              </button>
                              <button
                                type="button"
                                onClick={() => setDocText(pretty(doc || {}))}
                                className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                              >
                                Сбросить JSON
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activeId ? <div className="mt-4 text-xs text-[color:var(--muted)]">Менеджеру достаточно: заполнить поля + загрузить фото + сохранить.</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
