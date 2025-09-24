// src/components/common/ShareButton.tsx
export default function ShareButton({
  title = document.title,
  text = '來看我們的星空藍紫網站 ✨',
  url = location.href,
  className = '',
}: { title?: string; text?: string; url?: string; className?: string }) {
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard?.writeText(url);
        alert('已複製分享連結！');
      }
    } catch {}
  };

  return (
    <button
      onClick={share}
      className={`rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-sm ${className}`}
      aria-label="分享這個頁面"
    >
      分享
    </button>
  );
}