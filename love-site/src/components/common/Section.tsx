import { type ReactNode } from 'react';
export default function Section({title, subtitle, children}:{title?:string; subtitle?:string; children:ReactNode}){
  return (
    <section className="my-10 md:my-16">
      {(title || subtitle) && (
        <header className="mb-6">
          {subtitle && <p className="uppercase tracking-widest text-xs text-indigo-300/80">{subtitle}</p>}
          {title && <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-fuchsia-300">{title}</h2>}
        </header>
      )}
      <div className="glow-card rounded-2xl bg-white/5 p-5 md:p-7">
        {children}
      </div>
    </section>
  )
}