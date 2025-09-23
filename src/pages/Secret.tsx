import Section from '../components/common/Section';
import { useState } from 'react';
import { secretCodes, secretHints, normalizeCode } from '../data/secrets';

export default function Secret(){
  const [input, setInput] = useState('');
  const [ok, setOk] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);

  const check = () => setOk(secretCodes.some(c => normalizeCode(c) === normalizeCode(input)));

  return (
    <Section title="輸入我們的暗號" subtitle="Easter Egg">
      {ok? (
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold">解鎖成功！</h3>
          <p>番外：在星空下的祕密留言——「有妳的地方就是宇宙的中心」。</p>
        </div>
      ) : (
        <div className="max-w-sm mx-auto">
          <label className="block text-sm mb-2">輸入日期/暱稱/地點其中之一：</label>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="例如：2023/10/04"
                 className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={check} className="px-4 py-2 rounded-lg bg-fuchsia-500/40 hover:bg-fuchsia-500/60">解鎖</button>
            <button onClick={()=> setHintIdx(i=> Math.min(i+1, secretHints.length-1))} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">
              看提示 ({hintIdx+1}/{secretHints.length})
            </button>
          </div>
          <p className="mt-2 text-xs opacity-70">{secretHints[hintIdx]}</p>
        </div>
      )}
    </Section>
  );
}