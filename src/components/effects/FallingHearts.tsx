import { useEffect, useRef } from 'react';

export default function FallingHearts(){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el = ref.current!;
    const hearts = Array.from({length: 20}).map(()=>{
      const span = document.createElement('span');
      span.textContent = '❤';
      span.className = 'absolute select-none opacity-70';
      span.style.left = Math.random()*100+'%';
      span.style.top = '-20px';
      span.style.fontSize = (Math.random()*18+12)+'px';
      el.appendChild(span);
      const dur = 6000 + Math.random()*4000;
      const translateY = window.innerHeight + 40;
      let start = performance.now();
      let id = 0;
      const step = (t:number)=>{
        const p = Math.min(1, (t-start)/dur);
        const y = p*translateY;
        const x = Math.sin(p*6 + (translateY/100))*10; // 小幅擺動
        span.style.transform = `translate(${x}px, ${y}px)`;
        span.style.opacity = String(1 - p);
        if(p<1) id = requestAnimationFrame(step); else { start = performance.now(); id = requestAnimationFrame(step); }
      };
      id = requestAnimationFrame(step);
      return { span, cancel: ()=>cancelAnimationFrame(id) };
    });
    return ()=>{ hearts.forEach(h=>{ h.cancel(); h.span.remove(); }); };
  },[]);
  return <div ref={ref} className="pointer-events-none fixed inset-0 -z-10" aria-hidden />
}