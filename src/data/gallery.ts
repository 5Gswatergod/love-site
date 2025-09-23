export type GalleryGroup = { id: string; title: string; items: { src:string; alt?:string; caption?:string }[] };
export const gallery: GalleryGroup[] = [
  { id: 'firsts', title: '第一次們', items: [
    { src: '/assets/img/first-hi.webp', caption: '第一句嗨' },
    { src: '/assets/img/first-date.webp', caption: '十年之約' },
    { src: '/assets/img/first-date.webp', caption: '第一次約會' },
    { src: '/assets/img/first-date.webp', caption: '我陪妳喝' },
    { src: '/assets/img/first-date.webp', caption: '一起看電影' },
    { src: '/assets/img/first-date.webp', caption: '第一次一起玩光遇' },
  ]},
];