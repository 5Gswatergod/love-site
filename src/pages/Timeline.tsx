import Section from '../components/common/Section';
import { timeline } from '../data/timeline';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lightbox, { type LightboxItem } from '../components/common/Lightbox';

gsap.registerPlugin(ScrollTrigger);

export default function Timeline(){
  const wrapRef = useRef<HTMLDivElement>(null);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbItems, setLbItems] = useState<LightboxItem[]>([]);
  const [lbIndex, setLbIndex] = useState(0);

  useEffect(()=>{
    const ctx = gsap.context(()=>{
      gsap.utils.toArray<HTMLElement>('.tl-item').forEach((el)=>{
        gsap.fromTo(el,
          { autoAlpha:0, y:24, scale:0.98 },
          { autoAlpha:1, y:0, scale:1, duration:0.8, ease:'power2.out',
            scrollTrigger:{ trigger: el, start:'top 85%' } }
        );
      });
    }, wrapRef);
    return ()=> ctx.revert();
  },[]);

  const openLightbox = (items: LightboxItem[], idx: number) => {
    setLbItems(items); setLbIndex(idx); setLbOpen(true);
  };

  return (
    <>
      <Section title="我們的時間軸" subtitle="Timeline">
        <div ref={wrapRef} className="grid gap-4">
          {timeline.map((t,i)=> {
            const pics = (t.media ?? []).filter(m => m.type === 'image').map(m => ({
              src: m.src, alt: m.alt, caption: m.caption
            })) as LightboxItem[];

            return (
              <article key={i} className="tl-item glow-card rounded-2xl bg-white/5 p-4">
                <div className="text-xs opacity-70">{t.date}{t.location? ` • ${t.location}`:''}</div>
                <h3 className="text-lg font-semibold mt-1">{t.title}</h3>
                <p className="opacity-90 mt-1">{t.text}</p>

                {pics.length>0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {pics.map((p,pi)=> (
                      <button
                        key={p.src}
                        className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
                        onClick={()=> openLightbox(pics, pi)}
                        aria-label={`Open ${p.alt ?? 'photo'}`}
                      >
                        <img src={p.src} alt={p.alt ?? ''} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {t.mapUrl && (
                  <a href={t.mapUrl} target="_blank" className="inline-block mt-3 text-xs underline opacity-80">
                    查看地點
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </Section>

      <Lightbox
        open={lbOpen}
        items={lbItems}
        index={lbIndex}
        onClose={()=> setLbOpen(false)}
        onNav={(ni)=> setLbIndex(ni)}
      />
    </>
  );
}