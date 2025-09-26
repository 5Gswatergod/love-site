import { useState } from 'react';
import { supabase } from '../../lib/supabase';

type Props = {
  onCreated?: () => void; // 新增成功後回呼（用來刷新列表）
};

export default function TimelineUploader({ onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<string>('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = !!title.trim() && !!date && !loading;

  const submit = async () => {
    setErr(null);
    if (!canSubmit) return;

    try {
      setLoading(true);

      let media_url: string | null = null;
      let media_type: 'image' | 'video' | null = null;

      // 上傳檔案（可選）
      if (file && supabase) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
        media_type = file.type.startsWith('video') ? 'video' : 'image';
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from('timeline').upload(path, file, {
          cacheControl: '31536000',
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('timeline').getPublicUrl(path);
        media_url = data.publicUrl;
      }

      // 寫表
      if (!supabase) {
        setErr('Supabase 尚未設定，請先設定環境變數。');
        setLoading(false);
        return;
      }
      const { error: insErr } = await supabase.from('timeline_events').insert({
        title: title.trim(),
        description: desc.trim() || null,
        date, media_url, media_type,
      });
      if (insErr) throw insErr;

      // 清空 & 通知外層刷新
      setTitle(''); setDate(''); setDesc(''); setFile(null);
      onCreated?.();
    } catch (e: any) {
      setErr(e?.message || '上傳失敗');
    } finally {
      setLoading(false);
    }
  };

  // 離線備案：匯入 JSON（[{title,date,description,media_url,media_type}]）
  const importJSON = async (f: File) => {
    try {
      const txt = await f.text();
      const arr = JSON.parse(txt);
      if (!Array.isArray(arr)) throw new Error('JSON 必須是陣列');
      const rows = arr.map((r: any) => ({
        title: String(r.title || '').trim(),
        date: String(r.date || ''),
        description: r.description ? String(r.description) : null,
        media_url: r.media_url ? String(r.media_url) : null,
        media_type: r.media_type === 'video' ? 'video' : (r.media_type === 'image' ? 'image' : null),
      }));
      if (!supabase) throw new Error('Supabase 尚未設定');
      const { error } = await supabase.from('timeline_events').insert(rows);
      if (error) throw error;
      onCreated?.();
      alert(`匯入 ${rows.length} 筆成功`);
    } catch (e:any) {
      setErr(e?.message || '匯入失敗');
    }
  };

  return (
    <div className="glow-card rounded-2xl bg-white/5 p-4 space-y-3">
      <h3 className="text-lg font-semibold">新增時間線事件</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded-lg bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-400"
          placeholder="標題"
          value={title}
          onChange={e=>setTitle(e.target.value)}
        />
        <input
          type="date"
          className="rounded-lg bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-400"
          value={date}
          onChange={e=>setDate(e.target.value)}
        />
      </div>

      <textarea
        className="w-full rounded-lg bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-400"
        placeholder="描述（可留空）"
        rows={3}
        value={desc}
        onChange={e=>setDesc(e.target.value)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={e=> setFile(e.target.files?.[0] || null)}
          className="text-sm"
        />
        {file && <span className="text-xs opacity-80">{file.name}</span>}
        <button
          onClick={submit}
          disabled={!canSubmit}
          className={`px-3 py-2 rounded-lg border border-white/10 transition
            ${canSubmit ? 'bg-fuchsia-500/30 hover:bg-fuchsia-500/40' : 'bg-white/10 opacity-70 cursor-not-allowed'}`}
        >
          {loading ? '上傳中…' : '新增事件'}
        </button>

        {/* 離線備案：匯入 JSON */}
        <label className="ml-auto text-xs opacity-80 inline-flex items-center gap-2">
          匯入 JSON
          <input type="file" accept="application/json" className="hidden" onChange={e=>{
            const f = e.target.files?.[0]; if (f) importJSON(f);
          }}/>
        </label>
      </div>

      {err && <p className="text-sm text-rose-300">{err}</p>}
    </div>
  );
}