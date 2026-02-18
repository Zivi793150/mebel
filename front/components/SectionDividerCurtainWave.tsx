export function SectionDividerCurtainWave({ flip }: { flip?: boolean }) {
  return (
    <div className="relative h-20 overflow-hidden">
      <div
        className={`absolute inset-0 bg-[url('/volna_is_shtory.png')] bg-contain bg-center bg-no-repeat opacity-100 [filter:drop-shadow(0_14px_28px_rgba(0,0,0,0.22))] ${
          flip ? "-scale-y-100" : ""
        }`}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute inset-0 ${flip ? "-scale-y-100" : ""}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.30),transparent_60%)] opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.28),transparent_65%)] opacity-50" />
      </div>
    </div>
  );
}
