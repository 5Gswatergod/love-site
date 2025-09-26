export type SiteConfig = {
  herName: string;
  theme: 'starry' | 'softPink';
  startDate: string;     // 初遇或在一起日期（ISO）
  nextDate?: string;     // 下一次約會（ISO）
  nav: { label: string; to: string }[];
};

export const siteConfig: SiteConfig = {
  herName: '可愛嘟小朋友',
  theme: 'starry',
  startDate: '2023-10-04',
  nextDate: '2025-12-14',
  nav: [
    { label: '主頁', to: '/' },
    { label: '時間線', to: '/timeline' },
    { label: '相簿', to: '/gallery' },
    { label: '小遊戲', to: '/game' },
    { label: '小測驗', to: '/quiz' },
    { label: '密語', to: '/secret' },
    { label: '最終告白', to: '/final' },
  ],
};