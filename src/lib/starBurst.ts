// Kirby 風小星星噴灑效果（無第三方）
export function starBurst(x: number, y: number, count = 24) {
  if (typeof document === 'undefined') return;

  const colors = ['#ffd166', '#ffe8a3', '#ffc6d9', '#c4b5fd', '#93c5fd'];
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = '✦';
    el.style.position = 'fixed';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.zIndex = '9999';
    el.style.pointerEvents = 'none';
    el.style.fontSize = `${Math.random() * 12 + 10}px`;
    el.style.color = colors[i % colors.length];
    el.style.textShadow = '0 0 8px rgba(255,255,255,.35)';
    frag.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const radius = 80 + Math.random() * 120;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius;
    const rotate = (Math.random() * 60 - 30) + 'deg';

    el.animate(
      [
        { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(.9) rotate(${rotate})`, opacity: 0 }
      ],
      {
        duration: 900 + Math.random() * 500,
        easing: 'cubic-bezier(.2,.8,.2,1)',
        fill: 'forwards'
      }
    ).finished.then(() => el.remove());
  }

  document.body.appendChild(frag);
}