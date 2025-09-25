import Section from '../components/common/Section';
import { timeline } from '../data/timeline';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lightbox, { type LightboxItem } from '../components/common/Lightbox';
import Comments from '../components/common/Comments';
import { supabase } from '../lib/supabase';
import TimelineUploader from '../components/common/TimelineUploader';

gsap.registerPlugin(ScrollTrigger);

export default function Timeline(){
  const wrapRef = useRef<HTMLDivElement>(null);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbItems, setLbItems] = useState<LightboxItem[]>([]);
  const [lbIndex, setLbIndex] = useState(0);

  // 合併本地 timeline 與雲端 timeline_events 後的資料
  const [rows, setRows] = useState<typeof timeline>([]);

  const load = async () => {
    // 先用本地資料
    let merged = [...timeline];

    // 取雲端資料並轉成目前渲染所需格式
    if (supabase) {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('title, description, date, media_url, media_type')
        .order('date', { ascending: true });

      if (!error && Array.isArray(data)) {
        const cloud = data.map((r) => ({
          title: r.title || '',
          text: r.description || '',
          date: r.date || '',
          location: undefined,
          mapUrl: undefined,
          comments: [],
          media: r.media_url
            ? [
                r.media_type === 'video'
                  ? {
                      type: 'video' as 'video',
                      src: r.media_url,
                      poster: undefined,
                      controls: true,
                      playsInline: true,
                      muted: false,
                      loop: false,
                      autoPlay: false,
                    }
                  : {
                      type: 'image' as 'image',
                      src: r.media_url,
                    }
              ]
            : []
        }));
        merged = [...merged, ...cloud];
      }
    }

    // 去重（以 title+date 當 key）並依日期排序
    const key = (x: any) => `${x.title}|${x.date}`;
    const map = new Map<string, any>();
    merged.forEach((x) => map.set(key(x), x));
    const sorted = Array.from(map.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
    setRows(sorted);
  };

  // 初始載入
  useEffect(() => { load(); }, []);

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
        <TimelineUploader onCreated={load} />
        <div ref={wrapRef} className="grid gap-4">
          {rows.map((t,i)=> {
            const pics: (LightboxItem & { alt?: string })[] = (t.media ?? []).filter(m => m.type === 'image').map(m => ({
              type: 'image',
              src: m.src,
              alt: m.alt,
              caption: m.caption
            }));

            const vids = (t.media ?? []).filter(m => m.type === 'video');

            return (
              <article key={i} className="tl-item glow-card rounded-2xl bg-white/5 p-4">
                <div className="text-xs opacity-70">{t.date}{t.location? ` • ${t.location}`:''}</div>
                <h3 className="text-lg font-semibold mt-1">{t.title}</h3>
                <p className="opacity-90 mt-1">{t.text}</p>

                {pics.length>0 && (
                  pics.length === 1 ? (
                    // 單張：Hero 寬圖（滿版、16:9、hover 微放大）
                    <div className="mt-3">
                      <button
                        className="group block w-full overflow-hidden rounded-xl border border-white/10 bg-white/5"
                        onClick={()=> openLightbox(pics, 0)}
                        aria-label={`Open ${pics[0].alt ?? 'photo'}`}
                      >
                        <div className="relative aspect-video">
                          <img
                            src={pics[0].src}
                            alt={pics[0].alt ?? ''}
                            loading="lazy"
                            onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = '/assets/img/placeholder.webp'; }}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent" />
                        </div>
                      </button>
                    </div>
                  ) : (
                    // 多張：整齊方格（方形裁切、hover 微放大）
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {pics.map((p,pi)=> (
                        <button
                          key={p.src}
                          className="group aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                          onClick={()=> openLightbox(pics, pi)}
                          aria-label={`Open ${p.alt ?? 'photo'}`}
                        >
                          <img
                            src={p.src}
                            alt={p.alt ?? ''}
                            loading="lazy"
                            onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = '/assets/img/placeholder.webp'; }}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                  )
                )}

                {vids.length>0 && (
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    {vids.map((v,vi)=> (
                      <video
                        key={vi}
                        src={v.src}
                        poster={v.poster}
                        controls={v.controls}
                        muted={v.muted}
                        loop={v.loop}
                        playsInline={v.playsInline}
                        autoPlay={v.autoPlay}
                        className="rounded-lg w-full max-h-80 object-contain bg-black"
                      >
                        你的瀏覽器不支援影片播放
                      </video>
                    ))}
                  </div>
                )}

                {/* Comments (Instagram style) */}
                <Comments
                  storageKey={`comments:${t.date || t.title}`}
                  initial={t.comments ?? []}
                />

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