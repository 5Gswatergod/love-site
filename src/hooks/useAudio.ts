import { useEffect, useMemo, useRef, useState } from "react";

/**
 * useAudio — lightweight audio hook with format fallbacks (m4a/mp3/ogg)
 * - Accepts a single URL or an ordered list of URLs (first supported wins)
 * - Safe play/pause with Promise handling (iOS/Safari)
 * - Ready/error states, manual volume control (for fades)
 */
export function useAudio(
  src: string | string[],
  opts?: { preload?: 'none' | 'metadata' | 'auto'; loop?: boolean; initialVolume?: number }
){
  const { preload = 'auto', loop = false, initialVolume = 1 } = opts ?? {};

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Normalize to array and pick the first supported source by MIME guess
  const sources = useMemo(() => (Array.isArray(src) ? src : [src]), [src]);

  // Very small helper to guess MIME from extension so canPlayType works better
  const guessType = (url: string) => {
    const lower = url.split('?')[0].toLowerCase();
    if (lower.endsWith('.m4a') || lower.endsWith('.mp4') || lower.endsWith('.aac')) return 'audio/mp4';
    if (lower.endsWith('.mp3')) return 'audio/mpeg';
    if (lower.endsWith('.ogg') || lower.endsWith('.oga')) return 'audio/ogg';
    if (lower.endsWith('.wav')) return 'audio/wav';
    return '';
  };

  // Pick first playable source for current browser
  const pickSource = (a: HTMLAudioElement) => {
    for (const url of sources) {
      const type = guessType(url);
      const can = type ? a.canPlayType(type) : a.canPlayType('');
      if (can !== '') return url; // "probably" or "maybe"
    }
    // If none explicitly supported, fall back to first — browser may still try
    return sources[0];
  };

  useEffect(()=>{
    // Dispose old audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    const a = new Audio();
    a.preload = preload;
    a.loop = loop;
    a.volume = Math.min(1, Math.max(0, initialVolume));

    const chosen = pickSource(a);
    a.src = chosen;

    const onReady = () => { setReady(true); setError(null); };
    const onEnd = () => setIsPlaying(false);
    const onErr = () => setError('audio-error');

    a.addEventListener('canplaythrough', onReady, { once: true });
    a.addEventListener('ended', onEnd);
    a.addEventListener('error', onErr);

    audioRef.current = a;

    return ()=>{
      a.removeEventListener('canplaythrough', onReady);
      a.removeEventListener('ended', onEnd);
      a.removeEventListener('error', onErr);
      a.pause();
      a.src = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources.join('|'), preload, loop, initialVolume]);

  const play = async ()=>{
    const a = audioRef.current; if(!a) return;
    try {
      await a.play();
      setIsPlaying(true);
    } catch (e) {
      // Likely needs a user gesture or the file is blocked
      setIsPlaying(false);
    }
  };

  const pause = ()=>{ const a = audioRef.current; if(!a) return; a.pause(); setIsPlaying(false); };
  const toggle = ()=> isPlaying ? pause() : play();
  const setVolume = (v:number)=>{ const a = audioRef.current; if(!a) return; a.volume = Math.min(1, Math.max(0, v)); };

  /** Try to unlock on first user gesture (iOS/Safari): call inside a click handler once */
  const unlock = async ()=>{
    const a = audioRef.current; if(!a) return;
    try { await a.play(); a.pause(); a.currentTime = 0; } catch { /* ignore */ }
  };

  return { 
    isPlaying, ready, error, play, pause, toggle, setVolume, unlock,
    getTime: () => audioRef.current?.currentTime ?? 0,
    getDuration: () => audioRef.current?.duration ?? 0,
    seek: (sec: number) => {
      const a = audioRef.current; if (!a) return;
      const dur = isFinite(a.duration) ? a.duration : Infinity;
      a.currentTime = Math.max(0, Math.min(sec, dur));
    },
    getVolume: () => audioRef.current?.volume ?? 1,
    setMuted: (m: boolean) => { const a = audioRef.current; if (a) a.muted = m; },
    toggleMuted: () => {
      const a = audioRef.current; if (!a) return;
      a.muted = !a.muted;
    },
    setLooping: (b: boolean) => { const a = audioRef.current; if (a) a.loop = b; },
  };
}