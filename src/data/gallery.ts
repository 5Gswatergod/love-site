// src/data/gallery.ts
import { publicUrl } from '../lib/publicUrl';
export type GalleryGroup = { id: string; title: string; items: { src:string; alt?:string; caption?:string }[] };

const asset = (p: string) => publicUrl(`assets/img/${p}`);

export const gallery: GalleryGroup[] = [
  {
    id: 'firsts',
    title: '第一次們',
    items: [
      { src: asset('first-hi.webp'),    caption: '第一句嗨' },
      { src: asset('first-date.webp'),  caption: '第一次約會' },
      { src: asset('first-sky.webp'),   caption: '第一次一起玩光遇' },
    ]
  },
  {
    id: 'sky',
    title: '光遇',
    items: Array.from({length:18}, (_,i)=>({
      src: asset(`sky-${i+1}.webp`), caption: `光遇 ${i+1}`
    }))
  }
];