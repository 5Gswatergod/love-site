import { useEffect, useRef } from 'react';

export default function Starfield(){
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const c = ref.current!; const ctx = c.getContext('2d')!;
    let w = c.width = window.innerWidth; let h = c.height = window.innerHeight;
    let raf = 0;
    const stars = Array.from({length: 120}, ()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.2+0.2,
      s: Math.random()*0.6+0.2,
    }));

    const draw = ()=>{
      ctx.clearRect(0,0,w,h);
      for(const st of stars){
        ctx.globalAlpha = 0.5 + Math.sin(Date.now()*0.002*st.s)*0.5;
        ctx.fillStyle = '#c4b5fd';
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = ()=>{ w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
    window.addEventListener('resize', onResize);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  },[]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10" aria-hidden />
}