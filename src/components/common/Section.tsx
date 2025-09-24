import { type ReactNode } from 'react';
export default function Section({title, subtitle, children}:{title?:string; subtitle?:string; children:ReactNode}){
  return (
    <section className="my-10 md:my-16">
      {(title || subtitle) && (
        <header className="mb-6">
          {subtitle && <p className="uppercase tracking-widest text-xs text-pink-200/90">{subtitle}</p>}
          {title && (
            <h2 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent
                           bg-gradient-to-r from-pink-200 via-rose-200 to-yellow-200 drop-shadow">
              {title}
            </h2>
          )}
        </header>
      )}
      <div className="glow-card p-5 md:p-7 relative overflow-hidden">
        {/* 星星裝飾 */}
        <Star />
        {children}
      </div>
    </section>
  )
}
function Star(){
  return (
    <svg className="absolute -top-3 -left-3 w-16 h-16 opacity-50 star-dot" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2l2.4 5.8L20 9l-4 3.6L17 19l-5-2.7L7 19l1-6.4L4 9l5.6-1.2L12 2z" fill="#ffd166"/>
    </svg>
  );
}