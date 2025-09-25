// src/utils/migrateTimeline.ts
import { supabase } from '../lib/supabase';
import { timeline } from '../data/timeline';

const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET_TIMELINE || 'timeline';

// 小工具：把相對路徑轉為絕對 URL
function toAbsoluteURL(src: string): string {
  try {
    if (/^https?:\/\//i.test(src)) return src;
    // public/ 下的資源，使用 base（for GH Pages）
    const base = import.meta.env.BASE_URL || '/';
    const norm = src.startsWith('/') ? src.slice(1) : src;
    return new URL(base + norm, location.origin).toString();
  } catch {
    return src;
  }
}

// 將各種日期格式整理為 YYYY-MM-DD；無法解析則回傳 null
function normalizeDate(input: unknown): string | null {
  if (!input) return null;
  if (input instanceof Date && !isNaN(+input)) return input.toISOString().slice(0,10);
  let s = String(input).trim();
  if (!s) return null;
  // 常見分隔符歸一化
  s = s.replace(/[./]/g, '-');
  // 僅有 YYYY-MM → 補 01
  const ym = /^\d{4}-\d{1,2}$/;
  if (ym.test(s)) {
    const [y,m] = s.split('-');
    const mm = String(parseInt(m,10)).padStart(2,'0');
    return `${y}-${mm}-01`;
  }
  // YYYY-M-D → 補零
  const ymd = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  const m1 = s.match(ymd);
  if (m1) {
    const y = m1[1];
    const mm = String(parseInt(m1[2],10)).padStart(2,'0');
    const dd = String(parseInt(m1[3],10)).padStart(2,'0');
    return `${y}-${mm}-${dd}`;
  }
  // 最後嘗試 Date.parse
  const t = Date.parse(s);
  if (!isNaN(t)) return new Date(t).toISOString().slice(0,10);
  return null;
}

// 下載並回傳 Blob（圖片/影片）
async function fetchBlob(u: string): Promise<Blob> {
  const res = await fetch(u, { mode: 'cors' });
  if (!res.ok) throw new Error(`fetch failed: ${u} ${res.status}`);
  return await res.blob();
}

function sleep(ms: number){ return new Promise(r=>setTimeout(r, ms)); }

export async function runBackup(){
  if (!supabase) throw new Error('Supabase 尚未設定（lib/supabase）');

  console.log('%c[TL-Backup] start', 'color:#9cf');
  let inserted = 0, skipped = 0, failed = 0;

  // 先抓雲端既有資料，做跳過判斷（以 title|date|media_url 為鍵）
  const { data: existing, error: selErr } = await supabase
    .from('timeline_events')
    .select('title, date, media_url');
  if (selErr) throw selErr;
  const seen = new Set<string>(
    (existing ?? []).map(r => `${r.title}|${r.date}|${r.media_url ?? ''}`)
  );

  for (const ev of timeline) {
    const mediaList = Array.isArray(ev.media) && ev.media.length > 0
      ? ev.media
      : [{ type: 'image', src: '' }]; // 沒媒體也可寫一筆（media_url 空）

    for (const m of mediaList) {
      try {
        let media_url: string | null = null;
        let media_type: 'image' | 'video' | null = null;

        if (m && m.src) {
          const abs = toAbsoluteURL(m.src);
          media_type = /\.(mp4|mov|webm|m4v)(\?|$)/i.test(abs) ? 'video' : 'image';
          media_url = abs;
        }

        // 正規化日期；沒有日期或無法解析就跳過並提示
        const normDate = normalizeDate((ev as any).date);
        if (!normDate) {
          console.warn('[TL-Backup] skip: invalid date', ev.title, ev.date);
          skipped++; // 視為跳過
          continue;
        }

        const key = `${ev.title}|${normDate}|${media_url ?? ''}`;
        if (seen.has(key)) { skipped++; continue; }

        const payload = {
          title: ev.title || '',
          description: (ev as any).text || (ev as any).description || null,
          date: normDate,
          media_url,
          media_type,
        };

        // 嘗試 upsert（若你建立了 unique index）
        const { error: insErr } = await supabase
          .from('timeline_events')
          .insert(payload);

        if (insErr) throw insErr;

        seen.add(key);
        inserted++;

        // 限速，避免觸發頻率限制
        await sleep(150);
      } catch (e: any) {
        failed++;
        console.warn('[TL-Backup] fail', e?.message || e);
        // 碰到大檔可適度延長
        await sleep(300);
      }
    }
  }

  console.log(`%c[TL-Backup] done inserted=${inserted} skipped=${skipped} failed=${failed}`, 'color:#9f9');
  alert(`Timeline 備份完成：新增 ${inserted}、跳過 ${skipped}、失敗 ${failed}`);
}

// 讓你能從 Console 直接呼叫
// 在瀏覽器 console 輸入：window.migrateTimeline()
declare global { interface Window { migrateTimeline?: ()=>Promise<void> } }
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.migrateTimeline = runBackup;
}