import { useEffect, useRef, useState } from 'react';

export type LightboxItem =
  | { type: 'image'; src: string; alt?: string; caption?: string }
  | { type: 'video'; src: string; poster?: string; caption?: string; loop?: boolean; muted?: boolean };

export default function Lightbox({
  open, items, index, onClose, onNav,
}:{
  open: boolean;
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onNav: (nextIndex: number) => void;
}){
  const dialogRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const touchStart = useRef<{x:number;y:number;time:number} | null>(null);

  useEffect(()=>{
    if(!open) return;
    const onKey = (e: KeyboardEvent) => {
      if(e.key === 'Escape') onClose();
      if(e.key === 'ArrowRight') onNav((index+1) % items.length);
      if(e.key === 'ArrowLeft') onNav((index-1+items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, index, items.length, onClose, onNav]);

  useEffect(()=>{
    if(!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    // 預載相鄰圖片（僅限 image 類型）
    const next = items[(index+1)%items.length];
    const prev = items[(index-1+items.length)%items.length];
    [next, prev].forEach(it=>{
      if(it && it.type==='image'){
        const img = new Image();
        img.src = it.src;
      }
    });

    return ()=>{ document.documentElement.style.overflow = prevOverflow; };
  },[open, index, items]);

  if(!open) return null;

  const it = items[index];

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur flex items-center justify-center p-4 overscroll-contain"
      role="dialog" aria-modal="true" aria-label="Media viewer"
      onClick={(e)=>{ if(e.target === dialogRef.current) onClose(); }}
      onTouchStart={(e)=>{
        const t = e.touches[0];
        touchStart.current = { x: t.clientX, y: t.clientY, time: performance.now() };
        setDragX(0);
      }}
      onTouchMove={(e)=>{
        if(!touchStart.current) return;
        const t = e.touches[0];
        const dx = t.clientX - touchStart.current.x;
        const dy = t.clientY - touchStart.current.y;
        // 僅在水平位移較大時啟用拖曳效果
        if(Math.abs(dx) > Math.abs(dy)){
          e.preventDefault();
          setDragX(dx);
        }
      }}
      onTouchEnd={()=>{
        if(!touchStart.current) return;
        const dx = dragX;
        const dt = performance.now() - touchStart.current.time;
        setDragX(0);
        touchStart.current = null;
        const SWIPE_DIST = 60; // 觸發閾值
        const SWIPE_VELO = 0.35; // 快速滑動也算
        if(Math.abs(dx) > SWIPE_DIST || Math.abs(dx)/Math.max(dt,1) > SWIPE_VELO){
          if(dx < 0) onNav((index+1)%items.length);
          else onNav((index-1+items.length)%items.length);
        }
      }}
    >
      <div className="w-[min(92vw, 900px)]">
        <div
          className="relative bg-black/40 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center max-h-[82dvh]"
          style={{ transform: dragX ? `translateX(${dragX}px)` : undefined, transition: dragX ? 'none' : 'transform 200ms ease' }}
        >
          {it.type === 'image' ? (
            <img src={it.src} alt={it.alt ?? ''} className="max-h-[78dvh] max-w-full w-auto h-auto object-contain" />
          ) : (
            <video
              src={it.src}
              poster={it.poster}
              className="max-h-[78dvh] max-w-full w-auto h-auto object-contain"
              controls
              autoPlay
              loop={it.loop ?? true}
              muted={it.muted ?? true}
              playsInline
            />
          )}
          {it.caption && (
            <div className="absolute inset-x-0 bottom-0 px-4 py-2 text-sm text-white/90 text-center bg-gradient-to-t from-black/60 to-transparent line-clamp-2">
              {it.caption}
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Close"
          >✕</button>

          {items.length>1 && (
            <>
              <button
                onClick={()=> onNav((index-1+items.length)%items.length)}
                className="absolute inset-y-0 left-0 w-16 lg:w-20 hover:bg-white/10 focus:outline-none"
                aria-label="Previous"
              >
                <span className="sr-only">Previous</span>
              </button>
              <button
                onClick={()=> onNav((index+1)%items.length)}
                className="absolute inset-y-0 right-0 w-16 lg:w-20 hover:bg-white/10 focus:outline-none"
                aria-label="Next"
              >
                <span className="sr-only">Next</span>
              </button>
            </>
          )}
        </div>
        <div className="mt-3 text-center text-xs opacity-75">{index+1} / {items.length}</div>
      </div>
    </div>
  );
}