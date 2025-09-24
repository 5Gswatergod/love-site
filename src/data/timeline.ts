import { publicUrl } from "../lib/publicUrl";
const asset = (p: string) => publicUrl(`assets/${p}`);

export type Media = {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  caption?: string;
  // video-only (optional)
  poster?: string;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
};
export type Comment = {
  id: string;
  author: string;
  text: string;
  time?: string; // ISO string or display text
};

export type TimelineItem = {
  date: string; title: string; text: string; location?: string;
  media?: Media[]; tags?: string[]; mapUrl?: string;
  comments?: Comment[];
};

export const timeline: TimelineItem[] = [
  {
    date: '2023-10-04',
    title: '第一次說嗨',
    text: '那晚我心臟漏拍了一下',
    location: '台北-高雄',
    media: [
      { type: 'image', src: asset('img/first-hi.webp'), alt: '加上Line！！！' }
    ],
    tags: ['first'],
  },
  {
    date: '2023-12-25',
    title: '奔現了！',
    text: '害羞、靦腆、緊張、期待',
    location: '高雄 · 夢時代',
    media: [
      // 照片（兩張）
      { type: 'image', src: asset('img/firsts-date-1.webp'), alt: '到高雄啦～' },
      { type: 'image', src: asset('img/firsts-date-2.webp'), alt: '我們一起逛首飾' },
      { type: 'image', src: asset('img/firsts-date-3.webp'), alt: '單手開車！帥吧～嘿嘿' },
    ],
    tags: ['date','first'],
  },
  {
    date: '2025-07-17',
    title: '義大遊樂園之旅',
    text: '尖叫、笑聲、和妳的手',
    location: '高雄 · 義大遊樂世界',
    media: [
      // 照片（兩張）
      { type: 'image', src: asset('img/yida-1.webp'), alt: '摩天輪·合照' },
      { type: 'image', src: asset('img/yida-2.webp'), alt: '摩天輪前的微笑' },
      // 影片（兩部）
      {
        type: 'video',
        src: asset('vid/yida-1.mp4'),
        caption: '在鬼船排隊的妳，真的好可愛',
        poster: asset('img/yida-1-poster.png'),
        controls: true,
        muted: true,
        loop: true,
        playsInline: true,
        autoPlay: false,
      },
      {
        type: 'video',
        src: asset('vid/yida-2.mp4'),
        caption: '看我們玩懸浮球',
        poster: asset('img/yida-2-poster.png'),
        controls: true,
        muted: true,
        loop: true,
        playsInline: true,
        autoPlay: false,
      },
      {
        type: 'video',
        src: asset('vid/yida-3.mp4'),
        caption: '續攤',
        poster: asset('img/yida-3-poster.png'),
        controls: true,
        muted: true,
        loop: true,
        playsInline: true,
        autoPlay: false,
      }
    ],
    tags: ['trip','fun'],
  },
  {
    date: '2025-07-18',
    title: '吃冰淇淋！',
    text: '炎熱的夏天，甜甜的冰淇淋',
    location: '高雄 · 冰淇淋',
    media: [
      { type: 'video', 
        src: asset('img/ice-cream.mp4'),
        caption: '吃冰淇淋的妳，好可愛！',
        poster: asset('img/ice-cream-poster.png'),
        controls: true,
        muted: true,
        loop: true,
        playsInline: true,
        autoPlay: false,
        alt: '冰淇淋',
      },
    ],
    tags: ['sweet','summer'],
  },
  {
    date: '2025-07-22',
    title: '第一次收到女友小卡',
    text: '好開心！',
    location: '台北',
    media: [
      { type: 'image', src: asset('img/card-shark.webp'), alt: '女友小卡' },
    ],
    tags: ['first','card'],
  },
  {
    date: '2025-07-31',
    title: '戀戀不捨的第二次出去玩',
    text: '是妳，讓平凡都發光',
    location: '高雄',
    media: [
      {
        type: 'video',
        src: asset('vid/drinking.mp4'),
        caption: '現實一起喝酒',
        poster: asset('img/drinking-poster.webp'),
        controls: true,
        muted: true,
        loop: true,
        playsInline: true,
        autoPlay: false,
      }
    ],
    tags: ['first'],
  },
  {
    date: '2025-08-22',
    title: '巧克力補給日',
    text: '下次買多點 嘿嘿',
    location: '甜點補給站',
    media: [
      { type: 'image', src: asset('img/chocolate.webp'), alt: '巧克力與小點心山' },
    ],
    tags: ['snack','sweet'],
  },
  {
    date: '',
    title: '一起看電影',
    text: '又一天、第三天、第四天… 陪你把片尾曲也聽完',
    location: '我們的小劇院',
    media: [
      { type: 'image', src: asset('img/movie-1.webp'), alt: 'Movie 1' },
      { type: 'image', src: asset('img/movie-2.webp'), alt: 'Movie 2' },
      { type: 'image', src: asset('img/movie-3.webp'), alt: 'Movie 3' },
      { type: 'image', src: asset('img/movie-4.webp'), alt: 'Movie 4' },
      { type: 'image', src: asset('img/movie-5.webp'), alt: 'Movie 5' },
      { type: 'image', src: asset('img/movie-6.webp'), alt: 'Movie 6' },
    ],
    tags: ['movie','cozy'],
  },
];