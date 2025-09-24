// src/lib/publicUrl.ts
/** Join with Vite's BASE_URL safely (handles / or /repo/). */
export function publicUrl(path: string) {
  const base = import.meta.env.BASE_URL || '/';
  // ensure exactly one slash between base and path
  return (base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '')).replace(/\/{2,}/g, '/');
}