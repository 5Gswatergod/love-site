import Section from '../components/common/Section';
import { useState, useEffect, useRef } from 'react';
import { secretCodes, secretHints, normalizeCode } from '../data/secrets';

export default function Secret(){
  const [input, setInput] = useState('');
  const [ok, setOk] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const href = `${import.meta.env.BASE_URL}assets/music/little-one.wav`;
    const audio = new Audio(href);
    audio.loop = true;
    audio.volume = 0.8;
    // 某些瀏覽器需要使用者互動才允許自動播放
    audio.play().catch(() => {
      // 無需報錯，等使用者點擊互動再播放
    });
    audioRef.current = audio;

    return () => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    };
  }, []);

  const check = () => setOk(secretCodes.some(c => normalizeCode(c) === normalizeCode(input)));

  return (
    <Section title="輸入我們的暗號" subtitle="Easter Egg">
      {ok? (
        <div className="max-w-3xl mx-auto space-y-4 text-left">
          <h3 className="text-xl font-semibold text-center">解鎖成功！</h3>
          <div className="glow-card rounded-2xl bg-white/5 p-5 md:p-7">
            <article className="space-y-4 leading-8 tracking-wide text-[15px] md:text-base">
              <p>
                小朋友認識妳是我一生的緣分 愛上小朋友更是我一生的幸福 我愛妳並不是為了摟摟抱抱 而是情不自禁的在乎妳、關心妳、惦記妳、想懂妳 這些不是因為我執著 而是因為你值得 我不管外界如何 那些都和我沒關係 在我眼裡小朋友才是最好嘟也是我最喜歡嘟 從認定妳ㄉ那天開始 我就準備要一直護著小朋友 不要質疑我對妳ㄉ愛 說愛妳就要一直愛下去 我愛妳 並將在每一個愛妳的日子里 用盡我所有的一切
              </p>
              <p>
                妳在我這裡永遠都是小朋友 我就要把我所有的溫柔和偏愛都給妳 我要永遠保護妳 過馬路的時候小朋友嘟手要由我牽著 好看嘟照片我會給小朋友拍ㄉ 冬天嘟第一杯奶茶我來給妳買 冰冷ㄉ被窩我會給妳暖 總之小朋友嘟一切都歸我負責都歸我管 我就要這樣肆無忌憚的愛著小朋友 就要一直這樣陪在小朋友身邊 如果有什麼做的不到位ㄉ 讓小朋友委屈惹 小朋友就大聲的指責我 小朋友這麼可愛 這麼漂釀 所以我不能讓小朋友受委屈 一點點都不行
              </p>
              <p>
                小朋友有壓力的時候 就跟我說～ 不許自己一個人扛 因為小朋友不是一個人ㄌ 背後可是有我呢！那些東西是我該幫小朋友分擔ㄉ 我不太善於表達 但小朋友以後碰到什麼做了什麼 無論有趣的還是無聊的都可以告訴我 我想聽！我就希望小朋友每天纏著我 喜歡被小朋友粘著 直到我們都白髮的那一天
              </p>
              <p className="pt-2 text-center">
                兩個月快樂鴨 我可愛漂釀動人嘟小朋友<br/>
                抱抱～木嘛(//∇//)
              </p>
            </article>
          </div>
        </div>
      ) : (
        <div className="max-w-sm mx-auto">
          <label className="block text-sm mb-2">輸入日期/暱稱/地點其中之一：</label>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="例如：2025/10/10、小豬、天旋地轉"
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