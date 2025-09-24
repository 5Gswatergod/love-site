import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';

const _preloadAudioHref = `${import.meta.env.BASE_URL}assets/music/song.mp3`;
const link = document.createElement('link');
link.rel = 'preload';
link.as = 'audio';
link.href = _preloadAudioHref;
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);