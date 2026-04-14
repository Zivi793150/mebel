"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/Container";

function VideoCard({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)]">
      <div className="relative aspect-[9/16] bg-black max-h-[600px] sm:max-h-[700px] lg:max-h-[800px]">
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-contain"
          loop
          muted
          playsInline
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Play/Pause Overlay Button */}
        <button
          onClick={togglePlay}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
          }`}
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          <div className="flex h-14 w-14 items-center justify-center bg-white/90 shadow-lg backdrop-blur-sm transition hover:scale-105">
            {isPlaying ? (
              <svg
                className="h-5 w-5 text-[color:var(--fg)]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-[color:var(--fg)] ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center bg-white/90 shadow-md transition hover:scale-105"
          aria-label="Полноэкранный режим"
        >
          <svg className="h-4 w-4 text-[color:var(--fg)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function AboutVideoVertical({
  videos,
  title,
  subtitle,
}: {
  videos: string[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="py-14 sm:py-18">
      <Container>
        {/* Заголовок */}
        {(title || subtitle) && (
          <div className="mb-10 text-center">
            {title && (
              <h3 className="text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-3xl">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-3 text-sm text-[color:var(--muted)]">{subtitle}</p>
            )}
          </div>
        )}

        {/* Сетка из 6 видео - 3 в ряд */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((src, idx) => (
            <VideoCard key={idx} src={src} />
          ))}
        </div>
      </Container>
    </section>
  );
}
