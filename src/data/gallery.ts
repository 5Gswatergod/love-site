export type GalleryGroup = { id: string; title: string; items: { src:string; alt?:string; caption?:string }[] };
export const gallery: GalleryGroup[] = [
  { id: 'firsts', title: '第一次們', items: [
    { src: '/assets/img/first-hi.webp', caption: '第一句嗨' },
    { src: '/assets/img/first-date.webp', caption: '第一次約會' },
  ]},
];