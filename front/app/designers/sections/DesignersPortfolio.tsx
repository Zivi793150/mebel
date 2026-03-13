"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Container } from "@/components/Container";

type DesignersProject = {
  title: string;
  cover: string;
  images: string[];
};

function enc(path: string) {
  return encodeURI(path);
}

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

const portfolioItems = [
  {
    title: "Аппартаменты",
    cover: enc("/for_designers/Аппартаменты/SVM04783-1.jpg"),
    images: [
      enc("/for_designers/Аппартаменты/SVM04783-1.jpg"),
      enc("/for_designers/Аппартаменты/SVM04800.jpg"),
      enc("/for_designers/Аппартаменты/SVM04809.jpg"),
      enc("/for_designers/Аппартаменты/SVM04819.jpg"),
      enc("/for_designers/Аппартаменты/SVM04848.jpg"),
      enc("/for_designers/Аппартаменты/SVM04860.jpg"),
      enc("/for_designers/Аппартаменты/SVM04877.jpg"),
      enc("/for_designers/Аппартаменты/SVM04890.jpg"),
    ],
  },
  {
    title: "Литовский вал",
    cover: enc("/for_designers/Литовский вал/RED_1170.jfif"),
    images: [
      enc("/for_designers/Литовский вал/42ef1b33-15d3-4342-811a-88e0db258022.jfif"),
      enc("/for_designers/Литовский вал/RED_1170.jfif"),
      enc("/for_designers/Литовский вал/RED_1190.jfif"),
      enc("/for_designers/Литовский вал/RED_1198.jfif"),
      enc("/for_designers/Литовский вал/RED_1202.jfif"),
      enc("/for_designers/Литовский вал/RED_1220.jfif"),
      enc("/for_designers/Литовский вал/RED_1231.jfif"),
      enc("/for_designers/Литовский вал/RED_1238.jfif"),
      enc("/for_designers/Литовский вал/RED_1246.jfif"),
      enc("/for_designers/Литовский вал/RED_1280.jfif"),
      enc("/for_designers/Литовский вал/RED_1291.jfif"),
    ],
  },
  {
    title: "Немецкий фонд",
    cover: enc("/for_designers/Немецкий фонд/RED_0437_2_01.jpg"),
    images: [
      enc("/for_designers/Немецкий фонд/RED_0437_2_01.jpg"),
      enc("/for_designers/Немецкий фонд/RED_0467_1_01.jpg"),
      enc("/for_designers/Немецкий фонд/RED_0479_01.jpg"),
      enc("/for_designers/Немецкий фонд/RED_0521_01.jpg"),
      enc("/for_designers/Немецкий фонд/RED_0644_2.jpg"),
      enc("/for_designers/Немецкий фонд/RED_0671_01.jpg"),
      enc("/for_designers/Немецкий фонд/RED_0958_01.jpg"),
      enc("/for_designers/Немецкий фонд/RED_0973_01.jpg"),
    ],
  },
  {
    title: "Тихая роскошь",
    cover: enc("/for_designers/Тихая роскошь/730c9e63-1901-4cb9-857b-87778cc05ed3.jpg"),
    images: [
      enc("/for_designers/Тихая роскошь/2776e08a-d7b8-46bf-a631-9543e4d1245c.jfif"),
      enc("/for_designers/Тихая роскошь/339f3802-8a1c-46da-b454-b27337dea6f5.jfif"),
      enc("/for_designers/Тихая роскошь/42ef1b33-15d3-4342-811a-88e0db258022.jfif"),
      enc("/for_designers/Тихая роскошь/730c9e63-1901-4cb9-857b-87778cc05ed3.jfif"),
      enc("/for_designers/Тихая роскошь/730c9e63-1901-4cb9-857b-87778cc05ed3.jpg"),
      enc("/for_designers/Тихая роскошь/735cbb9d-663b-461c-bc28-d90c691e0ab8.jfif"),
      enc("/for_designers/Тихая роскошь/891c27ad-557b-4a95-ae45-26a329b6e1d2.jfif"),
      enc("/for_designers/Тихая роскошь/e6d5b49c-e1b5-41a8-acb6-fc71337a29e8.jpg"),
      enc("/for_designers/Тихая роскошь/fad65c85-32b2-4861-b41c-664bb564caf1.jfif"),
    ],
  },
];

function ProjectModal({
  projects,
  activeProjectIndex,
  onChangeProject,
  onClose,
}: {
  projects: DesignersProject[];
  activeProjectIndex: number;
  onChangeProject: (idx: number) => void;
  onClose: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(wrapRef, onClose);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const project = projects[activeProjectIndex];
  const images = useMemo(() => {
    const arr = [...(project?.images || [])].filter(Boolean);
    return Array.from(new Set(arr)).slice(0, 30);
  }, [project]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    setThumbStart(0);
  }, [activeProjectIndex]);

  const image = images[activeIdx] || images[0] || project?.cover || "/hero.jpg";
  const thumbsVisibleCount = 5;
  const canThumbUp = thumbStart > 0;
  const canThumbDown = thumbStart + thumbsVisibleCount < images.length;
  const visibleThumbs = images.slice(thumbStart, thumbStart + thumbsVisibleCount);

  function setActiveFromVisible(visibleIndex: number) {
    const idx = thumbStart + visibleIndex;
    if (idx >= 0 && idx < images.length) setActiveIdx(idx);
  }

  const canPrevImage = activeIdx > 0;
  const canNextImage = activeIdx + 1 < images.length;
  const canPrevProject = activeProjectIndex > 0;
  const canNextProject = activeProjectIndex + 1 < projects.length;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        if (canPrevImage) setActiveIdx((v) => Math.max(0, v - 1));
      }
      if (e.key === "ArrowRight") {
        if (canNextImage) setActiveIdx((v) => Math.min(images.length - 1, v + 1));
      }
      if (e.key === "ArrowUp") {
        if (canPrevProject) onChangeProject(activeProjectIndex - 1);
      }
      if (e.key === "ArrowDown") {
        if (canNextProject) onChangeProject(activeProjectIndex + 1);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeProjectIndex, canNextImage, canNextProject, canPrevImage, canPrevProject, images.length, onChangeProject, onClose]);

  if (!mounted || !project) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div
        ref={wrapRef}
        className="w-full max-w-6xl rounded-3xl border border-black/10 bg-white/80 p-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-black/55"
      >
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => (canPrevProject ? onChangeProject(activeProjectIndex - 1) : null)}
            disabled={!canPrevProject}
            aria-label="Предыдущий проект"
            className={
              canPrevProject
                ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-sm font-semibold shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/[0.02] text-sm font-semibold text-[color:var(--muted)] opacity-60 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
            }
          >
            ↑
          </button>

          <div className="min-w-0 text-center">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ПРОЕКТ</div>
            <div className="truncate text-xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-2xl">{project.title}</div>
            <div className="mt-1 text-xs font-medium tracking-[0.22em] text-[color:var(--muted)]">
              {images.length ? `${activeIdx + 1} / ${images.length}` : ""}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => (canNextProject ? onChangeProject(activeProjectIndex + 1) : null)}
              disabled={!canNextProject}
              aria-label="Следующий проект"
              className={
                canNextProject
                  ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-sm font-semibold shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/[0.02] text-sm font-semibold text-[color:var(--muted)] opacity-60 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
              }
            >
              ↓
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-black/10 dark:bg-white/10" />

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="relative lg:col-span-8">
            <div className="grid gap-3 sm:grid-cols-[104px,1fr]">
              <div className="hidden sm:block">
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => setThumbStart((v) => Math.max(0, v - 1))}
                    disabled={!canThumbUp}
                    aria-label="Вверх"
                    className={
                      canThumbUp
                        ? "inline-flex h-9 w-full items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                        : "inline-flex h-9 w-full items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] text-sm font-semibold text-[color:var(--muted)] opacity-60 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                    }
                  >
                    ↑
                  </button>

                  <div className="grid gap-2">
                    {(visibleThumbs.length ? visibleThumbs : [image]).map((src, idx) => {
                      const realIdx = thumbStart + idx;
                      const isActive = realIdx === activeIdx;
                      return (
                        <button
                          key={`${src}-${realIdx}`}
                          type="button"
                          onClick={() => setActiveFromVisible(idx)}
                          aria-label={`Фото ${realIdx + 1}`}
                          className={
                            isActive
                              ? "overflow-hidden rounded-2xl border border-black/25 bg-white/70 shadow-sm dark:border-white/20 dark:bg-white/10"
                              : "overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                          }
                        >
                          <div className="relative aspect-square">
                            <img alt="" src={src} className="h-full w-full object-cover" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setThumbStart((v) => Math.min(Math.max(0, images.length - thumbsVisibleCount), v + 1))
                    }
                    disabled={!canThumbDown}
                    aria-label="Вниз"
                    className={
                      canThumbDown
                        ? "inline-flex h-9 w-full items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                        : "inline-flex h-9 w-full items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] text-sm font-semibold text-[color:var(--muted)] opacity-60 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                    }
                  >
                    ↓
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl bg-black/[0.03] dark:bg-white/[0.04]">
                  <img alt={project.title} className="h-full w-full object-cover" src={image} />

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
                    <button
                      type="button"
                      onClick={() => (canPrevImage ? setActiveIdx((v) => Math.max(0, v - 1)) : null)}
                      disabled={!canPrevImage}
                      aria-label="Предыдущее фото"
                      className={
                        canPrevImage
                          ? "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white/70 shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                          : "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] text-[color:var(--muted)] opacity-60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]"
                      }
                    >
                      ←
                    </button>

                    <div className="flex-1" />

                    <button
                      type="button"
                      onClick={() => (canNextImage ? setActiveIdx((v) => Math.min(images.length - 1, v + 1)) : null)}
                      disabled={!canNextImage}
                      aria-label="Следующее фото"
                      className={
                        canNextImage
                          ? "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white/70 shadow-sm backdrop-blur transition hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                          : "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] text-[color:var(--muted)] opacity-60 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]"
                      }
                    >
                      →
                    </button>
                  </div>
                </div>

                {images.length > 1 ? (
                  <div className="mt-3 flex gap-2 overflow-x-auto sm:hidden">
                    {images.map((src, idx) => {
                      const isActive = idx === activeIdx;
                      return (
                        <button
                          key={`${src}-${idx}`}
                          type="button"
                          onClick={() => setActiveIdx(idx)}
                          aria-label={`Фото ${idx + 1}`}
                          className={
                            isActive
                              ? "h-16 w-16 flex-none overflow-hidden rounded-2xl border border-black/25 bg-white/70 shadow-sm dark:border-white/20 dark:bg-white/10"
                              : "h-16 w-16 flex-none overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm transition hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                          }
                        >
                          <img alt="" src={src} className="h-full w-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="text-xs font-semibold tracking-[0.28em] text-[color:var(--muted)]">НАВИГАЦИЯ</div>
              <div className="mt-3 grid gap-2 text-sm leading-6 text-[color:var(--muted)]">
                <div className="rounded-2xl border border-black/10 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="font-semibold text-[color:var(--fg)]">Фото</div>
                  <div className="mt-1">Стрелки ← → переключают фото.</div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="font-semibold text-[color:var(--fg)]">Проекты</div>
                  <div className="mt-1">Стрелки ↑ ↓ переключают проекты.</div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="font-semibold text-[color:var(--fg)]">Быстро</div>
                  <div className="mt-1">Нажмите на миниатюру — откроется выбранный кадр.</div>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-[color:var(--fg)] shadow-sm transition hover:bg-black/[0.06] dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                >
                  Закрыть
                </button>
                <a
                  href="#contact"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-contrast)] shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition hover:opacity-95"
                >
                  Обсудить похожий проект
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function DesignersPortfolio() {
  const projects: DesignersProject[] = portfolioItems;
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);

  return (
    <section className="bg-[color:var(--bg)] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">ПОРТФОЛИО</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
              Реализованные проекты
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
              Примеры работ, выполненных в сотрудничестве с дизайнерами интерьера
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((item, idx) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveProjectIndex(idx)}
              className="block text-left"
              aria-label={`Открыть проект: ${item.title}`}
            >
              <div className="group overflow-hidden rounded-3xl border border-black/10 bg-white/60 shadow-sm backdrop-blur transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-[transform,filter] duration-500 ease-in-out group-hover:scale-[1.05] group-hover:saturate-[1.08]"
                    src={item.cover}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.18),rgba(0,0,0,0.60))]" />

                  <div className="absolute left-4 top-4 rounded-2xl border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-[color:var(--fg)] shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/35 dark:text-white">
                    {item.images.length} ФОТО
                  </div>

                  <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/75 text-[color:var(--fg)] shadow-sm backdrop-blur transition group-hover:bg-white/90 dark:border-white/10 dark:bg-white/10 dark:text-white dark:group-hover:bg-white/15">
                    →
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-lg font-semibold tracking-tight text-[color:var(--fg)] sm:text-xl">
                      {item.title}
                    </div>
                  </div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    Открыть галерею
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[color:var(--divider)] bg-transparent px-6 text-sm font-semibold text-[color:var(--fg)] transition hover:bg-[color:var(--accent-soft)]"
          >
            Обсудить ваш проект
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {activeProjectIndex !== null ? (
          <ProjectModal
            projects={projects}
            activeProjectIndex={activeProjectIndex}
            onChangeProject={setActiveProjectIndex}
            onClose={() => setActiveProjectIndex(null)}
          />
        ) : null}
      </Container>
    </section>
  );
}
