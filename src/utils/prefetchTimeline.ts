// src/utils/prefetchTimeline.ts
import { supabase } from '../lib/supabase';

// 動態建立 <link rel="preconnect">，加速 TLS/握手
function preconnect(href: string) {
  if (!href) return;
  const u = new URL(href);
  const host = `${u.protocol}//${u.host}`;
  if (document.querySelector(`link[data-preconnect="${host}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'preconnect';
  l.crossOrigin = 'anonymous';
  l.href = host;
  l.setAttribute('data-preconnect', host);
  document.head.appendChild(l);
}

function preloadScript(href: string) {
  // 給 Vite 分包檔預告（可能命中/可能略過，屬於 hint）
  const l = document.createElement('link');
  l.rel = 'prefetch';
  l.as = 'script';
  l.href = href;
  document.head.appendChild(l);
}

// 用 <img> 權宜預載圖片（瀏覽器會快取）
function warmImage(src: string) {
  if (!src) return;
  const img = new Image();
  img.decoding = 'async';
  img.loading = 'eager';
  img.src = src;
}

let inFlight: Promise<void> | null = null;

/** 對外主函式：預連線 + 拉前幾筆事件 + 預載圖片 */
export async function prefetchTimeline() {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      // 1) 預連線 supabase api 與 storage（從目前 supabase client 推得）
      const url = (supabase as any)?.supabaseUrl as string | undefined;
      if (url) {
        preconnect(url);
        // storage 也是同域下的 /storage/v1/...，preconnect 同 host 即可
      }

      // 2) 預抓路由 chunk（如果你已 lazy 路由，這一步可省）
      //   這行會觸發 Vite 生成並下載 ./pages/Timeline 的分包
      import('../pages/Timeline').catch(() => {});
      // （可選）也加個 hint（非必需）
      preloadScript(`${import.meta.env.BASE_URL}assets/Timeline*.js`);

      // 3) 抓前 12 筆事件，並預載圖片（只處理 image；影片不預載）
      if (supabase) {
        const { data } = await supabase
          .from('timeline_events')
          .select('media_url, media_type')
          .order('date', { ascending: true })
          .limit(12);

        (data ?? [])
          .filter(r => r.media_type === 'image' && typeof r.media_url === 'string')
          .forEach(r => warmImage(r.media_url as string));
      }
    } catch {}
  })();

  return inFlight.finally(() => { inFlight = null; });
}