import { Routes, Route, NavLink } from 'react-router-dom';
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

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <Starfield />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/timeline" element={<Timeline/>} />
          <Route path="/gallery" element={<Gallery/>} />
          <Route path="/quiz" element={<Quiz/>} />
          <Route path="/game" element={<Game/>} />
          <Route path="/secret" element={<Secret/>} />
          <Route path="/final" element={<Final/>} />
          <Route path="*" element={<div className="text-center py-20">404 Not Found. <NavLink to="/" className="underline">Go Home</NavLink></div>} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}