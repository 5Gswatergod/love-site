import Section from '../components/common/Section';
import { useState } from 'react';
import { loveNotes } from '../data/loveNotes';

type Balloon = { id:number; popped:boolean; text:string };

export default function Game(){
  const msgs = loveNotes.slice(0,8);
  const [list, setList] = useState<Balloon[]>(() =>
    Array.from({length: 8}).map((_,i)=> ({ id:i, popped:false, text: msgs[i] }))
  );
  const popped = list.filter(b=>b.popped).length;
  const done = popped >= 6;

  return (
    <Section title="把祝福氣球全戳破！" subtitle="Mini Game">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {list.map(b => (
          <button key={b.id} disabled={b.popped}
            onClick={()=> setList(prev=> prev.map(x => x.id===b.id? {...x, popped:true}:x))}
            className={`aspect-square rounded-2xl border border-white/10 flex items-center justify-center text-center p-3 transition ${b.popped? 'bg-black/20 opacity-50' : 'bg-blue-500/30 hover:bg-blue-500/50'}`}>
            {b.popped? '🎉' : '🎈'}
          </button>
        ))}
      </div>
      <p className="mt-4 text-center opacity-90">已戳破：{popped}/8</p>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {list.filter(b=>b.popped).map(b=> (
          <div key={b.id} className="bg-white/5 rounded-lg px-3 py-2 text-center">{b.text}</div>
        ))}
      </div>
      {done && <p className="mt-6 text-center text-emerald-300">太棒了！回到上方導覽，去 Final 接收驚喜吧！</p>}
    </Section>
  );
}