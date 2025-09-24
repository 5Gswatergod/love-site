import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (url && key)
  ? createClient(url, key)
  : null; // 沒設定就回傳 null，等於不啟用雲端同步