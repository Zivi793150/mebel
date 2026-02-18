export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)] text-[color:var(--fg)]">
      <div className="flex flex-col items-center gap-6">
        <div className="text-sm font-semibold tracking-[0.32em] text-[color:var(--muted)]">
          KOENIG ROOM
        </div>
        <div className="flex items-center gap-1 text-2xl font-semibold">
          {"Загрузка".split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block animate-[kr-wave_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {ch}
            </span>
          ))}
        </div>
        <div className="h-[2px] w-56 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div className="h-full w-2/5 animate-[kr-bar_1.2s_ease-in-out_infinite] rounded-full bg-[color:var(--accent)]" />
        </div>
      </div>
    </div>
  );
}
