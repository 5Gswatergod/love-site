import { publicUrl } from '../lib/publicUrl';

export const audioManifest = {
  // m4a + mp3 fallback
  final: [
    publicUrl('assets/music/song.m4a'),
    publicUrl('assets/music/song.mp3'),
  ],
  click: publicUrl('assets/sfx/click.mp3'),
  pop:   publicUrl('assets/sfx/pop.mp3'),
};