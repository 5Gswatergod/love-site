export type GalleryGroup = { id: string; title: string; items: { src:string; alt?:string; caption?:string }[] };
export const gallery: GalleryGroup[] = [
  { id: 'firsts', title: '第一次們', items: [
    { src: '/assets/img/first-hi.webp', caption: '第一句嗨' },
    { src: '/assets/img/first-date.webp', caption: '第一次約會' },
    { src: '/assets/img/first-sky.webp', caption: '第一次一起玩光遇' },
  ]},
  { id: 'sky', title: '光遇', items: [
    { src: '/assets/img/activity-sky.webp', caption: '光遇' },
  ]},
];