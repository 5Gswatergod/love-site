export const secretHints = [
  '提示 1：與我們認識的日期相關',
  '提示 2：妳嘟暱稱',
  '提示 3：我們一起去過的某個地方',
];

export const secretCodes = ['2023/10/04', '小朋友', '摩天輪'];

export function normalizeCode(s: string){
  return s.toLowerCase()
    .replaceAll('/', '')
    .replaceAll('-', '')
    .replaceAll(' ', '')
    .normalize('NFKC')
    .trim();
}