"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/Container";

type Scene = {
  kicker: string;
  title: string;
  subtitle: string;
  videoSrc: string;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function PremiumCurtainsAd() {
  const scenes: Scene[] = useMemo(
    () => [
      {
        kicker: "PREMIUM FILM",
        title: "Ткань ловит свет",
        subtitle: "Штора — это не про окно. Это про атмосферу комнаты.",
        videoSrc: "/0-3scene.alli60.mp4",
      },
      {
        kicker: "PREMIUM FILM",
        title: "Складка решает всё",
        subtitle: "Линии, длина и вес ткани делают интерьер дороже за секунды.",
        videoSrc: "/3-6scene.alli60.mp4",
      },
      {
        kicker: "PREMIUM FILM",
        title: "Монтаж — это ювелирка",
        subtitle: "Чистая установка без компромиссов. Видно сразу.",
        videoSrc: "/instryments.alli60.mp4",
      },
    ],
    [],
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);
  const durationsRef = useRef<Record<string, number>>({});
  const [progress, setProgress] = useState(0);
  const [renderProgress, setRenderProgress] = useState(0);
  const [allowExit, setAllowExit] = useState(false);
  const [activeSrc, setActiveSrc] = useState<string>(scenes[0]?.videoSrc ?? "");
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<0 | 1>(0);
  const [pendingReady, setPendingReady] = useState(false);
  const [crossfade, setCrossfade] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const lastTimeRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const lastRawProgressRef = useRef<number>(0);
  const lastVelTsRef = useRef<number>(0);
  const velEmaRef = useRef<number>(0);
  const commitTimerRef = useRef<number | null>(null);

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

      if (!allowExit && total > 0) {
        const absTop = rect.top + window.scrollY;
        const gateScrollY = absTop + total * ((scenes.length - 0.02) / scenes.length);
        if (window.scrollY > gateScrollY) {
          window.scrollTo({ top: gateScrollY, left: 0, behavior: "auto" });
        }
      }
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
  }, [allowExit, scenes.length]);

  useEffect(() => {
    let raf = 0;

    function smoothstep(edge0: number, edge1: number, x: number) {
      const t = clamp01((x - edge0) / Math.max(1e-6, edge1 - edge0));
      return t * t * (3 - 2 * t);
    }

    function tick() {
      const now = performance.now();
      const dt = Math.max(1, now - (lastVelTsRef.current || now));
      lastVelTsRef.current = now;

      const raw = progress;
      const lastRaw = lastRawProgressRef.current;
      const vel = Math.abs(raw - lastRaw) / dt;
      lastRawProgressRef.current = raw;

      // Smooth velocity a bit so tiny wheel pulses don't flip the mode.
      velEmaRef.current = velEmaRef.current * 0.85 + vel * 0.15;
      const velSmooth = velEmaRef.current;

      // vel ~ 0..0.003 (depends on wheel + section height). Below vSlow => pronounced slow-mo.
      const vSlow = 0.00025;
      const vFast = 0.0011;

      // When scrolling fast -> follow quickly.
      // When slow/near-zero -> ease to target very slowly (continuous, no stepping), coming to rest in ~3s.
      const fastMix = smoothstep(vSlow, vFast, velSmooth);
      const sp = smoothProgressRef.current;

      const dtSec = dt / 1000;
      const tauFast = 0.10;
      const tauSlow = 1.25;
      const tau = tauSlow + (tauFast - tauSlow) * fastMix;
      const alpha = 1 - Math.exp(-dtSec / Math.max(1e-3, tau));

      const next = sp + (raw - sp) * alpha;
      smoothProgressRef.current = next;
      setRenderProgress(next);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [progress]);

  const n = scenes.length;
  const scaled = renderProgress * n;
  const active = Math.min(n - 1, Math.floor(scaled));
  const t = clamp01(scaled - active);

  useEffect(() => {
    const src = scenes[active]?.videoSrc;
    if (!src) return;
    if (src === activeSrc) return;
    lastTimeRef.current = 0;
    setIsSwitching(true);
    setPendingSrc(src);
  }, [active, activeSrc, scenes]);

  useEffect(() => {
    if (!pendingSrc) return;
    setPendingReady(false);
    setCrossfade(false);
    if (commitTimerRef.current) {
      window.clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }
  }, [pendingSrc]);

  useEffect(() => {
    if (!pendingSrc) return;
    if (!pendingReady) return;
    if (crossfade) return;

    setCrossfade(true);

    commitTimerRef.current = window.setTimeout(() => {
      const nextLayer: 0 | 1 = activeLayer === 0 ? 1 : 0;
      setActiveLayer(nextLayer);
      setActiveSrc(pendingSrc);
      setPendingSrc(null);
      setPendingReady(false);
      setCrossfade(false);
      setIsSwitching(false);
      commitTimerRef.current = null;
    }, 360);
  }, [activeLayer, crossfade, pendingReady, pendingSrc]);

  useEffect(() => {
    const src = scenes[active]?.videoSrc;
    if (!src) return;

    let raf = 0;

    function tick() {
      const activeVideo = activeLayer === 0 ? videoARef.current : videoBRef.current;
      const pendingVideo = activeLayer === 0 ? videoBRef.current : videoARef.current;
      if (!activeVideo) return;

      const srcNow = scenes[active]?.videoSrc;
      if (!srcNow) return;

      const duration = durationsRef.current[srcNow] ?? activeVideo.duration ?? 0;
      if (!Number.isFinite(duration) || duration <= 0) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (!Number.isFinite(activeVideo.duration) || activeVideo.readyState < 2) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const target = clamp01(t) * Math.max(0.001, duration - 0.05);
      const prev = lastTimeRef.current || 0;

      // Additional tiny smoothing (time-domain) to remove decoder micro-jitter.
      // renderProgress already eases to rest over ~3s on scroll stop.
      const alpha = 0.9;

      const next = prev + (target - prev) * alpha;
      lastTimeRef.current = next;

      // Lock user in section until the last scene has effectively reached its end.
      if (!allowExit && active === scenes.length - 1) {
        if (duration > 0 && next >= Math.max(0, duration - 1)) {
          setAllowExit(true);
        }
      }
      try {
        activeVideo.currentTime = next;
        if (isSwitching && pendingVideo && pendingVideo.readyState >= 2) {
          pendingVideo.currentTime = next;
        }
      } catch {
        // ignore
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, t, scenes, renderProgress, activeLayer, isSwitching, allowExit]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0b0b0b] text-[#f7f7f7]"
      style={{ height: `${(n + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={videoARef}
            className="absolute inset-0 h-full w-full object-cover"
            src={activeLayer === 0 ? activeSrc : pendingSrc ?? activeSrc}
            muted
            playsInline
            preload="auto"
            style={{
              opacity:
                activeLayer === 0
                  ? crossfade
                    ? 0
                    : 1
                  : crossfade
                    ? 1
                    : 0,
              transition: "opacity 320ms ease",
            }}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              const srcKey = activeLayer === 0 ? activeSrc : pendingSrc;
              if (srcKey && Number.isFinite(v.duration) && v.duration > 0) {
                durationsRef.current[srcKey] = v.duration;
              }
              try {
                v.pause();
              } catch {
                // ignore
              }
            }}
            onCanPlayThrough={() => {
              if (pendingSrc && activeLayer !== 0) setPendingReady(true);
            }}
          />

          <video
            ref={videoBRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={activeLayer === 1 ? activeSrc : pendingSrc ?? activeSrc}
            muted
            playsInline
            preload="auto"
            style={{
              opacity:
                activeLayer === 1
                  ? crossfade
                    ? 0
                    : 1
                  : crossfade
                    ? 1
                    : 0,
              transition: "opacity 320ms ease",
            }}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              const srcKey = activeLayer === 1 ? activeSrc : pendingSrc;
              if (srcKey && Number.isFinite(v.duration) && v.duration > 0) {
                durationsRef.current[srcKey] = v.duration;
              }
              try {
                v.pause();
              } catch {
                // ignore
              }
            }}
            onCanPlayThrough={() => {
              if (pendingSrc && activeLayer !== 1) setPendingReady(true);
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_20%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_top,rgba(0,0,0,0.62),rgba(0,0,0,0.18),rgba(0,0,0,0.72))]" />
          <div className="absolute inset-0 bg-black opacity-0" />
        </div>

        <Container>
          <div className="relative z-10 grid h-screen items-end pb-10 sm:pb-14">
            <div className="max-w-3xl">
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
                  style={{ width: `${Math.round(renderProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
