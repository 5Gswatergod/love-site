export type Media = { type: 'image' | 'video'; src: string; alt?: string; caption?: string };
export type TimelineItem = {
  date: string; title: string; text: string; location?: string;
  media?: Media[]; tags?: string[]; mapUrl?: string;
};

export const timeline: TimelineItem[] = [
  {
    date: '2023-10-04', title: '第一次說嗨',
    text: '那晚我心臟漏拍了一下。', location: 'Taipei',
    media: [{ type: 'image', src: '/assets/img/hi.jpg', alt: '第一句嗨' }],
    tags: ['first'], mapUrl: 'https://maps.app.goo.gl/...'
  },
  {
    date: '2024-02-14', title: '情人節的小驚喜',
    text: '是妳，讓平凡都發光。',
    media: [
      { type: 'image', src: '/assets/img/vday1.webp', alt: '情人節合照' },
      { type: 'video', src: '/assets/vid/vday_clip.mp4', caption: '小短片' }
    ],
    tags: ['valentine']
  },
];