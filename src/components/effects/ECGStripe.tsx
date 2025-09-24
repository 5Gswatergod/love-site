import { useEffect, useRef } from 'react';

export default function ECGStripe({
  height = 64, speed = 1600, glow = true
}: { height?: number; speed?: number; glow?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current!;
    const path = svg.querySelector('path.wave') as SVGPathElement;
    if (!path) return;

    let id = 0;
    let start = performance.now();
    const dash = 260; // 調整掃描長度
    path.style.strokeDasharray = `${dash} ${dash}`;
    const loop = (t: number) => {
      const p = ((t - start) % speed) / speed;
      path.style.strokeDashoffset = String(dash - p * dash * 2);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [speed]);

  return (
    <div className="relative my-6">
      <svg ref={ref} viewBox="0 0 600 100" width="100%" height={height}
           className="block opacity-90">
        {/* 背景網格（可關） */}
        <defs>
          <pattern id="g" width="20" height="10" patternUnits="userSpaceOnUse">
            <path d="M20 0H0M0 10H20" stroke="rgba(255,255,255,.06)" />
          </pattern>
          <linearGradient id="ecg" x1="0" x2="1">
            <stop offset="0" stopColor="#c084fc"/><stop offset="1" stopColor="#60a5fa"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#g)"/>
        {/* ECG 波形（等比例縮放） */}
        <path
          className="wave"
          d="M0,50 L90,50 120,50 130,20 140,80 160,35 180,65 210,50 300,50 330,50 340,22 350,78 370,35 390,65 420,50 510,50 540,50 550,22 560,78 580,35 600,65"
          fill="none"
          stroke="url(#ecg)"
          strokeWidth="2.5"
          style={glow ? { filter: 'drop-shadow(0 0 6px rgba(200,132,252,.5))' } : undefined}
        />
      </svg>
    </div>
  );
}