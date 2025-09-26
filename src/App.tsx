import { Routes, Route, NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { prefetchTimeline } from './utils/prefetchTimeline';
import Home from './pages/Home';
import Timeline from './pages/Timeline';
import Gallery from './pages/Gallery';
import Quiz from './pages/Quiz';
import Game from './pages/Game';
import Secret from './pages/Secret';
import Final from './pages/Final';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Starfield from './components/effects/Starfield';
import BackToTop from './components/common/BackToTop';
import KirbyBuddy from './components/common/KirbyBuddy';

export default function App() {
  return (
    useEffect(() => {
      const idel = (cb: () => void) => {
        const ric = window.requestIdleCallback || ((f:Function) => setTimeout(f, 600));
        ric(() => cb());
      };
      // 預載時間線頁面（因為比較大）
      idel(()=> {prefetchTimeline(); });
    }, []),
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <Starfield />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/timeline" element={<Timeline/>} />
          <Route path="/gallery" element={<Gallery/>} />
          <Route path="/game" element={<Game/>} />
          <Route path="/quiz" element={<Quiz/>} />
          <Route path="/secret" element={<Secret/>} />
          <Route path="/final" element={<Final/>} />
          <Route path="*" element={<div className="text-center py-20">404 Not Found. <NavLink to="/" className="underline">Go Home</NavLink></div>} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <KirbyBuddy />
    </div>
  );
}