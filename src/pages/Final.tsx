import Section from '../components/common/Section';
import { finalLines } from '../data/messages';
import { audioManifest } from '../data/audioManifest';
import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../hooks/useAudio';

import Modal from '../components/common/Modal';
import HeartScene from '../components/effects/HeartScene';

export default function Final(){
  const [revealed, setRevealed] = useState(0);
  const { ready, isPlaying, toggle } = useAudio(audioManifest.final);
  const intervalRef = useRef<number | null>(null);
  const [openHeart, setOpenHeart] = useState(false);

  useEffect(()=>{
    intervalRef.current = window.setInterval(
      () => setRevealed(r=> Math.min(finalLines.length, r+1)),
      2200
    );
    return ()=>{ if(intervalRef.current) window.clearInterval(intervalRef.current); };
  },[]);

  return (
    <Section title="最終告白" subtitle="Final">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <button onClick={toggle} className="px-4 py-2 rounded-full bg-indigo-500/40 hover:bg-indigo-500/60">
            {isPlaying? '⏸ 暫停音樂' : (ready? '▶ 播放音樂' : '祝你愛我愛到天荒地老')}
          </button>
          <button onClick={()=> setOpenHeart(true)} className="px-4 py-2 rounded-full bg-fuchsia-500/30 hover:bg-fuchsia-500/50">
            🔍 放大查看愛心
          </button>
        </div>

        <div className="space-y-3">
          {finalLines.slice(0, revealed).map((l,i)=> (
            <p key={i} className="text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-sky-200 to-fuchsia-200">
              {l}
            </p>
          ))}
        </div>

        <div className="pt-6">
          <Countdown targetDate={new Date('2025-12-14T19:00:00-04:00')} />
        </div>

        {/* 小尺寸預覽（可選）：在頁面上也顯示縮小心形 */}
        <div className="mt-6 opacity-70">
          <div className="text-xs mb-1">預覽</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mx-auto max-w-xl">
              <HeartScene />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox/Modal 內放大型 HeartScene */}
      <Modal open={openHeart} onClose={()=> setOpenHeart(false)} title="Our Heartbeat" maxWidth="max-w-6xl">
        <div className="p-4">
          <HeartScene />
        </div>
      </Modal>
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