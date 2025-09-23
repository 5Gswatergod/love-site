export type SiteConfig = {
  herName: string;
  theme: 'starry' | 'softPink';
  startDate: string;     // 初遇或在一起日期（ISO）
  nextDate?: string;     // 下一次約會（ISO）
  nav: { label: string; to: string }[];
};

export const siteConfig: SiteConfig = {
  herName: '奶昔',
  theme: 'starry',
  startDate: '2023-10-04',
  nextDate: '2025-12-14',
  nav: [
    { label: 'Home', to: '/' },
    { label: 'Timeline', to: '/timeline' },
    { label: 'Quiz', to: '/quiz' },
    { label: 'Game', to: '/game' },
    { label: 'Secret', to: '/secret' },
    { label: 'Final', to: '/final' },
  ],
};