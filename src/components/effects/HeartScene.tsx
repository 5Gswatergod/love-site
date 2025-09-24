import { useEffect } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);

export default function HeartScene(){
  useEffect(()=>{
    const path = document.querySelector('#heart-path');
    if(!path) return;

    const dots = Array.from(document.querySelectorAll('.heart-dot'));
    dots.forEach((dot,i)=>{
      const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power1.inOut' } });
      tl.to(dot, {
        duration: 6 + i*0.8, // 每顆速度略不同
        motionPath: {
          path: path as SVGPathElement,
          align: path as SVGPathElement,
          alignOrigin: [0.5, 0.5],
        },
        delay: i*0.6, // 延遲起跑
      });
    });

    return ()=> gsap.globalTimeline.clear();
  },[]);

  return (
    <div className="relative">
      <svg
        className="mx-auto block"
        width="820" height="620" viewBox="0 0 680 520" aria-hidden
        style={{ maxWidth: '100%' }}
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffc6d9"/>
            <stop offset="100%" stopColor="#ffd166"/>
          </linearGradient>
        </defs>

        <path
          id="heart-path"
          d="M340,470 C180,380 80,280 80,180 C80,110 132,60 198,60 C252,60 292,92 340,150 C388,92 428,60 482,60 C548,60 600,110 600,180 C600,280 500,380 340,470 Z"
          fill="none"
          stroke="url(#g1)"
          strokeWidth="3"
          opacity="0.95"
        />

        {/* 多顆星星 */}
        {['#ffe4ec','#ffd166','#ffc6d9','#fbbf24','#f472b6'].map((c,i)=>(
          <g key={i} className="heart-dot" transform="translate(340 470)">
            <circle r="6" fill={c} />
            <circle r="12" fill="none" stroke={c} opacity=".4" />
          </g>
        ))}
      </svg>
    </div>
  );
}