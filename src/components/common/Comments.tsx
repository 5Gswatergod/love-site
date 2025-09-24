import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';

type CommentItem = { id:string; author:string; text:string; time?:string; likes?: number };

export default function Comments({
  storageKey,
  initial,
}:{
  storageKey: string;
  initial: CommentItem[];
}){
  const [items, setItems] = useState<CommentItem[]>(initial);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | { type:'ok'|'local'|'error'; msg:string }>(null);

  // 編輯狀態
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // 本機「已按讚」集合（避免同裝置重複點讚；也支援收回）
  const likedKey = `likes:${storageKey}`;
  const [likedSet, setLikedSet] = useState<Set<string>>(new Set());
  useEffect(()=>{
    try{
      const raw = localStorage.getItem(likedKey);
      if(raw) setLikedSet(new Set(JSON.parse(raw)));
    }catch{}
  }, [likedKey]);
  useEffect(()=>{
    try{ localStorage.setItem(likedKey, JSON.stringify(Array.from(likedSet))); }catch{}
  }, [likedSet, likedKey]);

  const normKey = (c:CommentItem)=> `${c.author}|${c.text}|${c.time ?? ''}`;

  const isUUID = (s?: string) => !!s && /^[0-9a-f-]{36}$/i.test(s);

  // 載入：localStorage →（若啟用）Supabase 合併去重
  useEffect(()=>{
    (async ()=>{
      let merged: CommentItem[] = initial;

      // local
      try{
        const raw = localStorage.getItem(storageKey);
        if(raw){
          const saved = JSON.parse(raw) as CommentItem[];
          const key = (c:CommentItem)=> `${c.id || ''}|${c.author}|${c.text}`;
          const map = new Map<string, CommentItem>();
          [...initial, ...saved].forEach(c=> map.set(key(c), c));
          merged = Array.from(map.values());
        }
      }catch{}

      // supabase
      if (supabase) {
        const { data, error } = await supabase
          .from('comments')
          .select('id, author, text, time, likes, storage_key, created_at')
          .eq('storage_key', storageKey)
          .order('created_at', { ascending: false });
        if (!error && data) {
          const key = (c:CommentItem)=> `${c.id || ''}|${c.author}|${c.text}`;
          const map = new Map<string, CommentItem>();
          [...merged, ...data.map(d=>({ id: d.id, author:d.author, text:d.text, time:d.time, likes: d.likes ?? 0 }))].forEach(c=> map.set(key(c), c));
          merged = Array.from(map.values());
        }
      }

      merged = merged.map(c => ({ ...c, likes: typeof c.likes === 'number' ? c.likes : 0 }));
      setItems(merged);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // 寫回 localStorage（本機備份）
  useEffect(()=>{
    try{ localStorage.setItem(storageKey, JSON.stringify(items)); }catch{}
  },[items, storageKey]);

  const btnText = useMemo(()=> loading ? (
    <span className="inline-flex items-center gap-2"><Spinner/> 傳送中…</span>
  ) : '送出', [loading]);

  // 新增留言（回填雲端 id）
  const add = async ()=>{
    const trimmed = text.trim();
    if(!trimmed || loading) return;

    setLoading(true); setStatus(null);
    const c: CommentItem = {
      id: Math.random().toString(36).slice(2),
      author: name?.trim() || '你',
      text: trimmed,
      time: new Date().toISOString().slice(0,10),
      likes: 0,
    };

    // 本機樂觀更新
    setItems(prev => [c, ...prev]);
    setText('');

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('comments')
          .insert({
            storage_key: storageKey, author: c.author, text: c.text, time: c.time, likes: c.likes ?? 0,
          })
          .select('id')
          .single();
        if (error) throw error;

        // 回填雲端 id（用 author|text|time 對應剛插入的那筆）
        const k = `${c.author}|${c.text}|${c.time ?? ''}`;
        setItems(prev => prev.map(x => (`${x.author}|${x.text}|${x.time ?? ''}` === k) ? { ...x, id: data!.id } : x));
        setStatus({ type:'ok', msg:'已同步到雲端 ✅' });
      } else {
        setStatus({ type:'local', msg:'已儲存（本機）' });
      }
    } catch {
      setStatus({ type:'error', msg:'雲端同步失敗（已先存本機）' });
    } finally {
      setLoading(false);
      setTimeout(()=> setStatus(null), 2500);
    }
  };

  // 刪除留言（優先用 id；fallback 欄位比對，處理 null time）
  const remove = async (c: CommentItem)=>{
    const k = normKey(c);
    // 本機先刪
    setItems(prev => prev.filter(x => normKey(x) !== k));
    setLikedSet(prev => { const next = new Set(prev); next.delete(k); return next; });

    if (!supabase) return;

    if (isUUID(c.id)) {
      await supabase.from('comments').delete().eq('id', c.id);
    } else {
      let q = supabase.from('comments')
        .delete()
        .eq('storage_key', storageKey)
        .eq('author', c.author)
        .eq('text', c.text);
      q = (c.time == null) ? q.is('time', null) : q.eq('time', c.time);
      await q;
    }
  };

  // 讚：可切換（收回）
  const toggleLike = async (c: CommentItem)=>{
    const k = normKey(c);
    const already = likedSet.has(k);

    // 本機先改
    setItems(prev => prev.map(x => normKey(x) === k ? { ...x, likes: Math.max(0, (x.likes ?? 0) + (already ? -1 : +1)) } : x));
    setLikedSet(prev => {
      const next = new Set(prev);
      if (already) next.delete(k); else next.add(k);
      return next;
    });

    if (supabase) {
      const fn = already ? 'dec_like' : 'inc_like';
      let ok = false;
      try {
        const { error } = await supabase.rpc(fn, { p_storage: storageKey, p_author: c.author, p_text: c.text, p_time: c.time ?? null });
        ok = !error;
      } catch { ok = false; }

      if (!ok) {
        const target = items.find(x => normKey(x) === k);
        const nextLikes = Math.max(0, (target?.likes ?? 0) + (already ? -1 : +1));
        if (isUUID(c.id)) {
          await supabase.from('comments').update({ likes: nextLikes }).eq('id', c.id);
        } else {
          let q = supabase.from('comments').update({ likes: nextLikes })
            .eq('storage_key', storageKey)
            .eq('author', c.author)
            .eq('text', c.text);
          q = (c.time == null) ? q.is('time', null) : q.eq('time', c.time);
          await q;
        }
      }
    }
  };

  // 開始編輯
  const startEdit = (c: CommentItem)=>{
    setEditingKey(normKey(c));
    setEditText(c.text);
  };
  const cancelEdit = ()=> {
    setEditingKey(null);
    setEditText('');
  };
  const saveEdit = async (c: CommentItem)=>{
    const k = normKey(c);
    const newText = editText.trim();
    if (!newText || newText === c.text) { cancelEdit(); return; }

    // 本機更新
    setItems(prev => prev.map(x => normKey(x) === k ? { ...x, text: newText } : x));
    setEditingKey(null); setEditText('');

    if (!supabase) return;

    if (isUUID(c.id)) {
      await supabase.from('comments').update({ text: newText }).eq('id', c.id);
    } else {
      let q = supabase.from('comments')
        .update({ text: newText })
        .eq('storage_key', storageKey)
        .eq('author', c.author)
        .eq('text', c.text);
      q = (c.time == null) ? q.is('time', null) : q.eq('time', c.time);
      await q;
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
      {/* input row */}
      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={e=> setName(e.target.value)}
          placeholder="名字（可留空）"
          className="min-w-0 flex-none w-28 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
        />
        <input
          value={text}
          onChange={e=> setText(e.target.value)}
          placeholder="留下你的想法…"
          className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
        />
        <button
          onClick={add}
          disabled={loading || !text.trim()}
          className={`flex-none px-3 py-2 rounded-lg border border-white/10 transition
            ${loading ? 'bg-white/10 opacity-80 cursor-not-allowed' : 'bg-fuchsia-500/30 hover:bg-fuchsia-500/40'}`}
        >{btnText}</button>
      </div>

      {/* status row */}
      <div className="mt-2 min-h-[1.25rem]" aria-live="polite">
        {status && (
          <span
            className={
              status.type === 'ok'
                ? 'text-xs text-emerald-300'
                : status.type === 'local'
                ? 'text-xs text-indigo-300'
                : 'text-xs text-rose-300'
            }
          >
            {status.msg}
          </span>
        )}
      </div>

      {/* list */}
      <div className="mt-1 space-y-2">
        {items.length === 0 && (
          <p className="text-xs opacity-70">還沒有人留言，搶頭香吧 ✨</p>
        )}
        {items.map(c => {
          const k = normKey(c);
          const liked = likedSet.has(k);
          const isEditing = editingKey === k;

          return (
            <div key={c.id} className="text-sm flex items-start gap-3">
              <div className="flex-1">
                <span className="font-semibold text-pink-200 mr-2">{c.author}</span>
                {isEditing ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={e=> setEditText(e.target.value)}
                      className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
                      rows={2}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={()=> saveEdit(c)}
                        className="px-3 py-1.5 rounded-lg border border-white/10 bg-emerald-500/30 hover:bg-emerald-500/40"
                      >儲存</button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10"
                      >取消</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="opacity-90">{c.text}</span>
                    {c.time && <span className="ml-2 text-xs opacity-50">{c.time}</span>}
                  </>
                )}
              </div>

              {!isEditing && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={()=> toggleLike(c)}
                    className={`px-2 py-1 rounded-lg border border-white/10 hover:bg-white/10 transition ${liked ? 'text-rose-300' : ''}`}
                    aria-pressed={liked}
                    title={liked ? '收回讚' : '按讚'}
                  >
                    <span className="inline-flex items-center gap-1">
                      <HeartIcon filled={liked} />
                      <span className="text-xs">{c.likes ?? 0}</span>
                    </span>
                  </button>
                  <button
                    onClick={()=> startEdit(c)}
                    className="px-2 py-1 rounded-lg border border-white/10 hover:bg-white/10 transition text-slate-200/80"
                    title="編輯"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={()=> { if(confirm('刪除這則留言？')) remove(c); }}
                    className="px-2 py-1 rounded-lg border border-white/10 hover:bg-white/10 transition text-slate-200/80"
                    title="刪除"
                  >
                    <TrashIcon />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Spinner(){
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 animate-spin" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity=".25"/>
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  );
}
function HeartIcon({ filled }:{ filled?: boolean }){
  return (
    <svg viewBox="0 0 24 24" className={`w-4 h-4 ${filled ? '' : 'opacity-80'}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>
    </svg>
  );
}
function EditIcon(){
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}
function TrashIcon(){
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
    </svg>
  );
}