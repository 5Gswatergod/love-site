import { useEffect, useRef } from 'react';

export default function Modal({
  open, onClose, title, children, maxWidth = 'max-w-5xl'
}:{
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string; // e.g. 'max-w-3xl' | 'max-w-5xl'
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(!open) return;
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return ()=> document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if(!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-label={title ?? 'dialog'}
      onClick={(e)=>{ if(e.target === overlayRef.current) onClose(); }}
    >
      <div className={`w-full ${maxWidth}`}>
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40">
          <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-sm opacity-80">{title ?? ''}</h3>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Close"
            >✕</button>
          </header>
          <div className="p-0">{children}</div>
        </div>
      </div>
    </div>
  );
}