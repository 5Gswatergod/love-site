import { NavLink, useLocation } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';

export default function Navbar(){
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/25 border-b border-white/10">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-semibold tracking-wide">★ For {siteConfig.herName}</div>
        <ul className="flex gap-3 text-sm">
          {siteConfig.nav.map(l => (
            <li key={l.to}>
              <NavLink to={l.to}
                className={({isActive}) => `px-3 py-1.5 rounded-full transition hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`}
                aria-current={pathname === l.to ? 'page' : undefined}
              >{l.label}</NavLink>
            </li>
          ))}
        </ul>
        <button className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs">EN/中文</button>
      </nav>
    </header>
  )
}