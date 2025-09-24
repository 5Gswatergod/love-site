import { useEffect, useRef, useState } from 'react';

type PlayerAPI = {
  ready: boolean;
  isPlaying: boolean;
  play: () => Promise<void> | void;
  pause: () => void;
  toggle: () => Promise<void> | void;
  getTime: () => number;
  getDuration: () => number;
  seek: (t: number) => void;
  getVolume: () => number;
  setVolume: (v: number) => void;
  toggleMuted: () => void;
  setLooping: (b: boolean) => void;
};

function fmt(sec:number){
  if(!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60);
  return `${m}:${String(s).padStart(2,'0')}`;
}

export default function PlayerBar({ api }: { api: PlayerAPI }){
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState( (typeof api.getVolume==='function' ? api.getVolume() : 1) );
  const [loop, setLoop] = useState(false);
  const raf = useRef(0);

  // drive progress UI
  useEffect(()=>{
    const tick = () => {
      setCur(api.getTime());
      setDur(api.getDuration());
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return ()=> cancelAnimationFrame(raf.current);
  }, [api]);

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const next = parseFloat(e.target.value);
    api.seek(next);
    setCur(next);
  };

  const onVol = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const v = parseFloat(e.target.value);
    setVol(v);
    api.setVolume(v);
  };

  return (
    <div className="glow-card mt-4 rounded-2xl bg-white/5 px-4 py-3 flex flex-col gap-3">
      {/* controls row */}
      <div className="flex items-center gap-2">
        <button
          onClick={()=> api.toggle()}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20"
          disabled={!api.ready}
        >
          {api.isPlaying ? '⏸︎ 暫停' : '▶︎ 播放'}
        </button>

        <button
          onClick={() => { api.toggleMuted?.(); }}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20"
        >
          🔈 靜音
        </button>

        <button
          onClick={() => { const next = !loop; setLoop(next); api.setLooping(next); }}
          className={`px-3 py-1.5 rounded-full ${loop ? 'bg-pink-400/30' : 'bg-white/10 hover:bg-white/20'}`}
        >
          🔁 循環{loop ? '：開' : '：關'}
        </button>

        {/* volume */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs opacity-70 w-8 text-right">{Math.round(vol*100)}%</span>
          <input
            type="range" min={0} max={1} step={0.01} value={vol}
            onChange={onVol}
            className="w-36 accent-pink-300"
          />
        </div>
      </div>

      {/* progress row */}
      <div className="flex items-center gap-3">
        <span className="text-xs opacity-80 w-10 tabular-nums text-right">{fmt(cur)}</span>
        <input
          type="range"
          min={0}
          max={isFinite(dur) && dur>0 ? dur : Math.max(cur+1, 1)}
          step={0.05}
          value={Math.min(cur, dur || cur)}
          onChange={onSeek}
          className="flex-1 accent-fuchsia-300"
        />
        <span className="text-xs opacity-80 w-10 tabular-nums">{fmt(dur)}</span>
      </div>
    </div>
  );
}