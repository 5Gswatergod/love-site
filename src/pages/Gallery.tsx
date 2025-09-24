import { useMemo, useState } from 'react';
import Section from '../components/common/Section';
import Lightbox, { type LightboxItem } from '../components/common/Lightbox';
import { gallery } from '../data/gallery';

type OpenState = { open: boolean; items: LightboxItem[]; index: number };

export default function GalleryPage(){
  const [q, setQ] = useState('');               // 搜尋關鍵字
  const [open, setOpen] = useState<OpenState>({ open:false, items:[], index:0 });

  // 依關鍵字過濾（比對 title、caption）
  const groups = useMemo(()=>{
    const kw = q.trim().toLowerCase();
    if(!kw) return gallery;
    return gallery.map(g => ({
      ...g,
      items: g.items.filter(it =>
        (g.title?.toLowerCase() ?? '').includes(kw) ||
        (it.caption?.toLowerCase() ?? '').includes(kw)
      )
    })).filter(g => g.items.length > 0);
  }, [q]);

  const openBox = (items: LightboxItem[], index: number) =>
    setOpen({ open:true, items, index });

  return (
    <Section title="相簿" subtitle="Gallery">
      <div className="mb-5 flex items-center gap-2">
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="搜尋標題或說明…"
          className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {q && (
          <button
            onClick={()=>setQ('')}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >清除</button>
        )}
      </div>

      <div className="space-y-10">
        {groups.map(group => {
          return (
            <section key={group.id}>
              <h3 className="text-lg md:text-xl font-semibold mb-3">
                {group.title}
                <span className="ml-2 text-xs opacity-70">({group.items.length})</span>
              </h3>

              {(() => {
                // Normalize once per group for Lightbox
                const normalized: LightboxItem[] = group.items.map((gi: any) =>
                  gi.type === 'video'
                    ? { type: 'video', src: gi.src, poster: gi.poster, caption: gi.caption, loop: gi.loop, muted: gi.muted }
                    : { type: 'image', src: gi.src, alt: gi.alt ?? '', caption: gi.caption }
                );

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {group.items.map((it: any, i: number) => {
                      const isVideo = it.type === 'video';
                      const thumb = isVideo ? (it.poster ?? '/assets/img/placeholder.webp') : it.src;
                      const alt = isVideo ? (it.caption ?? '影片') : (it.alt ?? '');
                      return (
                        <button
                          key={`${it.src}-${i}`}
                          className="group aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 relative"
                          onClick={() => openBox(normalized, i)}
                          aria-label={it.caption ?? (isVideo ? '播放影片' : '查看圖片')}
                        >
                          <img
                            src={thumb}
                            alt={alt}
                            loading="lazy"
                            onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = '/assets/img/placeholder.webp'; }}
                            className="h-full w-full object-cover rounded-[1.25rem] border border-white/20 transition-transform duration-300 group-hover:scale-105"
                          />
                          {isVideo && (
                            <span className="absolute inset-0 grid place-items-center">
                              <span className="rounded-full bg-black/40 p-3 border border-white/30">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor" aria-hidden>
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </section>
          );
        })}

        {groups.length === 0 && (
          <p className="opacity-80">沒有符合「{q}」的相片，換個關鍵字看看。</p>
        )}
      </div>

      <Lightbox
        open={open.open}
        items={open.items}
        index={open.index}
        onClose={()=> setOpen(s=>({ ...s, open:false }))}
        onNav={(idx)=> setOpen(s=>({ ...s, index: idx }))}
      />
    </Section>
  );
}