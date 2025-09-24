import Section from '../components/common/Section';
import { finalLines } from '../data/messages';
import { audioManifest } from '../data/audioManifest';
import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../hooks/useAudio';

import Modal from '../components/common/Modal';
import HeartScene from '../components/effects/HeartScene';
import PoyoButton from '../components/common/PoyoButton';
import { gsap } from 'gsap';


export default function Final(){
  const [revealed, setRevealed] = useState(0);
  const { ready, isPlaying, play, pause, toggle, setVolume, unlock } =
    useAudio(audioManifest.final, { preload: 'auto', loop: false, initialVolume: 1 });
  const intervalRef = useRef<number | null>(null);
  const [openHeart, setOpenHeart] = useState(false);

  const prevWasPlaying = useRef(false);
  
  useEffect(()=>{
    intervalRef.current = window.setInterval(
      () => setRevealed(r=> Math.min(finalLines.length, r+1)),
      2200
    );
    return ()=>{ if(intervalRef.current) window.clearInterval(intervalRef.current); };
  },[]);

  // 開/關 Modal 控制音樂 + 動畫
  useEffect(()=>{
    if(openHeart){
      prevWasPlaying.current = isPlaying;
      if(isPlaying){
        const vol = { v: 1 };
        gsap.to(vol, {
          duration: 0.3,
          v: 0,
          onUpdate: () => setVolume(vol.v),
          onComplete: () => { pause(); setVolume(1); }
        });
      }
      gsap.fromTo('.modal-heart',
        { scale:0.8, opacity:0 },
        { scale:1, opacity:1, duration:0.5, ease:'back.out(1.7)' }
      );
    }else{
      if(prevWasPlaying.current){
        play();
        const vol = { v: 0 };
        setVolume(0);
        gsap.to(vol, {
          duration: 0.3,
          v: 1,
          onUpdate: () => setVolume(vol.v),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openHeart]);

  return (
    <Section title="最終告白" subtitle="Final">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <PoyoButton onClick={() => { unlock(); toggle();}}>
            {isPlaying ? '⏸ 暫停音樂' : (ready ? '▶ 播放音樂' : '祝你愛我愛到天荒地老')}
          </PoyoButton>
          <PoyoButton onClick={()=> setOpenHeart(true)}>
            💗 放大查看愛心
          </PoyoButton>
        </div>

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
      </div>

      <Modal open={openHeart} onClose={()=> setOpenHeart(false)} title="Our Heartbeat" maxWidth="max-w-6xl">
        <div className="p-4 modal-heart">
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