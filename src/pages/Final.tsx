import Section from '../components/common/Section';
import { finalLines } from '../data/messages';
import { audioManifest } from '../data/audioManifest';
import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { useLrc } from '../hooks/useLrc';
import { publicUrl } from '../lib/publicUrl';
import Modal from '../components/common/Modal';
import HeartScene from '../components/effects/HeartScene';
import PoyoButton from '../components/common/PoyoButton';
import { gsap } from 'gsap';
import PlayerBar from '../components/common/PlayerBar';
import { useMediaSession } from '../hooks/useMediaSession';
import Celebration from '../components/effects/Celebration';

export default function Final(){
  const celebRef = useRef<{ burst: () => void; heartBeat: () => void }>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(()=>{
    if(audioRef.current) audioRef.current.volume = 0.8;
  }, []);

  useMediaSession({
    audio: audioRef.current,
    title: 'ˊ祝你愛我愛到天荒地老',
    artist: '顏人中',
    album: 'For 可愛腳小朋友',
    artwork: `${import.meta.env.BASE_URL}assets/img/cover-512.png`,
  });

  const { ready, isPlaying, play, pause, toggle, setVolume, unlock, getTime, error,
          getDuration, seek, getVolume, toggleMuted, setLooping } =
    useAudio(audioManifest.final, { preload: 'auto', loop: false, initialVolume: 1 });
  const [revealed, setRevealed] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [openHeart, setOpenHeart] = useState(false);

  const playBtnRef = useRef<HTMLButtonElement | null>(null);
  const noteTlRef = useRef<gsap.core.Tween | null>(null);

  // const prevWasPlaying = useRef(false);

  // volume tween state for reliable fade in/out
  // (removed unused volObjRef)

  const lrc = useLrc(publicUrl('assets/lyrics/song.lrc'));

  // drive lyric refresh ~10fps so it doesn't freeze
  const [lyricTime, setLyricTime] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLyricTime(getTime()), 100);
    return () => clearInterval(id);
  }, [getTime]);

  // ===== Autoplay (best-effort) =====
  // 1) Try once when audio is ready
  const autoTriedRef = useRef(false);
  useEffect(() => {
    if (!ready || isPlaying || autoTriedRef.current) return;
    autoTriedRef.current = true;
    // Try to play immediately; if blocked, we will fall back to user-gesture below
    play().catch(() => {
      // reset so gesture handler can try again
      autoTriedRef.current = false;
    });
  }, [ready, isPlaying, play]);

  useEffect(() => {
    const btn = playBtnRef.current;
    if (!btn) return;
    // tiny poyo bounce on state change
    gsap.fromTo(btn, { scale: 0.98, y: 1 }, { scale: 1, y: 0, duration: 0.22, ease: 'power2.out' });

    // floating music note while playing
    const note = btn.querySelector('.note-float') as HTMLElement | null;
    if (noteTlRef.current) { noteTlRef.current.kill(); noteTlRef.current = null; }
    if (isPlaying && note) {
      noteTlRef.current = gsap.to(note, { y: -6, opacity: 1, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    } else if (note) {
      gsap.to(note, { y: 0, opacity: 0.85, duration: 0.2, ease: 'power2.out' });
    }
  }, [isPlaying]);

  useEffect(()=>{
    intervalRef.current = window.setInterval(
      () => setRevealed(r=> Math.min(finalLines.length, r+1)),
      2200
    );
    return ()=>{ if(intervalRef.current) window.clearInterval(intervalRef.current); };
  },[]);

  // 開/關 Modal：不再影響音樂，只做彈窗動畫
  useEffect(() => {
    if (openHeart) {
      gsap.fromTo(
        '.modal-heart',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
      celebRef.current?.burst();
    }
  }, [openHeart]);

  // Add keyboard shortcuts for player actions
  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag && /INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (e.code === 'Space') { e.preventDefault(); toggle(); }
      if (e.code === 'ArrowRight') { seek(getTime() + 5); }
      if (e.code === 'ArrowLeft')  { seek(getTime() - 5); }
      if (e.code === 'ArrowUp')    { setVolume(Math.min(1, getVolume() + 0.05)); }
      if (e.code === 'ArrowDown')  { setVolume(Math.max(0, getVolume() - 0.05)); }
      if (e.key.toLowerCase() === 'm') { toggleMuted(); }
      if (e.key.toLowerCase() === 'l') { setLooping(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, seek, getTime, setVolume, getVolume, toggleMuted, setLooping]);

  // compute current lyric index based on lyricTime
  const currentLyricIndex = (() => {
    if (!lrc.length) return -1;
    let i = lrc.findIndex((l, ix) => {
      const next = lrc[ix+1]?.t ?? Number.POSITIVE_INFINITY;
      return lyricTime >= l.t && lyricTime < next;
    });
    if (i === -1 && lyricTime >= lrc[lrc.length - 1].t) i = lrc.length - 1;
    return i;
  })();

  return (
    <Section title="最終告白" subtitle="Final">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <PoyoButton ref={playBtnRef as any} onClick={async () => { await unlock(); toggle(); }}>
            {isPlaying ? (
              <span className="inline-flex items-center gap-2">
                <span className="note-float opacity-90">🎵</span>
                暫停音樂
              </span>
            ) : ready ? (
              <span className="inline-flex items-center gap-2">
                ▶ 播放！
              </span>
            ) : (
              '載入中...'
            )}
          </PoyoButton>
          <PoyoButton onClick={()=> setOpenHeart(true)}>
            💗 放大查看愛心
          </PoyoButton>
          <PoyoButton onClick={()=> celebRef.current?.burst()}>
            🎆 放煙火
          </PoyoButton>
        </div>

        <PlayerBar
          api={{
            ready, isPlaying, play, pause, toggle,
            getTime, getDuration, seek,
            getVolume, setVolume,
            toggleMuted, setLooping
          } as any}
        />

        {error && (
          <p className="text-xs text-red-300 opacity-80">音樂載入遇到問題，請再點一次播放鍵或檢查檔案格式。</p>
        )}

        <div className="space-y-3">
          {finalLines.slice(0, revealed).map((l,i)=> (
            <p key={i} className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent
                                   bg-gradient-to-r from-pink-200 via-fuchsia-200 to-yellow-200 drop-shadow">
              {l}
            </p>
          ))}
        </div>
        <div className="pt-6">
          <Countdown targetDate={new Date('2025-12-14T07:00:00-05:00')} />
        </div>
        {/* 三行滾動歌詞：上一行 / 目前行 / 下一行（加上淡入遮罩、等高行、不換行） */}
        <div className="mt-6 relative text-center h-[6.4em] overflow-hidden">
          {/* 上下淡入遮罩 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="space-y-1 transition-opacity duration-200">
            {([lrc[currentLyricIndex - 1], lrc[currentLyricIndex], lrc[currentLyricIndex + 1]]
              .filter(Boolean) as { t:number; text:string }[]).map((line, i) => {
                const active = line === lrc[currentLyricIndex];
                return (
                  <p
                    key={`${line.t}-${i}`}
                    className={`leading-[2.1em] h-[2.1em] flex items-center justify-center px-2 
                                whitespace-nowrap overflow-hidden text-ellipsis transition 
                                ${active
                                  ? 'font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-fuchsia-200 to-yellow-200'
                                  : 'text-pink-100/55'}`}
                    style={{ willChange: 'opacity, transform' }}
                  >
                    {line.text}
                  </p>
                );
              })}
          </div>
        </div>
      </div>

      <Modal open={openHeart} onClose={()=> setOpenHeart(false)} title="Our Heartbeat" maxWidth="max-w-6xl">
        <div className="p-4 modal-heart">
          <HeartScene />
        </div>
      </Modal>
      <audio 
        ref={audioRef} 
        src={`${import.meta.env.BASE_URL}assets/music/song.mp3`}
      />
      <Celebration ref={celebRef} />
    </Section>
  );
}

function Countdown({targetDate}:{targetDate: Date}){
  const [left, setLeft] = useState(targetDate.getTime() - Date.now());
  useEffect(()=>{ const id = setInterval(()=> setLeft(targetDate.getTime()-Date.now()), 1000); return ()=> clearInterval(id); },[targetDate]);
  if(left<0) return <p className="text-emerald-300">今天見面！</p>;
  const s = Math.floor(left/1000);
  const d = Math.floor(s/86400);
  const h = Math.floor((s%86400)/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  return <p className="text-sm opacity-90">距離我們的約會：{d} 天 {h} 時 {m} 分 {sec} 秒</p>;
}