import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

export default function HeartScene({ bpm = 150 }:{ bpm?: number }){
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);
      const path = q('#heart-path')[0] as unknown as SVGPathElement | undefined;
      if(!path) return;

      // 1) Dashed shimmer moves along the path
      gsap.to('#heart-dash', {
        strokeDashoffset: 200,
        duration: 6,
        ease: 'none',
        repeat: -1
      });

      // 2) Outer glow gentle breathing
      gsap.to('#heart-glow', {
        opacity: 0.45,
        duration: 1.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });

      // 3) Heart dots running + tiny pulse/rotate
      const dots = q('.heart-dot');
      dots.forEach((dot, i) => {
        gsap.to(dot, {
          duration: 6 + i * 0.7,
          repeat: -1,
          ease: 'power1.inOut',
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
          },
          delay: i * 0.5,
        });
        gsap.to(dot, {
          scale: 0.9,
          rotate: 10,
          transformOrigin: 'center',
          duration: 1.2 + i*0.15,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        });
      });

      // 4) Starfield twinkle
      const stars = q('.spark');
      gsap.to(stars, {
        opacity: () => gsap.utils.random(0.2, 0.9),
        scale: () => gsap.utils.random(0.8, 1.4),
        duration: () => gsap.utils.random(0.8, 2.0),
        stagger: { each: 0.06, repeat: -1, yoyo: true },
        ease: 'sine.inOut'
      });

      // ECG line: flowing dash + subtle vertical drift
      gsap.to('#ecg-dash', {
        strokeDashoffset: 600,
        duration: 4.5,
        ease: 'none',
        repeat: -1,
      });
      gsap.to('#ecg-group', {
        y: 0,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        // small up/down breathing so it feels alive
        onUpdate: function(){},
      });
      gsap.to('#ecg-glow', {
        opacity: 0.5,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Heartbeat: double-beat synced to BPM (dum–dum … rest)
      const beat = 60 / bpm; // seconds per beat
      const tlBeat = gsap.timeline({ repeat: -1 });
      tlBeat
        .to('#heart-group', { scale: 1.05, transformOrigin: '50% 50%', duration: beat * 0.28, ease: 'power2.out' })
        .to('#heart-group', { scale: 1.0,  duration: beat * 0.24, ease: 'power2.in' })
        .to('#heart-group', { scale: 1.05, duration: beat * 0.28, ease: 'power2.out' })
        .to('#heart-group', { scale: 1.0,  duration: beat * 0.6,  ease: 'power2.inOut' })
        .to('#heart-group', { scale: 1.0,  duration: beat * 1.6,  ease: 'linear' }); // rest

      // Gradient flow along paths via gradientTransform animation
      gsap.to('#g1', {
        attr: { gradientTransform: 'translate(1,0)' },
        duration: 2.2,
        repeat: -1,
        ease: 'none',
        yoyo: true
      });

      // 5) Click-to-sparkle burst (subtle)
      const svg = q('svg')[0] as unknown as SVGSVGElement;
      const burst = (evt: MouseEvent) => {
        const pt = svg.createSVGPoint();
        pt.x = evt.offsetX; pt.y = evt.offsetY;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class','burst');
        svg.appendChild(g);
        for(let i=0;i<6;i++){
          const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c.setAttribute('r','2.5');
          c.setAttribute('fill', ['#ffe4ec','#ffd166','#c4b5fd','#fbbf24','#f472b6'][i%5]);
          g.appendChild(c);
          gsap.fromTo(c,
            { x: pt.x, y: pt.y, opacity: 1, scale: 1 },
            { x: pt.x + gsap.utils.random(-40,40), y: pt.y + gsap.utils.random(-40,40), opacity: 0,
              scale: gsap.utils.random(0.6,1.6), duration: 0.8, ease: 'power2.out',
              onComplete: () => { c.remove(); if(i===5) g.remove(); }
            }
          );
        }
      };
      svg.addEventListener('pointerdown', burst);

      return () => {
        svg.removeEventListener('pointerdown', burst);
      };
    }, rootRef);

    return () => ctx.revert();
  },[bpm]);

  // Build a simple starfield inside the same SVG (viewBox coords)
  const stars = Array.from({length: 48}, () => ({
    x: Math.floor(Math.random()*680),
    y: Math.floor(Math.random()*520),
    r: Math.random()*1.8 + 0.6,
  }));

  return (
    <div ref={rootRef} className="relative">
      <svg
        className="mx-auto block"
        width="820" height="620" viewBox="0 0 680 520" aria-hidden
        style={{ maxWidth: '100%' }}
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1" gradientTransform="translate(0,0)">
            <stop offset="0%" stopColor="#c4b5fd"/>
            <stop offset="100%" stopColor="#ffd166"/>
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* background sparkles */}
        <g>
          {stars.map((s, i) => (
            <circle key={i} className="spark" cx={s.x} cy={s.y} r={s.r} fill="#c4b5fd" opacity="0.45" />
          ))}
        </g>

        {/* center ECG line */}
        <g id="ecg-group" transform="translate(0,0)">
          {/* glow underneath */}
          <path
            id="ecg-glow"
            d="M 40 260 L 120 260 L 150 220 L 170 318 L 200 260 L 260 260 L 300 200 L 330 330 L 360 260 L 430 260 L 460 220 L 480 318 L 510 260 L 580 260 L 640 260"
            fill="none"
            stroke="#f472b6"
            strokeWidth="10"
            opacity="0.35"
            filter="url(#glow)"
          />
          {/* main dash that flows */}
          <path
            id="ecg-dash"
            d="M 40 260 L 120 260 L 150 220 L 170 318 L 200 260 L 260 260 L 300 200 L 330 330 L 360 260 L 430 260 L 460 220 L 480 318 L 510 260 L 580 260 L 640 260"
            fill="none"
            stroke="url(#g1)"
            strokeWidth="3"
            strokeDasharray="24 18"
            strokeDashoffset="0"
            opacity="0.95"
          />
        </g>

        {/* heart group (glow + main path + dash + dots) */}
        <g id="heart-group">
          {/* glow outline (duplicate path) */}
          <path
            id="heart-glow"
            d="M340,470 C180,380 80,280 80,180 C80,110 132,60 198,60 C252,60 292,92 340,150 C388,92 428,60 482,60 C548,60 600,110 600,180 C600,280 500,380 340,470 Z"
            fill="none"
            stroke="#f472b6"
            strokeWidth="10"
            opacity="0.35"
            filter="url(#glow)"
          />

          {/* main path */}
          <path
            id="heart-path"
            d="M340,470 C180,380 80,280 80,180 C80,110 132,60 198,60 C252,60 292,92 340,150 C388,92 428,60 482,60 C548,60 600,110 600,180 C600,280 500,380 340,470 Z"
            fill="none"
            stroke="url(#g1)"
            strokeWidth="3"
            opacity="0.95"
          />

          {/* moving dash shimmer overlay */}
          <path
            id="heart-dash"
            d="M340,470 C180,380 80,280 80,180 C80,110 132,60 198,60 C252,60 292,92 340,150 C388,92 428,60 482,60 C548,60 600,110 600,180 C600,280 500,380 340,470 Z"
            fill="none"
            stroke="#ffe4ec"
            strokeWidth="2"
            strokeDasharray="14 10"
            strokeDashoffset="0"
            opacity="0.85"
          />

          {/* dots that orbit the path */}
          {['#ffe4ec','#ffd166','#ffc6d9','#fbbf24','#f472b6'].map((c,i)=>(
            <g key={i} className="heart-dot" transform="translate(340 470)">
              <circle r="6" fill={c} />
              <circle r="11" fill="none" stroke={c} opacity=".35" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}