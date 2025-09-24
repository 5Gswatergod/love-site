export default function KirbyBuddy({
  size = 72,  // px，高寬相同
  offset = 16 // px，距離畫面邊界
}: { size?: number; offset?: number }) {
  const prefersReduced = typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const src = `${import.meta.env.BASE_URL}running-kirby.gif`;

  return (
    <div
      className="fixed left-0 bottom-0 z-50 pointer-events-none select-none"
      style={{ transform: `translate(${offset}px, -${offset}px)` }}
      aria-hidden
    >
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className="opacity-95 drop-shadow-[0_4px_12px_rgba(255,160,220,0.35)]"
        style={{ animation: prefersReduced ? undefined : 'kirby-bob 1.4s ease-in-out infinite' }}
      />
    </div>
  );
}