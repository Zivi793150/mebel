"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/Container";

// Speaker icons for mute/unmute toggle
function IconVolumeOn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function IconVolumeOff({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

type Scene = {
  kicker: string;
  title: string;
  subtitle: string;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function PremiumCurtainsAd() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const videoSrc = "/premium-film.mp4";
  const scenes: Scene[] = useMemo(
    () => [
      {
        kicker: "PREMIUM FILM",
        title: "Свет становится мягче",
        subtitle: "Настраиваем атмосферу комнаты — не просто закрываем окно.",
      },
      {
        kicker: "PREMIUM FILM",
        title: "Детали делают интерьер дороже",
        subtitle: "Карниз, ткань и свет — собираем всё в одну чистую линию.",
      },
      {
        kicker: "PREMIUM FILM",
        title: "Фактура, которую хочется трогать",
        subtitle: "Складка, плотность и длина сразу делают интерьер дороже.",
      },
      {
        kicker: "PREMIUM FILM",
        title: "Свет — под ваш сценарий",
        subtitle: "Рулонки и жалюзи: приватность днём, затемнение ночью.",
      },
    ],
    [],
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [fit, setFit] = useState<"contain" | "cover">("contain");

  useEffect(() => {
    function updateFit() {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const aspect = w / h;
      // If viewport is wider than 16:9 -> cover (avoid side bars).
      // If viewport is taller/narrower -> contain (letterbox top/bottom).
      setFit(aspect > 16 / 9 ? "cover" : "contain");
    }

    updateFit();
    window.addEventListener("resize", updateFit);
    return () => window.removeEventListener("resize", updateFit);
  }, []);

  useEffect(() => {
    let raf = 0;

    function update() {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;

      const total = rect.height - viewportH;
      const scrolled = -rect.top;
      const p = total <= 0 ? 0 : clamp01(scrolled / total);
      setProgress(p);
    }

    function onScroll() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scenes.length]);

  const n = scenes.length;
  const scaled = progress * n;
  const active = Math.min(n - 1, Math.floor(scaled));
  const t = clamp01(scaled - active);

  return (
    <section
      ref={sectionRef}
      className="relative kr-header-invert bg-[#0b0b0b] text-[#f7f7f7]"
      style={{ height: `${(n + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
            src={videoSrc}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_20%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_top,rgba(0,0,0,0.62),rgba(0,0,0,0.18),rgba(0,0,0,0.72))]" />
          <div className="absolute inset-0 bg-black opacity-0" />
        </div>

        <Container>
          <div className="relative z-10 grid h-screen items-end pb-10 sm:pb-14">
            <div className="max-w-3xl">
              <div key={active} className="kr-work-bounce">
                <div
                  className="text-xs font-semibold tracking-[0.42em] text-white/65"
                  style={{
                    opacity: 0.72 + 0.28 * (1 - Math.abs(t - 0.5) * 2),
                  }}
                >
                  {scenes[active]?.kicker}
                </div>
                <h2
                  className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
                  style={{
                    transform: `translateY(${Math.round((1 - t) * 10)}px)`,
                    opacity: 0.88 + 0.12 * t,
                    transition: "opacity 240ms ease",
                  }}
                >
                  {scenes[active]?.title}
                </h2>
                <p
                  className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-white/75 sm:text-base"
                  style={{
                    transform: `translateY(${Math.round((1 - t) * 12)}px)`,
                    opacity: 0.72 + 0.28 * t,
                    transition: "opacity 240ms ease",
                  }}
                >
                  {scenes[active]?.subtitle}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <a
                  href="#cta"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Рассчитать проект
                </a>
                <a
                  href="#catalog"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Смотреть решения
                </a>
              </div>

              <div className="mt-8 h-1 w-full max-w-lg rounded-full bg-white/10">
                <div
                  className="h-1 rounded-full bg-white/65"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>

            {/* Mute/Unmute button - bottom right corner */}
            <button
              onClick={toggleMute}
              className="absolute bottom-10 right-0 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:bottom-14"
              aria-label={isMuted ? "Включить звук" : "Выключить звук"}
              aria-pressed={!isMuted}
            >
              {isMuted ? (
                <IconVolumeOff className="h-5 w-5" />
              ) : (
                <IconVolumeOn className="h-5 w-5" />
              )}
            </button>
          </div>
        </Container>
      </div>
    </section>
  );
}
