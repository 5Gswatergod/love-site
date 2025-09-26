import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { siteConfig } from '../../data/siteConfig';
import StarButton from './StarButton';
import { starBurst } from '../../lib/starBurst';
import { useAudio } from '../../hooks/useAudio';
import { audioManifest } from '../../data/audioManifest';
import ShareButton from './ShareButton';
import { prefetchTimeline } from '../../utils/prefetchTimeline';

export default function Navbar(){
  const { pathname } = useLocation();
  const { play: playClick } = useAudio(audioManifest.click);
  const [open, setOpen] = useState(false);

  const fireStars: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    // 取得點擊位置（視窗座標）
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    starBurst(cx, cy, 28);
    playClick();
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-pink-500/20 border-b border-white/20 shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-pink-200 drop-shadow">★ For {siteConfig.herName}</div>

        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            className="lg:hidden inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20"
            onClick={()=>setOpen(o=>!o)}
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label="切換主選單"
            type="button"
          >
            <span className="i" aria-hidden>☰</span>
          </button>

          <ul className="hidden lg:flex gap-3 text-sm">
            {siteConfig.nav.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onMouseEnter={l.to === '/timeline' ? prefetchTimeline : undefined}
                  onFocus={l.to === '/timeline' ? prefetchTimeline : undefined}
                  className={({isActive}) =>
                    `px-3 py-1.5 rounded-full transition
                     ${isActive
                       ? 'bg-pink-400/40 text-white border border-white/30 shadow'
                       : 'bg-white/10 hover:bg-white/20'}`
                  }
                  aria-current={pathname === l.to ? 'page' : undefined}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Kirby 星星彩蛋按鈕（行動裝置也好點） */}
          <StarButton onClick={fireStars} aria-label="Sprinkle stars" />
          <ShareButton className="ml-2" />
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="nav-menu"
        className={`lg:hidden transition-all duration-300 ${open ? 'max-h-[85dvh] opacity-100' : 'max-h-0 opacity-0'} overflow-auto overscroll-contain`}
        aria-hidden={!open}
      >
        <ul className="px-4 pb-4 space-y-2">
          {siteConfig.nav.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                onClick={()=> setOpen(false)}
                onMouseEnter={l.to === '/timeline' ? prefetchTimeline : undefined}
                onFocus={l.to === '/timeline' ? prefetchTimeline : undefined}
                className={({isActive}) =>
                  `block px-3 py-2 rounded-lg transition ${isActive ? 'bg-pink-400/40 text-white border border-white/30 shadow' : 'bg-white/10 hover:bg-white/20'}`
                }
                aria-current={pathname === l.to ? 'page' : undefined}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}