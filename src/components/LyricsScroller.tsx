import type { LrcLine } from '../hooks/useLrc';

export default function LyricsScroller({
  lines, currentTime
}:{ lines: LrcLine[]; currentTime: number }) {

  // 找目前所在行
  const idx = (() => {
    if (!lines.length) return -1;
    let i = lines.findIndex((l, ix) => {
      const next = lines[ix+1]?.t ?? 1e9;
      return currentTime >= l.t && currentTime < next;
    });
    if (i === -1 && currentTime >= lines[lines.length-1].t) i = lines.length-1;
    return i;
  })();

  // 取三行：prev, current, next
  const display = [lines[idx-1], lines[idx], lines[idx+1]].filter(Boolean);

  return (
    <div className="mt-6 text-center space-y-2 h-[6em] overflow-hidden">
      {display.map((l) => {
        const active = l === lines[idx];
        return (
          <p
            key={l.t}
            className={`transition text-lg md:text-2xl ${
              active
                ? "font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-fuchsia-200 to-yellow-200"
                : "text-pink-100/50"
            }`}
          >
            {l.text}
          </p>
        );
      })}
    </div>
  );
}