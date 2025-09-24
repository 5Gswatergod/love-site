import { publicUrl } from "../lib/publicUrl";
const asset = (p: string) => publicUrl(`assets/${p}`);

export type Media = { type: 'image' | 'video'; src: string; alt?: string; caption?: string };
export type TimelineItem = {
  date: string; title: string; text: string; location?: string;
  media?: Media[]; tags?: string[]; mapUrl?: string;
};

export const timeline: TimelineItem[] = [
  {
    date: '2023-10-04',
    title: '第一次說嗨',
    text: '那晚我心臟漏拍了一下。',
    location: 'Taipei',
    media: [
      { type: 'image', src: asset('img/hi.jpg'), alt: '第一句嗨' }
    ],
    tags: ['first'],
    mapUrl: 'https://maps.app.goo.gl/...'
  },
  {
    date: '2025-07-31',
    title: '戀戀不捨的第二次出去玩',
    text: '是妳，讓平凡都發光。',
    media: [
      { type: 'video', src: asset('vid/drinking.mp4'), caption: '現實一起喝酒' }
    ],
    tags: ['valentine']
  },
];