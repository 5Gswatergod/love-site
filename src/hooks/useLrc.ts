import { useEffect, useState } from 'react';

export type LrcLine = { t: number; text: string; words?: { t:number; w:string }[] };

const toSec = (s: string) => {
  const [mm, rest] = s.split(':');
  return parseInt(mm,10) * 60 + parseFloat(rest);
};

export function parseLrc(raw: string): LrcLine[] {
  const out: LrcLine[] = [];
  for (const row of raw.split(/\r?\n/)) {
    const tags = [...row.matchAll(/\[(\d{1,2}:\d{2}(?:\.\d{1,3})?)\]/g)];
    if (!tags.length) continue;
    const text = row.replace(/\[[^\]]+\]/g, '').trim();
    const wordsM = [...text.matchAll(/<(\d{1,2}:\d{2}(?:\.\d{1,3})?)>([^<]+)/g)];
    const words = wordsM.length ? wordsM.map(m => ({ t: toSec(m[1]), w: m[2] })) : undefined;
    const clean = wordsM.length ? text.replace(/<\d{1,2}:\d{2}(?:\.\d{1,3})?>/g, '') : text;
    for (const tag of tags) out.push({ t: toSec(tag[1]), text: clean, words });
  }
  return out.sort((a,b)=>a.t-b.t);
}

export function useLrc(url: string){
  const [lines, setLines] = useState<LrcLine[]>([]);
  useEffect(()=>{
    let alive = true;
    fetch(url).then(r=>r.text()).then(txt=>{ if(alive) setLines(parseLrc(txt)); });
    return ()=>{ alive = false; };
  },[url]);
  return lines;
}