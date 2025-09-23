import Section from '../components/common/Section';
import { finalLines } from '../data/messages';
import { audioManifest } from '../data/audioManifest';
import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

export default function Final(){
  const [revealed, setRevealed] = useState(0);
  const { ready, isPlaying, toggle } = useAudio(audioManifest.final);
  const intervalRef = useRef<number | null>(null);
  const prefersReduced = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(()=>{
    intervalRef.current = window.setInterval(
      () => setRevealed(r=> Math.min(finalLines.length, r+1)),
      2200
    );
    return ()=>{ if(intervalRef.current) window.clearInterval(intervalRef.current); };
  },[]);

  // Heart path animation
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
    <Section title="最終告白" subtitle="Final">
      <div className="relative">
        {/* Heart SVG background */}
        <HeartBG />

        <div className="relative z-10 text-center space-y-6">
          <button onClick={toggle} className="px-4 py-2 rounded-full bg-indigo-500/40 hover:bg-indigo-500/60">
            {isPlaying? '⏸ 暫停音樂' : (ready? '▶ 播放音樂' : '… 載入中')}
          </button>
          <div className="space-y-3">
            {finalLines.slice(0, revealed).map((l,i)=> (
              <p key={i} className="text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-sky-200 to-fuchsia-200">
                {l}
              </p>
            ))}
          </div>
          <div className="pt-6">
            <Countdown targetDate={new Date('2025-10-05T19:00:00-04:00')} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function Countdown({targetDate}:{targetDate: Date}){
  const [left, setLeft] = useState(targetDate.getTime() - Date.now());
  useEffect(()=>{ const id = setInterval(()=> setLeft(targetDate.getTime()-Date.now()), 1000); return ()=> clearInterval(id); },[targetDate]);
  if(left<0) return <p className="text-emerald-300">今天見面！</p>;
  const s = Math.floor(left/1000);
  const d = Math.floor(s/86400);
  const h = Math.floor((s%86400)/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  return <p className="text-sm opacity-90">距離我們的約會：{d} 天 {h} 時 {m} 分 {sec} 秒</p>;
}

/** 背景心形 SVG + 會沿路徑跑的小星點 */
function HeartBG(){
  return (
    <svg
      className="absolute inset-0 -z-10 mx-auto opacity-60"
      width="680" height="520" viewBox="0 0 680 520" aria-hidden
      style={{left:'50%', transform:'translateX(-50%)'}}
    >
      {/* 心形路徑（平滑可愛版本） */}
      <path
        id="heart-path"
        d="M340,470 C180,380 80,280 80,180 C80,110 132,60 198,60 C252,60 292,92 340,150 C388,92 428,60 482,60 C548,60 600,110 600,180 C600,280 500,380 340,470 Z"
        fill="none"
        stroke="url(#g1)"
        strokeWidth="2"
      />
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#a78bfa"/>
          <stop offset="100%" stopColor="#f0abfc"/>
        </linearGradient>
      </defs>

      {/* 星點（被 GSAP 綁定沿 path 移動） */}
      <g id="heart-dot" transform="translate(340 470)">
        <circle r="5" fill="#e9d5ff" />
        <circle r="12" fill="none" stroke="#e9d5ff" opacity=".35" />
      </g>
    </svg>
  );
}