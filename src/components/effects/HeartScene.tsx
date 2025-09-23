import { useEffect } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);

export default function HeartScene(){
  const prefersReduced = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(()=>{
    if(prefersReduced) return;
    const dot = document.querySelector('#heart-dot');
    const path = document.querySelector('#heart-path');
    if(!dot || !path) return;

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power1.inOut' } });
    tl.to(dot, {
      duration: 6,
      motionPath: {
        path: path as SVGPathElement,
        align: path as SVGPathElement,
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
      }
    });

    return () => {
      tl.kill();
    };
  }, [prefersReduced]);

  return (
    <div className="relative">
      <svg
        className="mx-auto block"
        width="820" height="620" viewBox="0 0 680 520" aria-hidden
        style={{ maxWidth: '100%' }}
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#a78bfa"/>
            <stop offset="100%" stopColor="#f0abfc"/>
          </linearGradient>
        </defs>

        <path
          id="heart-path"
          d="M340,470 C180,380 80,280 80,180 C80,110 132,60 198,60 C252,60 292,92 340,150 C388,92 428,60 482,60 C548,60 600,110 600,180 C600,280 500,380 340,470 Z"
          fill="none"
          stroke="url(#g1)"
          strokeWidth="2"
        />
        <g id="heart-dot" transform="translate(340 470)">
          <circle r="5" fill="#e9d5ff" />
          <circle r="12" fill="none" stroke="#e9d5ff" opacity=".35" />
        </g>
      </svg>
    </div>
  );
}