import { useEffect, useRef, useState } from 'react';

export function useAudio(src: string){
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = new Audio(src);
    a.preload = 'auto';
    audioRef.current = a;
    const onCanPlay = () => setReady(true);
    a.addEventListener('canplaythrough', onCanPlay);
    return () => { a.pause(); a.removeEventListener('canplaythrough', onCanPlay); };
  }, [src]);

  const play = () => { audioRef.current?.play(); setPlaying(true); };
  const pause = () => { audioRef.current?.pause(); setPlaying(false); };
  const toggle = () => isPlaying ? pause() : play();

  return { audioRef, isPlaying, ready, play, pause, toggle };
}