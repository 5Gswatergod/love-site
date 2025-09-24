import { supabase } from '../lib/supabase';

type CommentItem = { id?: string; author: string; text: string; time?: string };

export async function migrateAllLocalCommentsToSupabase() {
  if (!supabase) {
    alert('Supabase 尚未設定（VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY）');
    return;
  }

  const keys = Object.keys(localStorage).filter(k => k.startsWith('comments:'));
  let uploaded = 0, skipped = 0;

  const keyOf = (c: CommentItem) =>
    `${(c.author || '').trim()}|${(c.text || '').trim()}|${c.time || ''}`;

  for (const storageKey of keys) {
    let local: CommentItem[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) local = JSON.parse(raw);
    } catch {}

    if (!local.length) continue;

    const { data: remote, error } = await supabase
      .from('comments')
      .select('author, text, time')
      .eq('storage_key', storageKey);

    if (error) { console.warn('讀取雲端失敗', storageKey, error); continue; }

    const existing = new Set((remote || []).map(keyOf));
    const toInsert = local.filter(c => !existing.has(keyOf(c)));
    if (!toInsert.length) { skipped += local.length; continue; }

    const { error: insErr } = await supabase
      .from('comments')
      .insert(toInsert.map(c => ({
        storage_key: storageKey,
        author: c.author,
        text: c.text,
        time: c.time,
      })));

    if (insErr) { console.warn('上傳失敗', storageKey, insErr); continue; }
    uploaded += toInsert.length;
  }

  alert(`完成：上傳 ${uploaded} 筆，略過（已存在）${skipped} 筆。`);
}