import Section from '../components/common/Section';
import ProgressDots from '../components/common/ProgressDots';
import { quiz } from '../data/quiz';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link } from 'react-router-dom';

export default function Quiz(){
  const [answers, setAnswers] = useLocalStorage<number[]>("quiz-answers", Array(quiz.length).fill(-1));
  const correctCount = answers.reduce((acc, a, i)=> acc + (a === quiz[i].answerIndex? 1:0), 0);
  const canUnlock = correctCount >= 3; // 集 3 片碎片

  return (
    <Section title="你最了解我嗎？" subtitle="Quiz">
      <div className="space-y-5">
        {quiz.map((q, idx)=> (
          <div key={q.id} className="bg-white/5 rounded-xl p-4">
            <div className="text-sm opacity-70 mb-1">Q{idx+1}</div>
            <h3 className="font-semibold mb-3">{q.question}</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi)=>{
                const active = answers[idx] === oi;
                return (
                  <button key={oi}
                    onClick={()=> setAnswers(prev=>{ const p=[...prev]; p[idx] = oi; return p; })}
                    className={`text-left px-4 py-3 rounded-lg border border-white/10 hover:bg-white/10 transition ${active? 'bg-fuchsia-500/30 border-fuchsia-400/40' : ''}`}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {answers[idx] !== -1 && (
              <p className={`mt-2 text-sm ${answers[idx]===q.answerIndex? 'text-emerald-300' : 'text-rose-300'}`}>
                {answers[idx]===q.answerIndex? '答對了！(獲得心碎片)' : (q.explanation? `提示：${q.explanation}`:'加油！')}
              </p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between pt-2">
          <ProgressDots current={Math.min(correctCount, quiz.length)} total={quiz.length} />
          {canUnlock ? (
            <Link
              to="/final"
              className="px-4 py-2 rounded-full transition bg-indigo-500/40 hover:bg-indigo-500/60"
            >
              解鎖最終告白頁
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded-full bg-white/10 cursor-not-allowed"
              aria-disabled="true"
            >
              再答對幾題就能解鎖！
            </button>
          )}
        </div>
      </div>
    </Section>
  );
}