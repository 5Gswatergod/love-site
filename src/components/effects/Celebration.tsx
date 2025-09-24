// src/components/effects/Celebration.tsx
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import gsap from 'gsap';

type CelebrationHandle = { burst: () => void; heartBeat: () => void };
type Props = {
  auto?: boolean;          // 掛上就自動放一次
  zIndex?: number;         // 疊層
  confettiCount?: number;  // 紙花數量
  fireworks?: number;      // 煙花組數
};

const prefersReduced = typeof window !== 'undefined'
  ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  : false;

/** 全頁覆蓋特效：煙花 + 紙花 + 心跳 */
const Celebration = forwardRef<CelebrationHandle, Props>(function Celebration(
  { auto = false, zIndex = 60, confettiCount = 140, fireworks = 3 }, ref
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<SVGSVGElement>(null);

  useImperativeHandle(ref, () => ({
    burst: () => runAll(),
    heartBeat: () => beat(),
  }));

  useEffect(() => {
    if (auto) runAll();
    // 清理
    return () => { gsap.globalTimeline.clear(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAll = () => {
    if (prefersReduced) {
      // 簡化：只做一次心跳與少量紙花
      tinyConfetti(40);
      beat();
      return;
    }
    confetti(confettiCount);
    fireworkBurst(fireworks);
    beat();
  };

  // 心跳（置中小動畫）
  const beat = () => {
    const heart = heartRef.current;
    if (!heart) return;
    const tl = gsap.timeline();
    tl.fromTo(heart, { scale: 0.9 }, { scale: 1.12, duration: 0.22, ease: 'power2.out' })
      .to(heart, { scale: 1.0, duration: 0.25, ease: 'power2.inOut' })
      .to(heart, { scale: 1.08, duration: 0.18, ease: 'power2.out' })
      .to(heart, { scale: 1.0, duration: 0.28, ease: 'power2.inOut' });
  };

  // 紙花
  const confetti = (count: number) => {
    const root = rootRef.current!;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'absolute will-change-transform rounded';
      const size = gsap.utils.random(6, 12);
      const left = gsap.utils.random(0, 100);
      s.style.left = `${left}vw`;
      s.style.top = `-20px`;
      s.style.width = `${size}px`;
      s.style.height = `${size * gsap.utils.random(0.6, 1.6)}px`;
      s.style.background = randomRibbon();
      s.style.opacity = '0.95';
      s.style.filter = 'drop-shadow(0 2px 6px rgba(255,255,255,.25))';
      root.appendChild(s);

      const fall = gsap.to(s, {
        y: () => window.innerHeight + 80,
        rotation: gsap.utils.random(-180, 180),
        x: `+=${gsap.utils.random(-120, 120)}`,
        duration: gsap.utils.random(2.5, 4.5),
        ease: 'power1.in',
        onComplete: () => s.remove(),
      });
      // 水平擺動
      gsap.to(s, { x: `+=${gsap.utils.random(-40, 40)}`, repeat: -1, yoyo: true, duration: gsap.utils.random(0.6, 1.2), ease: 'sine.inOut' });
      // 旋轉翻面
      gsap.to(s, { rotateY: '+=360', repeat: -1, duration: gsap.utils.random(0.8, 1.4), ease: 'none' });

      // 減動時只跑一次
      if (prefersReduced) fall.repeat(0);
    }
  };

  const tinyConfetti = (n: number) => confetti(n);

  // 煙花（圓形粒子爆開）
  const fireworkBurst = (groups: number) => {
    const root = rootRef.current!;
    const makeDot = (x: number, y: number) => {
      const d = document.createElement('span');
      d.className = 'absolute block rounded-full will-change-transform';
      const sz = gsap.utils.random(2, 4);
      d.style.width = `${sz}px`; d.style.height = `${sz}px`;
      d.style.left = `${x}px`; d.style.top = `${y}px`;
      d.style.background = randomGlow();
      d.style.boxShadow = '0 0 10px rgba(255,255,255,.6)';
      root.appendChild(d);
      return d;
    };

    for (let g = 0; g < groups; g++) {
      const cx = gsap.utils.random(innerWidth * 0.2, innerWidth * 0.8);
      const cy = gsap.utils.random(innerHeight * 0.2, innerHeight * 0.5);

      const dots: HTMLElement[] = [];
      const count = prefersReduced ? 20 : 60;
      for (let i = 0; i < count; i++) dots.push(makeDot(cx, cy));

      const tl = gsap.timeline({ onComplete: () => dots.forEach(d => d.remove()) });
      tl.to(dots, {
        x: (_, t) => Math.cos((t / count) * Math.PI * 2) * gsap.utils.random(60, 140),
        y: (_, t) => Math.sin((t / count) * Math.PI * 2) * gsap.utils.random(60, 140),
        scale: gsap.utils.random(0.9, 1.6),
        opacity: 0,
        duration: prefersReduced ? 0.7 : 1.2,
        ease: 'power2.out',
        stagger: { each: prefersReduced ? 0.003 : 0.006 },
      }, 0);
    }
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex }}
      aria-hidden
    >
      {/* 中央心跳愛心 */}
      {/* <svg ref={heartRef} viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 opacity-90">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
          fill="url(#g)" stroke="rgba(255,255,255,.8)" strokeWidth="1"
        />
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stopColor="#c084fc"/><stop offset="1" stopColor="#60a5fa"/>
          </linearGradient>
        </defs>
      </svg> */}
    </div>
  );
});

export default Celebration;

// 色票
function randomRibbon() {
  const colors = ['#f472b6', '#fda4af', '#a78bfa', '#94a3b8', '#60a5fa', '#f59e0b', '#34d399', '#f472b6'];
  return colors[Math.floor(Math.random() * colors.length)];
}
function randomGlow() {
  const colors = ['#fde68a', '#fca5a5', '#c4b5fd', '#93c5fd', '#6ee7b7'];
  return colors[Math.floor(Math.random() * colors.length)];
}