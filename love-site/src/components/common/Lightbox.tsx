import { useEffect, useRef } from 'react';

export type LightboxItem = { src: string; alt?: string; caption?: string };

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

  if(!open) return null;

  const it = items[index];

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-label="Photo viewer"
      onClick={(e)=>{ if(e.target === dialogRef.current) onClose(); }}
    >
      <div className="max-w-5xl w-full">
        <div className="relative bg-black/40 rounded-xl overflow-hidden border border-white/10">
          <img src={it.src} alt={it.alt ?? ''} className="w-full max-h-[78vh] object-contain" />
          {it.caption && <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-center px-4 py-2 text-sm">{it.caption}</div>}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Close"
          >✕</button>

          {items.length>1 && (
            <>
              <button
                onClick={()=> onNav((index-1+items.length)%items.length)}
                className="absolute inset-y-0 left-0 w-14 lg:w-16 hover:bg-white/10"
                aria-label="Previous"
              >◀</button>
              <button
                onClick={()=> onNav((index+1)%items.length)}
                className="absolute inset-y-0 right-0 w-14 lg:w-16 hover:bg-white/10"
                aria-label="Next"
              >▶</button>
            </>
          )}
        </div>
        <div className="mt-3 text-center text-xs opacity-75">{index+1} / {items.length}</div>
      </div>
    </div>
  );
}