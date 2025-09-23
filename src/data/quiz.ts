export type QuizItem = {
  id: string;
  question: string;
  options: string[];
  answerIndex?: number;       // 單選
  correctIndices?: number[];  // 多選
  score?: number;             // 此題得分（預設 1）
  explanation?: string;
  unlockFragment?: string;    // 答對就獲得的碎片 ID
};

export const quiz: QuizItem[] = [
  { id:'q1', question:'我們第一次約會吃什麼？', options:['拉麵','火鍋','壽司','牛排'], answerIndex:1, explanation:'聖誕節！', unlockFragment:'heart-1' },
  { id:'q2', question:'選出妳最常點的一款飲料', options:['美式','抹茶','奶茶','可爾必思'], answerIndex:2, score:2, unlockFragment:'heart-2' },
  { id:'q3', question:'我們的暗號？', options:['30塊','90塊','100塊','1314塊'], answerIndex:1, unlockFragment:'heart-3' },
];