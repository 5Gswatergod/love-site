export const secretHints = [
  '提示 1：與我們第一次說嗨的日期相關',
  '提示 2：她的暱稱英文',
];

export const secretCodes = ['2023/10/04', 'milkshake'];

export function normalizeCode(s: string){
  return s.toLowerCase()
    .replaceAll('/', '')
    .replaceAll('-', '')
    .replaceAll(' ', '')
    .normalize('NFKC')
    .trim();
}