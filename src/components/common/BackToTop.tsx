import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 240);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初始判斷
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  return (
    <div
      aria-hidden={!visible}
      className={`fixed right-4 bottom-4 z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <button
        onClick={toTop}
        aria-label="回到最上面"
        className="group size-12 rounded-full border border-white/15 bg-black/35 backdrop-blur
                   hover:bg-black/45 focus:outline-none focus:ring-2 focus:ring-fuchsia-400
                   shadow-lg shadow-black/20 flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-pink-100 transition-transform group-hover:-translate-y-0.5" fill="currentColor" aria-hidden>
          <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
      </button>
    </div>
  );
}