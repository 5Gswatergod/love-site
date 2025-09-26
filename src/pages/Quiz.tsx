import { useState } from 'react';
import Section from '../components/common/Section';
import ProgressDots from '../components/common/ProgressDots';
import { quiz } from '../data/quiz';
import PoyoButton from '../components/common/PoyoButton';
import { Link } from 'react-router-dom';

export default function QuizPage(){
  const [current, setCurrent] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const q = quiz[current];
  const canUnlock = correctCount >= 3;

  const answer = (i:number)=>{
    if(i===q.answerIndex){
      alert('答對啦～✨');
      setCorrectCount(c=>c+1);
    }else{
      alert('再想想看 💭');
    }
    if(current < quiz.length-1) setCurrent(c=>c+1);
  };

  return (
    <Section title="甜甜小測驗" subtitle="Quiz">
      <div className="space-y-6 text-center">
        <h3 className="font-bold text-lg text-pink-200">{q.question}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt,i)=>(
            <PoyoButton key={i} onClick={()=>answer(i)}>{opt}</PoyoButton>
          ))}
        </div>

        <ProgressDots current={current+1} total={quiz.length} />

        <div className="pt-4">
          {canUnlock ? (
            <Link to="/secret" onClick={()=>alert('答對 3 題以上就能解鎖囉！')} >
              <PoyoButton>去打開密語吧～</PoyoButton>
            </Link>
          ) : (
            <button
              className="btn-poyo opacity-50 cursor-not-allowed"
              disabled
            >
              再答對幾題就能解鎖！
            </button>
          )}
        </div>
      </div>
    </Section>
  );
}