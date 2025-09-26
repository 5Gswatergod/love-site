export const secretHints = [
  '提示 1：與我們認識的日期相關',
  '提示 2：妳嘟暱稱',
  '提示 3：我們一起去過的某個地方',
  '提示 4：我們一起吃過的東西',
  '提示 5：紀念日',
  '提示 6：英文單字',
];

export const secretCodes = ['2023/10/04', '小朋友', '摩天輪', '90塊', 'milkshake', '2025/08/01', 'GA'];

export function normalizeCode(s: string){
  return s.toLowerCase()
    .replaceAll('/', '')
    .replaceAll('-', '')
    .replaceAll(' ', '')
    .normalize('NFKC')
    .trim();
}