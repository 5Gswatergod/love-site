// src/hooks/useMediaSession.ts
import { useEffect } from 'react';

type Opt = {
  audio: HTMLAudioElement | null | undefined;
  title?: string;
  artist?: string;
  album?: string;
  artwork?: string; // 120x120+, 可放 /assets/img/cover.png
};

export function useMediaSession({ audio, title, artist, album, artwork }: Opt) {
  useEffect(() => {
    if (!audio || !('mediaSession' in navigator)) return;

    // 基本中繼資料
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title ?? document.title,
      artist: artist ?? '',
      album: album ?? '',
      artwork: artwork ? [{ src: artwork, sizes: '512x512', type: 'image/png' }] : [],
    });

    // 動作控制
    navigator.mediaSession.setActionHandler('play',  () => audio.play());
    navigator.mediaSession.setActionHandler('pause', () => audio.pause());
    navigator.mediaSession.setActionHandler('stop',  () => { audio.pause(); audio.currentTime = 0; });

    navigator.mediaSession.setActionHandler('seekbackward', (e:any) => {
      const d = e.seekOffset ?? 10; audio.currentTime = Math.max(0, audio.currentTime - d);
    });
    navigator.mediaSession.setActionHandler('seekforward', (e:any) => {
      const d = e.seekOffset ?? 10; audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + d);
    });
    navigator.mediaSession.setActionHandler('seekto', (e:any) => {
      if (typeof e.seekTime === 'number') audio.currentTime = e.seekTime;
    });

    // 依播放狀態更新
    const updateState = () => {
      try {
        // @ts-ignore
        navigator.mediaSession.playbackState = audio.paused ? 'paused' : 'playing';
        navigator.mediaSession.setPositionState?.({
          duration: isFinite(audio.duration) ? audio.duration : 0,
          playbackRate: audio.playbackRate,
          position: audio.currentTime,
        });
      } catch {}
    };

    audio.addEventListener('play', updateState);
    audio.addEventListener('pause', updateState);
    audio.addEventListener('timeupdate', updateState);
    updateState();

    return () => {
      audio.removeEventListener('play', updateState);
      audio.removeEventListener('pause', updateState);
      audio.removeEventListener('timeupdate', updateState);
    };
  }, [audio, title, artist, album, artwork]);
}