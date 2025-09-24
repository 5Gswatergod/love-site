import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import StarButton from './StarButton';

export default function Modal({
  open, onClose, title, children, maxWidth = 'max-w-5xl'
}:{
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Esc 關閉 & body 鎖捲動
  useEffect(()=>{
    if(!open) return;
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return ()=>{ document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [open, onClose]);

  // 開啟動畫
  useEffect(()=>{
    if(!open) return;
    const tl = gsap.timeline();
    if (overlayRef.current) tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    if (boxRef.current)     tl.fromTo(boxRef.current,     { scale: 0.85, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' }, '<');
    return ()=> { tl.kill(); };
  }, [open]);

  if(!open) return null;

  const node = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'dialog'}
      onClick={(e)=>{ if(e.target === overlayRef.current) onClose(); }}
    >
      <div ref={boxRef} className={`w-full ${maxWidth}`}>
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-xl">
          <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-sm text-pink-100/90">{title ?? ''}</h3>
            <StarButton onClick={onClose} aria-label="Close dialog" />
          </header>
          <div className="p-0">{children}</div>
        </div>
      </div>
    </div>
  );

  // 用 portal 確保層級最高，避免被其他容器 overflow 隱藏
  return createPortal(node, document.body);
}