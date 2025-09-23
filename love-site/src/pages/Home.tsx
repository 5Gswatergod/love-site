import Section from '../components/common/Section';
import FallingHearts from '../components/effects/FallingHearts';
import { NavLink } from 'react-router-dom';

export default function Home(){
  return (
    <>
      <FallingHearts />
      <Section title="給妳的星空" subtitle="Welcome">
        <p className="leading-relaxed">這是一個只屬於我們的小宇宙。往下走，妳會找到回憶、遊戲、彩蛋，最後——我的心裡話。</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <NavLink to="/timeline" className="px-4 py-2 rounded-full bg-indigo-500/30 hover:bg-indigo-500/50">回憶時間軸</NavLink>
          <NavLink to="/quiz" className="px-4 py-2 rounded-full bg-fuchsia-500/30 hover:bg-fuchsia-500/50">你最了解我嗎？</NavLink>
          <NavLink to="/game" className="px-4 py-2 rounded-full bg-blue-500/30 hover:bg-blue-500/50">小遊戲</NavLink>
        </div>
      </Section>
    </>
  );
}