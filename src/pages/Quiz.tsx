import { useState, useEffect } from 'react';
import Section from '../components/common/Section';
import ProgressDots from '../components/common/ProgressDots';
import { quiz } from '../data/quiz';
import PoyoButton from '../components/common/PoyoButton';
import { Link } from 'react-router-dom';

export default function QuizPage(){
  const [current, setCurrent] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);

  const q = quiz[current];
  const canUnlock = correctCount >= 3;

  useEffect(() => { setHasAnswered(false); }, [current]);

  const answer = (i:number)=>{
    if (hasAnswered) return; // 防止同一題重複作答刷分
    setHasAnswered(true);

    if(i===q.answerIndex){
      alert('答對啦～✨真不愧是我聰明、細心ㄉ小朋友～💕');
      setCorrectCount(c=>c+1);
    }else{
      alert('再想想看ㄅㄚ 💭');
    }
    if(current < quiz.length-1) setCurrent(c=>c+1);
  };

  return (
    <Section title="甜甜小測驗" subtitle="Quiz">
      <div className="space-y-6 text-center">
        <h3 className="font-bold text-lg text-pink-200">{q.question}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt,i)=>(
            <PoyoButton key={i} onClick={()=>answer(i)} disabled={hasAnswered}>
              {opt}
            </PoyoButton>
          ))}
        </div>

        <ProgressDots current={current+1} total={quiz.length} />

        <div className="pt-4">
          <Link
            to="/secret"
            onClick={(e)=>{
              if(!canUnlock){
                e.preventDefault();
                alert('再答對幾題就能解鎖！');
              }
            }}
          >
            <span className={!canUnlock ? 'opacity-60' : ''} aria-disabled={!canUnlock}>
              <PoyoButton>去打開密語吧～</PoyoButton>
            </span>
          </Link>
        </div>
      </div>
    </Section>
  );
}