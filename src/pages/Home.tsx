import Section from '../components/common/Section';
import PoyoButton from '../components/common/PoyoButton';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <Section title="甜甜主頁" subtitle="Home">
      <div className="text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent
                       bg-gradient-to-r from-pink-200 via-fuchsia-200 to-yellow-200 drop-shadow">
          嗨，小朋友！💖
        </h1>
        <p className="text-pink-100/90">
          這是一個屬於我們的甜甜小宇宙～<br/>
          點點星光，QQ 按鈕，還有滿滿的愛心。
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/timeline"><PoyoButton>🌸 看時間線</PoyoButton></Link>
          <Link to="/gallery"><PoyoButton>⭐ 看相簿</PoyoButton></Link>
        </div>
      </div>
    </Section>
  );
}