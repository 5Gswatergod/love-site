// src/data/gallery.ts
import { publicUrl } from '../lib/publicUrl';
import { timeline } from './timeline';

export type GalleryItem =
  | { type: 'image'; src: string; alt?: string; caption?: string }
  | { type: 'video'; src: string; poster?: string; caption?: string; loop?: boolean; muted?: boolean };

export type GalleryGroup = { id: string; title: string; items: GalleryItem[] };

const img = (p: string) => publicUrl(`assets/img/${p}`);
const vid = (p: string) => publicUrl(`assets/vid/${p}`);

// ---------- 手動相簿（你原本的內容） ----------
const manualAlbums: GalleryGroup[] = [
  {
    id: 'firsts',
    title: '第一次們',
    items: [
      { type: 'image', src: img('first-hi.webp'),    caption: '加上Line！' },
      {
        type: 'video',
        src: vid('drinking.mp4'),
        poster: img('drinking-poster.webp'),
        caption: '第一次一起喝酒',
        loop: true,
        muted: true
      },
      { type: 'image', src: img('sky-6.webp'),       caption: '第一次一起玩光遇' },
    ]
  },
  {
    id: 'sky',
    title: '光遇',
    items: Array.from({length:18}, (_,i)=>({
      type: 'image' as const,
      src: img(`sky-${i+1}.webp`),
      caption: `光遇 ${i+1}`
    }))
  }
];

// ---------- 從 timeline 自動匯入照片，並去重 ----------
const uniqBySrc = <T extends {src:string}>(arr: T[]) => {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of arr) { if (!seen.has(it.src)) { seen.add(it.src); out.push(it); } }
  return out;
};

// 先收集手動相簿中已存在的 src（避免重複）
const existingSrc = new Set<string>(
  manualAlbums.flatMap(a => a.items).map(it => it.src)
);

// 從 timeline 取出所有圖片，轉成 GalleryItem，並排除已存在的
const timelineImages = timeline.flatMap(t =>
  (t.media ?? [])
    .filter(m => m.type === 'image')
    .map(m => ({ type: 'image' as const, src: m.src, caption: t.title }))
).filter(it => !existingSrc.has(it.src));

const timelineAlbum: GalleryGroup = {
  id: 'timeline',
  title: '時間軸精選（自動）',
  items: uniqBySrc(timelineImages),
};

// 最終輸出：自動相簿 + 手動相簿（順序可依喜好調整）
export const gallery: GalleryGroup[] = [
  timelineAlbum,
  ...manualAlbums,
];