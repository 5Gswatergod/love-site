export type Media = { type: 'image' | 'video'; src: string; alt?: string; caption?: string };
export type TimelineItem = {
  date: string; title: string; text: string; location?: string;
  media?: Media[]; tags?: string[]; mapUrl?: string;
};

// 小工具：把相對於 /src/data 的 assets 路徑轉成可部署的 URL
const asset = (p: string) => new URL(`../assets/${p}`, import.meta.url).href;

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
    date: '2024-02-14',
    title: '情人節的小驚喜',
    text: '是妳，讓平凡都發光。',
    media: [
      { type: 'image', src: asset('img/vday1.webp'), alt: '情人節合照' },
      // 影片也可以：若放在 /src/assets/vid
      { type: 'video', src: asset('vid/vday_clip.mp4'), caption: '小短片' }
    ],
    tags: ['valentine']
  },
];