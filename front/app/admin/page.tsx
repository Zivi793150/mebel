"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { 
  Plus, 
  Search, 
  Trash2, 
  LayoutGrid, 
  ListOrdered, 
  ChevronRight, 
  Image as ImageIcon,
  Save,
  LogOut,
  Upload,
  Eye,
  Settings,
  Code
} from "lucide-react";

import { getSchema } from "@/lib/adminSchemas";
import { SortableItem } from "@/components/admin/SortableItem";

type CollectionInfo = { name: string; count: number | null };

type DocRow = {
  _id: unknown;
  title?: string;
  slug?: string;
  url?: string;
  kind?: string;
  type?: string;
  variant?: string;
  collectionTitle?: string;
  subtypeTitle?: string;
  group?: string;
  image?: string;
  order?: number;
  category?: string;
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

function normalizeAdminImageSrc(raw: string) {
  const v = ensureString(raw).trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;

  let next = v.replace(/\\/g, "/");
  if (!next.startsWith("/")) next = "/" + next;

  try {
    next = decodeURIComponent(next);
  } catch {
    // ignore
  }

  const parts = next.split("/").filter((p) => p.length > 0);
  
  // If path starts with uploads/ - keep as is
  if (parts[0] === "uploads") {
    return encodeURI("/" + parts.join("/"));
  }
  
  // For catalog/ paths - deduplicate segments
  if (parts[0] === "catalog") {
    const deduped: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      if (i === 0 || parts[i] !== parts[i - 1]) {
        deduped.push(parts[i]);
      }
    }
    return encodeURI("/" + deduped.join("/"));
  }
  
  // For old paths without prefix - add /uploads/
  return encodeURI("/uploads/" + parts.join("/"));
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

function buildDefaultDoc(collectionName?: string) {
  const base: Record<string, unknown> = {
    source: "",
    kind: "",
    title: "",
    description: "",
    url: "",
    image: "",
    images: [] as string[],
  };

  // Set defaults based on collection
  if (collectionName === "cornices") {
    base.source = "koenig_room";
    base.kind = "cornice_item";
    base.type = "";
    base.collectionSlug = "";
    base.collectionTitle = "";
  }
  
  return base;
}

const COLLECTION_LABELS: Record<string, string> = {
  cornices: "🪟 Карнизы",
  curtain_types: "🧵 Виды штор",
  blinds_types: "🌤️ Жалюзи",
  roman_catalogs: "🏛️ Римские шторы",
  bedding_items: "🛏️ Постельное бельё",
  bedspreads_and_pillows: "🛌 Покрывала и подушки",
  carpet_items: "🧶 Ковры",
  decor_items: "🎀 Декор и фурнитура",
  leads: "📩 Заявки",
  catalog_items: "📦 Общий каталог",
  categories: "📂 Категории сайта",
  blinds_subcatalogs: "🔍 Подкатегории жалюзи",
  lead_contexts: "📍 Контекст заявок",
};

const COLLECTION_ORDER = [
  "cornices",
  "curtain_types",
  "blinds_types",
  "roman_catalogs",
  "bedding_items",
  "bedspreads_and_pillows",
  "carpet_items",
  "decor_items",
  "leads",
  "catalog_items",
  "categories",
  "blinds_subcatalogs",
  "lead_contexts",
];

const CORNICE_TYPE_ORDER = [
  "потолочные",
  "багетные",
  "металлические",
  "профильные",
  "латунные",
  "электро",
];

export default function AdminPage() {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [collection, setCollection] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = docs.findIndex((d) => stringifyId(d._id) === active.id);
    const newIndex = docs.findIndex((d) => stringifyId(d._id) === over.id);

    const newDocs = arrayMove(docs, oldIndex, newIndex);
    setDocs(newDocs);

    // Save new order to database
    const orders = newDocs.map((doc, index) => ({
      id: stringifyId(doc._id),
      order: index,
    }));

    try {
      await fetch("/api/admin/docs/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, orders }),
      });
    } catch (err) {
      console.error("Failed to save order", err);
    }
  }

  const sortedCollections = useMemo(() => {
    return [...collections].sort((a, b) => {
      const idxA = COLLECTION_ORDER.indexOf(a.name);
      const idxB = COLLECTION_ORDER.indexOf(b.name);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [collections]);
  const [q, setQ] = useState<string>("");
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>("ВСЕ");
  const [filterCollection, setFilterCollection] = useState<string>("ВСЕ");
  const [filterQuery, setFilterSubQuery] = useState<string>("");

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    docs.forEach((d) => {
      // Normalize to lowercase for Set uniqueness
      const t = String(d.type || d.group || d.category || d.variant || (d as any).style || "").toLowerCase().trim();
      if (t) set.add(t);
    });
    
    const types = Array.from(set);
    
    // Sort based on CORNICE_TYPE_ORDER if applicable, else alphabetical
    return types.sort((a, b) => {
      const idxA = CORNICE_TYPE_ORDER.indexOf(a);
      const idxB = CORNICE_TYPE_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [docs]);

  const availableCollections = useMemo(() => {
    const set = new Set<string>();
    
    docs.forEach((d) => {
      const dType = String(d.type || d.group || d.category || d.variant || (d as any).style || "").toLowerCase();
      const fType = filterType.toLowerCase();
      const typeMatch = filterType === "ВСЕ" || dType === fType;
      
      if (typeMatch) {
        if (d.collectionTitle) set.add(String(d.collectionTitle).trim());
        if ((d as any).collection) set.add(String((d as any).collection).trim());
        if (d.subtypeTitle) set.add(String(d.subtypeTitle).trim());
      }
    });
    return Array.from(set).sort();
  }, [docs, filterType]);

  const filteredDocs = useMemo(() => {
    const fType = filterType.toLowerCase();
    const fColl = filterCollection;
    const search = filterQuery.toLowerCase().trim();

    return docs.filter((d) => {
      const dType = String(d.type || d.group || d.category || "").toLowerCase();
      const typeMatch = filterType === "ВСЕ" || dType === filterType.toLowerCase();
      
      const dCollTitle = String(d.collectionTitle || (d as any).collection || "").trim();
      const dSubTitle = String(d.subtypeTitle || "").trim();
      const fCollTrim = fColl.trim();
      const collMatch = filterCollection === "ВСЕ" || dCollTitle === fCollTrim || dSubTitle === fCollTrim;
      
      const matchSearch = !search || 
        (d.title || "").toLowerCase().includes(search) || 
        (d.slug || "").toLowerCase().includes(search) ||
        (d.collectionTitle || "").toLowerCase().includes(search) ||
        (d.subtypeTitle || "").toLowerCase().includes(search);

      return typeMatch && collMatch && matchSearch;
    });
  }, [docs, filterType, filterCollection, filterQuery]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [doc, setDoc] = useState<Record<string, unknown> | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);
  const [docText, setDocText] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadSubfolder, setUploadSubfolder] = useState<string>("");
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<{ type?: string; collection?: string }>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Доступные подпапки для загрузки в uploads/
  const availableSubfolders = useMemo(() => {
    const map: Record<string, string[]> = {
      blinds_types: ["zhalyuzi"],
      catalog_items: ["shtory"],
      cornices: ["karnizy", "karnizy/potolochnye", "karnizy/bagetnye", "karnizy/metallicheskie", "karnizy/profilnye", "karnizy/latunnye", "karnizy/elektro"],
      decor_items: ["dekor"],
      carpet_items: ["kovry"],
      bedding_items: ["postel"],
      bedspreads_and_pillows: ["podushki"],
      roman_catalogs: ["rimskie"],
      blinds_subcatalogs: [],
    };
    return map[collection] || [];
  }, [collection]);

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

  const availableTaxonomyTypes = useMemo(() => {
    const set = new Set<string>();
    docs.forEach((d) => {
      const t = String(d.type || d.group || d.category || d.variant || (d as any).style || "").trim();
      if (t) set.add(t);
    });
    return Array.from(set).sort();
  }, [docs]);

  const availableTaxonomyCollections = useMemo(() => {
    const set = new Set<string>();
    const fType = selectedTaxonomy.type?.toLowerCase();
    docs.forEach((d) => {
      const dType = String(d.type || d.group || d.category || d.variant || (d as any).style || "").toLowerCase();
      if (!fType || dType === fType) {
        if (d.collectionTitle) set.add(String(d.collectionTitle).trim());
        if ((d as any).collection) set.add(String((d as any).collection).trim());
        if (d.subtypeTitle) set.add(String(d.subtypeTitle).trim());
      }
    });
    return Array.from(set).sort();
  }, [docs, selectedTaxonomy.type]);

  async function createNew() {
    setActiveId("__new__");
    const base = buildDefaultDoc(collection) as any;
    
    // Auto-fill taxonomy if selected
    if (selectedTaxonomy.type) {
      if (collection === "cornices") {
        base.type = selectedTaxonomy.type;
        // For cornices, often type and subtypeTitle are related
        base.subtypeTitle = selectedTaxonomy.type;
        base.subtype = selectedTaxonomy.type.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }
      else if (collection === "curtain_types") base.group = selectedTaxonomy.type;
      else if (collection === "decor_items") base.category = selectedTaxonomy.type;
      else if (collection === "blinds_subcatalogs") base.category = selectedTaxonomy.type;
      else if (collection === "bedding_items") base.variant = selectedTaxonomy.type;
      else if (collection === "bedspreads_and_pillows") base.variant = selectedTaxonomy.type;
      else if (collection === "carpet_items") base.style = selectedTaxonomy.type;
    }
    if (selectedTaxonomy.collection) {
      if (collection === "carpet_items") {
        base.collection = selectedTaxonomy.collection;
      } else {
        base.collectionTitle = selectedTaxonomy.collection;
        // For cornices, collectionTitle and collectionSlug are critical
        base.collectionSlug = selectedTaxonomy.collection.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        if (collection === "cornices") {
          base.subtypeTitle = selectedTaxonomy.collection;
        }
      }
    }

    setDoc(base);
    setDocText(pretty(base));
    setAdvancedOpen(false);
    setWizardStep(3);
  }

  // Helper to add new taxonomy item locally for UI selection
  function addNewTaxonomyType() {
    const name = prompt("Введите название новой подкатегории:");
    if (name) {
      setSelectedTaxonomy(prev => ({ ...prev, type: name }));
      // We don't need to add it to docs, the auto-fill will use it during createNew
    }
  }

  function addNewTaxonomyCollection() {
    const name = prompt("Введите название новой коллекции:");
    if (name) {
      setSelectedTaxonomy(prev => ({ ...prev, collection: name }));
    }
  }

  async function deleteTaxonomy(type?: string, coll?: string) {
    if (!confirm(`Удалить все товары в ${coll || type}? Это действие необратимо.`)) return;
    
    // In a real app, we'd have a bulk delete API. 
    // For now, let's just warn or handle it if possible.
    alert("Для удаления целой категории обратитесь к администратору БД или удалите товары по одному.");
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
      setDoc(null);
      setDocText("");
    }
    await loadList();
  }

  async function uploadFiles(files: FileList | null) {
    if (!collection || !files || files.length === 0) return;

    const form = new FormData();
    form.set("collection", collection);
    if (uploadSubfolder) {
      form.set("subfolder", uploadSubfolder);
    }
    Array.from(files).forEach((f) => form.append("files", f));

    const res = await fetch("/api/admin/upload", { method: "POST", body: form }).catch(() => null);
    const data = (res && res.ok ? await res.json().catch(() => null) : null) as { files?: string[] } | null;
    const uploaded = data?.files || [];
    if (uploaded.length === 0) {
      alert("Загрузка не удалась");
      return;
    }

    setDoc((prev) => {
      const base = (prev && typeof prev === "object" ? { ...prev } : buildDefaultDoc(collection)) as Record<string, unknown>;
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
      const base = (prev && typeof prev === "object" ? { ...prev } : buildDefaultDoc(collection)) as Record<string, unknown>;
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
    return normalizeImageFields(doc)
      .images
      .map((src) => normalizeAdminImageSrc(src))
      .filter(Boolean);
  }, [doc]);

  const mainImage = useMemo(() => {
    if (!doc) return "";
    return normalizeAdminImageSrc(normalizeImageFields(doc).image);
  }, [doc]);

  function removeImage(src: string) {
    if (!doc) return;
    const next = { ...doc } as Record<string, unknown>;
    const img = normalizeImageFields(next);
    // Compare normalized paths since src is normalized
    const filtered = img.images.filter((x) => normalizeAdminImageSrc(x) !== src);
    next.images = filtered;
    next.image = normalizeAdminImageSrc(img.image) === src ? filtered[0] || "" : img.image;
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
        {/* Header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Управление сайтом</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-[color:var(--muted)]">
              <span className="flex items-center gap-1.5"><Code size={14} /> MongoDB: koenig</span>
              {collection && (
                <span className="flex items-center gap-1.5 font-bold text-[color:var(--accent)]">
                  <LayoutGrid size={14} /> {COLLECTION_LABELS[collection] || collection}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 text-sm font-semibold shadow-sm transition hover:bg-black/[0.02] dark:border-white/10 dark:bg-white/5"
          >
            <LogOut size={16} />
            Выйти
          </button>
        </div>

        {/* Wizard Progress */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {[
            { step: 1, label: "Раздел", icon: LayoutGrid },
            { step: 1.5, label: "Таксономия", icon: ChevronRight },
            { step: 2, label: "Список товаров", icon: ListOrdered },
            { step: 3, label: "Редактор", icon: Settings },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => s.step <= wizardStep || collection ? setWizardStep(s.step) : null}
              className={`flex flex-col items-center gap-2 border-b-4 pb-4 transition-all ${
                wizardStep === s.step
                  ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                  : wizardStep > s.step
                  ? "border-green-500 text-green-600"
                  : "border-black/5 text-[color:var(--muted)] opacity-50"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                wizardStep === s.step ? "bg-[color:var(--accent)] text-white" : wizardStep > s.step ? "bg-green-500 text-white" : "bg-black/5"
              }`}>
                {wizardStep > s.step ? "✓" : s.step === 1.5 ? "1.5" : s.step}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Areas */}
        <div className="relative min-h-[60vh]">
          
          {/* STEP 1: Select Collection */}
          {wizardStep === 1 && (
            <div className="mx-auto max-w-2xl py-10 text-center">
              <h2 className="text-2xl font-bold">С чего начнем?</h2>
              <p className="mt-2 text-[color:var(--muted)]">Выберите раздел сайта, который хотите настроить</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {sortedCollections.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setCollection(c.name);
                      // Skip taxonomy for leads and contexts
                      if (["leads", "lead_contexts"].includes(c.name)) {
                        setWizardStep(2);
                      } else {
                        setWizardStep(1.5);
                      }
                    }}
                    className={`flex h-24 flex-col items-center justify-center gap-2 rounded-3xl border-2 transition-all hover:scale-[1.02] ${
                      collection === c.name 
                        ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white shadow-lg" 
                        : "border-black/5 bg-white hover:border-[color:var(--accent)]/30 dark:bg-white/5"
                    }`}
                  >
                    <span className="text-2xl">{COLLECTION_LABELS[c.name]?.split(" ")[0]}</span>
                    <span className="text-sm font-bold">{COLLECTION_LABELS[c.name]?.split(" ").slice(1).join(" ")}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1.5: Taxonomy Selection (Flexible Categories/Collections) */}
          {wizardStep === 1.5 && (
            <div className="mx-auto max-w-5xl py-10">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Настройка структуры: {COLLECTION_LABELS[collection]}</h2>
                <p className="mt-2 text-base text-[color:var(--muted)]">Сначала выберите категорию, затем (если нужно) коллекцию</p>
              </div>

              <div className="grid gap-8 grid-cols-4">
                {/* Column 1: Types/Categories */}
                <div className="rounded-3xl border border-black/10 bg-white/60 p-8 shadow-xl backdrop-blur dark:bg-white/5">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">1. Категория</h3>
                      <p className="text-[10px] text-[color:var(--muted)] uppercase font-bold tracking-wider mt-1">Обязательно для порядка</p>
                    </div>
                    <button 
                      onClick={addNewTaxonomyType}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] text-white shadow-lg transition hover:scale-110 active:scale-95"
                      title="Добавить новую категорию"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                  
                  <div className="bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl p-4 mb-4 text-xs text-blue-600 leading-relaxed border border-blue-100/50">
                    💡 <strong>Категория</strong> (тип) — это верхний уровень. Например: <em>Потолочные</em> или <em>Электро</em>. Все товары внутри будут сгруппированы под этим заголовком.
                  </div>

                  <div className="grid gap-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    <button
                      onClick={() => {
                        setSelectedTaxonomy(prev => ({ ...prev, type: undefined, collection: undefined }));
                        setFilterType("ВСЕ");
                        setFilterCollection("ВСЕ");
                      }}
                      className={`flex items-center justify-between rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all ${
                        !selectedTaxonomy.type ? "bg-[color:var(--accent)] text-white shadow-md scale-[1.02]" : "bg-black/5 hover:bg-black/10"
                      }`}
                    >
                      <span>📦 Все товары раздела</span>
                    </button>
                    
                    {/* Show locally added type if not in list */}
                    {selectedTaxonomy.type && !availableTaxonomyTypes.includes(selectedTaxonomy.type) && (
                      <div className="group relative">
                        <button
                          className="w-full flex items-center justify-between rounded-2xl px-5 py-4 text-left text-sm font-bold transition bg-[color:var(--accent)] text-white shadow-md scale-[1.02]"
                        >
                          <span>📂 {selectedTaxonomy.type} <span className="text-[10px] opacity-70 ml-2">(новая)</span></span>
                        </button>
                      </div>
                    )}

                    {availableTaxonomyTypes.map(t => (
                      <div key={t} className="group relative">
                        <button
                          onClick={() => {
                            setSelectedTaxonomy({ type: t, collection: undefined });
                            setFilterType(t);
                            setFilterCollection("ВСЕ");
                          }}
                          className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all ${
                            selectedTaxonomy.type === t ? "bg-[color:var(--accent)] text-white shadow-md scale-[1.02]" : "bg-black/5 hover:bg-black/10"
                          }`}
                        >
                          <span>📂 {t}</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteTaxonomy(t); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-red-500 opacity-0 transition group-hover:opacity-100 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Collections */}
                <div className={`rounded-3xl border border-black/10 bg-white/60 p-8 shadow-xl backdrop-blur transition-all dark:bg-white/5 ${!selectedTaxonomy.type ? "opacity-60 grayscale-[0.5]" : ""}`}>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">2. Коллекция</h3>
                      <p className="text-[10px] text-[color:var(--muted)] uppercase font-bold tracking-wider mt-1">Внутри категории</p>
                    </div>
                    <button 
                      onClick={addNewTaxonomyCollection}
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition hover:scale-110 active:scale-95 ${!selectedTaxonomy.type ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500"}`}
                      disabled={!selectedTaxonomy.type}
                      title="Добавить новую коллекцию"
                    >
                      <Plus size={24} />
                    </button>
                  </div>

                  <div className="bg-orange-50/50 dark:bg-orange-500/5 rounded-2xl p-4 mb-4 text-xs text-orange-700 leading-relaxed border border-orange-100/50">
                    ✨ <strong>Коллекция</strong> — это подгруппа. Например, в «Металлических» могут быть коллекции <em>D25</em> или <em>D16</em>. Поле Slug заполнится само.
                  </div>

                  <div className="grid gap-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    <button
                      onClick={() => {
                        setSelectedTaxonomy(prev => ({ ...prev, collection: undefined }));
                        setFilterCollection("ВСЕ");
                      }}
                      className={`flex items-center justify-between rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all ${
                        !selectedTaxonomy.collection ? "bg-orange-500 text-white shadow-md scale-[1.02]" : "bg-black/5 hover:bg-black/10"
                      }`}
                    >
                      <span>💎 Все коллекции</span>
                    </button>

                    {/* Show locally added collection if not in list */}
                    {selectedTaxonomy.collection && !availableTaxonomyCollections.includes(selectedTaxonomy.collection) && (
                      <div className="group relative">
                        <button
                          className="w-full flex items-center justify-between rounded-2xl px-5 py-4 text-left text-sm font-bold transition bg-orange-500 text-white shadow-md scale-[1.02]"
                        >
                          <span>🏷️ {selectedTaxonomy.collection} <span className="text-[10px] opacity-70 ml-2">(новая)</span></span>
                        </button>
                      </div>
                    )}

                    {availableTaxonomyCollections.map(c => (
                      <div key={c} className="group relative">
                        <button
                          onClick={() => {
                            setSelectedTaxonomy(prev => ({ ...prev, collection: c }));
                            setFilterCollection(c);
                          }}
                          className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all ${
                            selectedTaxonomy.collection === c ? "bg-orange-500 text-white shadow-md scale-[1.02]" : "bg-black/5 hover:bg-black/10"
                          }`}
                        >
                          <span>🏷️ {c}</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteTaxonomy(undefined, c); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-red-500 opacity-0 transition group-hover:opacity-100 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                <button
                  onClick={() => setWizardStep(2)}
                  className="flex h-16 w-full max-w-md items-center justify-center gap-3 rounded-2xl bg-black text-xl font-bold text-white shadow-2xl transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  ПОКАЗАТЬ ТОВАРЫ <ChevronRight size={24} />
                </button>
                <p className="text-xs text-[color:var(--muted)] font-medium">Вы всегда сможете вернуться и изменить выбор</p>
              </div>
            </div>
          )}

          {/* STEP 2: Document List & DND */}
          {wizardStep === 2 && (
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="rounded-3xl border border-black/10 bg-white/60 p-6 shadow-xl backdrop-blur dark:bg-white/5">
                  <h2 className="text-xl font-bold">Быстрые действия</h2>
                  <div className="mt-6 grid gap-4">
                    <button
                      onClick={createNew}
                      className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-green-600 text-lg font-bold text-white shadow-lg transition hover:bg-green-700 active:scale-[0.98]"
                    >
                      <Plus size={24} /> ДОБАВИТЬ ТОВАР
                    </button>
                    <div className="relative">
                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && loadList()}
                        placeholder="Поиск в базе..."
                        className="h-14 w-full rounded-2xl border border-black/10 bg-white pl-5 pr-14 shadow-inner outline-none focus:ring-2 focus:ring-[color:var(--accent)] dark:bg-white/5"
                      />
                      <button onClick={loadList} className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent)] text-white shadow-md">
                        <Search size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="rounded-3xl border border-black/10 bg-white/60 p-6 shadow-xl backdrop-blur dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Список в этом разделе</h2>
                    <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-[color:var(--muted)]">{filteredDocs.length} шт.</span>
                  </div>
                  
                  <div className="mt-6">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={filteredDocs.map((d) => stringifyId(d._id))} strategy={verticalListSortingStrategy}>
                        <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                          {filteredDocs.map((d) => {
                            const id = stringifyId(d._id);
                            return (
                              <SortableItem
                                key={id}
                                id={id}
                                label={d.title || d.slug || "(без названия)"}
                                sublabel={d.type || d.collectionTitle || d.category}
                                isActive={activeId === id}
                                image={d.image ? normalizeAdminImageSrc(d.image) : undefined}
                                onClick={() => {
                                  openDoc(id);
                                  setWizardStep(3);
                                }}
                                onDelete={() => deleteDoc(id)}
                              />
                            );
                          })}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Editor */}
          {wizardStep === 3 && (
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Column: Data & Photos */}
              <div className="lg:col-span-8 space-y-6">
                {/* Save Toolbar Floating */}
                <div className="sticky top-0 z-20 flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 p-4 shadow-lg backdrop-blur dark:bg-white/5">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setWizardStep(2)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 hover:bg-black/5 transition">
                      ←
                    </button>
                    <div>
                      <h3 className="text-sm font-bold">Редактирование</h3>
                      <p className="text-[10px] text-[color:var(--muted)] truncate max-w-[200px]">{activeId === "__new__" ? "Новый товар" : activeId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveDoc}
                      disabled={saving}
                      className="flex h-11 items-center gap-2 rounded-xl bg-[color:var(--accent)] px-6 font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      <Save size={18} />
                      {saving ? "Сохраняю..." : "СОХРАНИТЬ"}
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/60 p-6 shadow-xl backdrop-blur dark:bg-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[color:var(--muted)] uppercase tracking-[0.2em] mb-6">
                    <Code size={14} /> Основная информация
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {effectiveSchema.fields.map((f) => renderField(f))}
                  </div>
                </div>

                {effectiveSchema.supportsImages !== false && (
                  <div className="rounded-3xl border border-black/10 bg-white/60 p-6 shadow-xl backdrop-blur dark:bg-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-[color:var(--muted)] uppercase tracking-[0.2em]">
                        <ImageIcon size={14} /> Фотографии
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2 text-xs font-bold transition hover:bg-black/10"
                      >
                        <Upload size={14} /> ЗАГРУЗИТЬ
                      </button>
                    </div>

                    <div className="grid gap-4 grid-cols-4">
                      {images.map((src, idx) => (
                        <div key={src + idx} className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${src === mainImage ? "border-[color:var(--accent)] scale-[1.02] shadow-md" : "border-black/5"}`}>
                          <img src={src} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition group-hover:opacity-100">
                            <button onClick={() => setMainImage(src)} className="rounded-lg bg-white p-2 text-black shadow-lg" title="Сделать главным"><Save size={14} /></button>
                            <button onClick={() => removeImage(src)} className="rounded-lg bg-red-500 p-2 text-white shadow-lg" title="Удалить"><Trash2 size={14} /></button>
                          </div>
                          {src === mainImage && <div className="absolute left-2 top-2 rounded-md bg-[color:var(--accent)] px-1.5 py-0.5 text-[8px] font-black text-white">ГЛАВНОЕ</div>}
                        </div>
                      ))}
                      <div onClick={() => fileInputRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/10 bg-black/[0.02] transition hover:bg-black/[0.04]">
                        <Plus size={24} className="text-[color:var(--muted)]" />
                        <span className="text-[10px] font-bold text-[color:var(--muted)]">ЕЩЕ ФОТО</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Preview */}
              <div className="lg:col-span-4">
                <div className="sticky top-6 space-y-6">
                  <div className="rounded-3xl border border-black/10 bg-white/60 p-6 shadow-xl backdrop-blur dark:bg-white/5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[color:var(--muted)] uppercase tracking-[0.2em] mb-6">
                      <Eye size={14} /> Как это выглядит на сайте
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-inner dark:bg-black/20">
                      <div className="aspect-[4/3] bg-black/[0.03]">
                        {mainImage && <img src={mainImage} className="h-full w-full object-cover" />}
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-bold">{ensureString(doc?.title) || "(Без названия)"}</h4>
                        <p className="mt-2 text-xs text-[color:var(--muted)] line-clamp-3 leading-relaxed">{ensureString(doc?.description) || "Описание отсутствует..."}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-black/10 bg-white/60 p-6 shadow-xl backdrop-blur dark:bg-white/5">
                    <button
                      onClick={() => setAdvancedOpen(!advancedOpen)}
                      className="flex w-full items-center justify-between text-xs font-bold text-[color:var(--muted)] uppercase tracking-[0.2em]"
                    >
                      <span className="flex items-center gap-2"><Code size={14} /> Настройки JSON</span>
                      <ChevronRight size={14} className={`transition ${advancedOpen ? "rotate-90" : ""}`} />
                    </button>
                    {advancedOpen && (
                      <div className="mt-6 space-y-4">
                        <textarea
                          value={docText}
                          onChange={(e) => setDocText(e.target.value)}
                          className="h-60 w-full rounded-xl border border-black/10 bg-white p-3 font-mono text-[10px] leading-relaxed shadow-inner dark:bg-black/20"
                        />
                        <button onClick={() => { try { setDoc(JSON.parse(docText)); } catch { alert("Ошибка!"); } }} className="w-full rounded-xl bg-black/5 py-2 text-[10px] font-black transition hover:bg-black/10">ПРИМЕНИТЬ</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
